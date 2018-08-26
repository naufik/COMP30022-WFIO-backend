import * as Crypto from 'crypto';
import * as Bluebird from 'bluebird';

import AuthConfig from '../.serverconfig/auth';
import Carer from '../models/carer.model';
import Elder from '../models/elder.model';
import { Token } from '../interfaces/action.interface';

export default class AuthController {
    public static passHash(pass: string): string {
        return Crypto.createHash("sha1")
            .update(AuthConfig.preSalt(pass) + pass + AuthConfig.postSalt(pass))
            .digest().toString();
    }

    public static generateToken(userId: string): Bluebird<string> {
        return Bluebird.reject(new Error("0000: Not yet implemented."));
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
            }).then((user) => {
                
                if (user == null) {
                    // this means that the user failed to authenticate, either
                    // the username or the password is wrong.
                    return Bluebird.reject(new Error("5010: Login failure."))
                }

                return Bluebird.resolve({
                    token: "REPLACE THIS!" //REPLACE THIS
                });
            });
        } else if (user.accountType == "CARER") {
            return Carer.findOne({
                where: {
                    username: user.username,
                    password: AuthController.passHash(user.password),
                }
            }).then((user) => {
                
                if (user == null) {
                    // this means that the user failed to authenticate, either
                    // the username or the password is wrong.
                    return Bluebird.reject(new Error("5010: Login failure."))
                }

                return Bluebird.resolve({
                    token: "REPLACE THIS!" //REPLACE THIS
                });
            });
        } else {
            return Bluebird.reject(new Error("6001: Invalid account type."));
        }
    }
}