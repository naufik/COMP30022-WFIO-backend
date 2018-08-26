import * as Bluebird from 'bluebird';

import Carer from '../models/carer.model';
import Elder from '../models/elder.model';

import { NewUserData } from '../interfaces/user.interface';

export default class UserController {
    public static createUser(user: NewUserData): Bluebird<any> {
        if (user.accountType == "CARER") {
            return Carer.create({
                email: user.email,
                password: user.password,
                fullName: user.fullName, 
            });
        } else if (user.accountType == "ELDER") {
            return Elder.create({
                email: user.email,
                password: user.password,
                fullName: user.fullName,
            });
        } else {
           return Bluebird.reject(new Error("6001: Invalid account type given."));
        }
    }
}