import * as Crypto from 'crypto';
import * as Bluebird from 'bluebird';

import AuthConfig from '../.serverconfig/auth';
import Carer from '../models/carer.model';
import Elder from '../models/elder.model';
import ElderToken from '../models/elderToken.model';
import CarerToken from '../models/carerToken.model';
import { Token } from '../interfaces/action.interface';

export default class AuthController {
    public static passHash(pass: string): string {
        return Crypto.createHash("sha1")
            .update(AuthConfig.preSalt(pass) + pass + AuthConfig.postSalt(pass))
            .digest("hex").toString();
    }

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
    
    public static authenticate(tokenId): Bluebird<{ verified: boolean, token: Token }> {
        return Bluebird.reject(new Error("0000: Not yet implemented."));
    }

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