import * as Crypto from 'crypto';
import * as Bluebird from 'bluebird';

import AuthConfig from '../.serverconfig/auth';
import Carer from '../models/carer.model';
import Elder from '../models/elder.model';
import ElderToken from '../models/elderToken.model';
import CarerToken from '../models/carerToken.model';
import { Token } from '../interfaces/action.interface';

export default class AuthController {

	/**
	 * Salts the password using a predefined pre- and post- salt that is predefined in a
	 * hidden folder. Then hashes it using the SHA-1 algorithm.
	 * @param pass The string to be salted and hashed.
	 */
	public static passHash(pass: string): string {
		return Crypto.createHash("sha1")
			.update(AuthConfig.preSalt(pass) + pass + AuthConfig.postSalt(pass))
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

		console.log(publicKey);
		console.log(privateKey);
		let tokenPromise: Bluebird<any>;
		// store public to database...
		if (user.kind === "ELDER") {
			tokenPromise = ElderToken.findOrCreate({
				where: {
					elderId: user.id,
					token: publicKey,
				}
			}).then((token: any) => {
				token.token = publicKey;
				return token.save();
			});
		} else if (user.kind === "CARER") {
			tokenPromise = CarerToken.findOrCreate({
				where: {
					carerId: user.id
				}
			}).then((token: any) => {
				token.token = publicKey;
				return token.save();
			});
		} else {
			return Bluebird.reject("6001: Invalid account type;")
		}
		
		return tokenPromise.then((tokenObj) => {
			return privateKey;
		});
	}

	/**
	 * Authenticates the user to perform a specific action, such that the action can
	 * be carried out.
	 * @todo FINISH THIS METHOD
	 * @param tokenId 
	 */
	public static authenticate(tokenId): Bluebird<{ verified: boolean, token: Token }> {
		// This method should generate a random alphanumeric string, then encrypts it
		// with the public key. An attempt to decrypt with the private key should then
		// determine whether they are a key pair or not (if it results in identity).
		return Bluebird.reject(new Error("0000: Not yet implemented."));
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
			console.log(elderFound);
			console.log(carerFound);
			if (elderFound == null && carerFound == null) {
				return Bluebird.reject("Error 5000: Cannot Find Account");
			}
			
			const userFound = (elderFound != null) ? elderFound : carerFound;

			return AuthController.generateToken({
				id: userFound,
				kind: (elderFound != null) ? "ELDER" : "CARER",
			}).then((tokenString: string): Token => {
				return {
					token: tokenString,
					user: (elderFound != null) ? elderFound : carerFound,
				};
			});

		});

	}
}