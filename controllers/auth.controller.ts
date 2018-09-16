import * as Crypto from 'crypto';
import * as Bluebird from 'bluebird';

import _authconfig from '../.serverconfig/auth';
import Carer from '../models/carer.model';
import Elder from '../models/elder.model';
import ElderToken from '../models/elderToken.model';
import CarerToken from '../models/carerToken.model';
import { Token } from '../interfaces/action.interface';
import { User } from '../interfaces/user.interface';
import * as SQL from 'sequelize';
import UserController from './users.controller';

export default class AuthController {

	/**
	 * Salts the password using a predefined pre- and post- salt that is predefined in a
	 * hidden folder. Then hashes it using the SHA-1 algorithm.
	 * @param pass The string to be salted and hashed.
	 */
	public static passHash(pass: string): string {
		return Crypto.createHash("sha1")
			.update(_authconfig.preSalt(pass) + pass + _authconfig.postSalt(pass))
			.digest("hex").toString();
	}

	/**
	 * Generates a pair of public and private keys that can be used to authenticate a
	 * user without logging in. This is called every time someone is logged in.
	 * 
	 * Tokens are used in actions in order to authenticate the sender of the action. The
	 * public key is stored in the database while the private key is sent back to the
	 * user.
	 * @param user The user to generate the token to.
	 */
	private static generateToken(user: { id: string, kind: "ELDER" | "CARER" }): Bluebird<string> {
		const dH = Crypto.createDiffieHellman(60);
		dH.generateKeys("base64");
		const publicKey = dH.getPublicKey("hex");
		const privateKey = dH.getPrivateKey("hex");

		let tokenPromise: Bluebird<any>;
		// store public to database...
		if (user.kind === "ELDER") {
			tokenPromise = ElderToken.findOrCreate({
				where: {
					elderId: user.id,
				},
				defaults: {
					token: publicKey,
				}
			})
		} else if (user.kind === "CARER") {
			tokenPromise = CarerToken.findOrCreate({
				where: {
					carerId: user.id
				},
				defaults: {
					token: publicKey,
				}
			})
		} else {
			return Bluebird.reject("6001: Invalid account type;")
		}
		
		return tokenPromise.spread((tokenObj: any, created: boolean) => {
			if (!created) { 
				tokenObj.token = publicKey
				return tokenObj.save();
			}
		}).then(() => {
			return privateKey;
		});
	}

	/**
	 * Authenticates the user to perform a specific action, such that the action can
	 * be carried out.
	 * @todo FINISH THIS METHOD
	 * @param tokenId 
	 */
	public static authenticate(userEmail: string, tokenId: string): Bluebird<{ verified: boolean, token: Token }> {
		// This method should generate a random alphanumeric string, then encrypts it
		// with the public key. An attempt to decrypt with the private key should then
		// determine whether they are a key pair or not (if it results in identity).
		const randStr = "O(n^4) algorithms are good enough CHANGE MY MIND";

		const pubK = _authconfig.serverPublic;
		const prvK = _authconfig.serverPrivate;
		const serverDH = Crypto.createDiffieHellman(60);
		
		serverDH.setPrivateKey(prvK, "hex");
		serverDH.setPublicKey(pubK, "hex");

		return UserController.getUserByEmail(userEmail)
			.then((value: {user: any, kind: string}) => {
				if (value != null) {
					if (value.kind == "ELDER") {
						return ElderToken.findOne({
							where: {
								elderId: value.user.id
							}
						});
					} else if (value.kind == "CARER") {
						return CarerToken.findOne({
							where: {
								carerId: value.user.id
							}
						});
					}
				}
				return Bluebird.reject(new Error("Unknown Error"));
			}).then((tokenThing:any) => {
				let verificationDone: boolean = false;
				if (tokenThing != null) {
					const userDH = Crypto.createDiffieHellman(60);

					userDH.setPrivateKey(tokenId, "hex");
					userDH.setPublicKey(tokenThing.token, "hex");
					
					let lhs = userDH.computeSecret(serverDH.getPublicKey());
					let rhs = serverDH.computeSecret(userDH.getPublicKey());
					verificationDone = lhs == rhs;
				}
				return {
					verified: verificationDone,
					token: {
						token: tokenId
					}
				}
			})
		

	}


	/**
	 * Authenticates the user and sends back a token.
	 * @param user the user to be authenticated.
	 */
	public static login(user: { username: string, password: string }): Bluebird<Token> {
		
		return Bluebird.all([Elder.findOne({
			where: {
				username: user.username,
				password: AuthController.passHash(user.password),
			}
		}), Carer.findOne({
			where: {
				username: user.username,
				password: AuthController.passHash(user.password),
			}
		})]).spread((elderFound: any, carerFound: any) => {
			if (elderFound == null && carerFound == null) {
				return Bluebird.reject("Error 5000: Cannot Find Account");
			}
			
			const userFound = (elderFound != null) ? elderFound : carerFound;
			userFound.accountType = (elderFound != null) ? "ELDER" : "CARER";

			return AuthController.generateToken({
				id: userFound.id,
				kind: userFound.accountType,
			}).then((tokenString: string): Token => {
				return {
					token: tokenString,
					user: userFound,
				};
			});
		});

	}
}