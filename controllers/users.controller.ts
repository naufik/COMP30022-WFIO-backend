import * as Bluebird from 'bluebird';

import Carer from '../models/carer.model';
import Elder from '../models/elder.model';
import Favorites from '../models/favorites.model';
import AuthController from './auth.controller';
import { NewUser, User } from '../interfaces/user.interface';

export default class UserController {
    public static createUser(user: NewUser): Bluebird<any> {
        if (user.accountType == "CARER") {
            return Carer.create({
                email: user.email,
                password: AuthController.passHash(user.password),
                fullName: user.fullName, 
            });
        } else if (user.accountType == "ELDER") {
            return Elder.create({
                email: user.email,
                password: AuthController.passHash(user.password),
                fullName: user.fullName,
            });
        } else {
           return Bluebird.reject(new Error("6001: Invalid account type given."));
        }
    }

    public static updateUser(user: User): Bluebird<any> {
        return Bluebird.reject(new Error("0000: Not implemented."));
    }

    /**
     * Need to add Methods that *READ* data here.
     */

    public static getElderData(id: string | number): Bluebird<User> {
       return Bluebird.reject(new Error("0000: Not implemented."));
    }

    public static getCarerData(id: string | number): Bluebird<User> {
        return Bluebird.reject(new Error("0000: Not implemented."));
    }

    /**
     * Methods to link a carer and an elder.
     */

    public static linkUsers(id: {elder: string | number, carer: string | number}) {
        return Bluebird.reject(new Error("0000: Not implemented."));
    }
}