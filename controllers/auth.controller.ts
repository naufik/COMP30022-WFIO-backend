import * as Crypto from 'crypto';
import AuthConfig from '../.serverconfig/auth';
import Carer from '../models/carer.model';

export class AuthController {
    public static passHash(pass: string): string {
        return Crypto.createHash("sha1")
            .update(AuthConfig.preSalt(pass) + pass + AuthConfig.postSalt(pass))
            .digest().toString();
    }
}