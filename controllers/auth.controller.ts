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
    private static generateToken(user: {id: string, kind: "ELDER" | "CARER"}): Bluebird<string> {
        const dH = Crypto.createDiffieHellman(60);
        dH.generateKeys("base64");
        const publicKey = dH.getPublicKey("hex");
        const privateKey = dH.getPrivateKey("hex");
        
        let tokenPromise: Bluebird<any> = Bluebird.reject("6001: Invalid account type");
        // store public to database...
        if (user.kind == "ELDER") {
            tokenPromise = ElderToken.findOrCreate({
                where: {
                    elderId: user.id
                }
            }).then((token: any) => {
                token.token = publicKey;
                return Elder.findById(user.id).then((user: any) => {
                    token.setElder(user);
                    return token.save();
                });
            });
        } else if (user.kind == "CARER") {
            tokenPromise = CarerToken.findOrCreate({
                where: {
                    carerId: user.id
                }
            }).then((token: any) => {
                token.token = publicKey;
                return Carer.findById(user.id).then((user: any) => {
                    token.setCarer(user);
                    return token.save();
                });
            });
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
    public static login(user: {username: string, password: string, accountType: string}): Bluebird<Token>{
        if (user.accountType == "ELDER") {
            return Elder.findOne({
                where: {
                    username: user.username,
                    password: AuthController.passHash(user.password),
                }
            }).then((user: any) => {
                if (user == null) {
                    // this means that the user failed to authenticate, either
                    // the username or the password is wrong.
                    return Bluebird.reject(new Error("5010: Login failure."))
                }

                return AuthController.generateToken({
                    id: user.id,
                    kind: "ELDER",
                }).then((tokenString) => {
                    return {
                        token: tokenString
                    };
                });
            });
        } else if (user.accountType == "CARER") {
            return Carer.findOne({
                where: {
                    username: user.username,
                    password: AuthController.passHash(user.password),
                }
            }).then((user: any) => {
                
                if (user == null) {
                    // this means that the user failed to authenticate, either
                    // the username or the password is wrong.
                    return Bluebird.reject(new Error("5010: Login failure."))
                }

                return AuthController.generateToken({
                    id: user.id,
                    kind: "CARER",
                }).then((tokenString) => {
                    return {
                        token: tokenString
                    };
                });
            });
        } else {
            return Bluebird.reject(new Error("6001: Invalid account type."));
        }
    }
}