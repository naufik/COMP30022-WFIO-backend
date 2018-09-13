import * as Bluebird from 'bluebird';

import Carer from '../models/carer.model';
import Elder from '../models/elder.model';
import ElderHasCarer from '../models/elderHasCarer.model';
import Favorites from '../models/favorites.model';
import TwoFactorCode from '../models/twoFactorCode.model';
import AuthController from './auth.controller';
import { NewUser, User } from '../interfaces/user.interface';

export default class UserController {
    public static createUser(user: NewUser): Bluebird<any> {
        let returnedPromise: Bluebird<any>;

        if (user.accountType == "CARER") {
            returnedPromise = Carer.create({
                email: user.email,
                password: AuthController.passHash(user.password),
                fullname: user.fullName,
                username: user.username, 
            });
        } else if (user.accountType == "ELDER") {
            returnedPromise = Elder.create({
                email: user.email,
                password: AuthController.passHash(user.password),
                fullname: user.fullName,
                username: user.username,
            });
        } else {
           returnedPromise = Bluebird.reject(new Error("6001: Invalid account type given."));
        }

        return returnedPromise;
    }

    public static getUserByEmail(email: string): Bluebird<{ user: User, kind: string } | null> {
        return Bluebird.all([
            Carer.findOne({
                where: {
                    email: email,
                }
            }),
            Elder.findOne({
                where: {
                    email: email,
                }
            })
        ]).spread((elderFound: any, carerFound: any) => {
            if (elderFound == null && carerFound == null) {
                return null
            }

            const userFound = (elderFound != null) ? elderFound : carerFound;
            return {
                user: userFound,
                kind: (elderFound != null) ? "ELDER" : "CARER",
            };
        })
    }

    public static updateUser(user: User): Bluebird<any> {
        return Bluebird.reject(new Error("0000: Not implemented."));
    }

    /**
     * Methods to link a carer and an elder.
     */

    public static linkUsers(id: {elder: string | number, carer: string | number}) {
        ElderHasCarer.findOrCreate({
            where: {
            elderId: id.elder,
            carerId: id.carer,
            }
        }).then((item) => {
            return {
                success: true,
            }
        });
    }

    public static requestLink() {
        // CREATE RANDOM NUMBER
    }

    public static acceptLink(linkNumber: string) {
        TwoFactorCode.findOne({
            where: {
                code: linkNumber
            }
        }).then((code: any) => {
            return Elder.findById(code.elderId);
        }).then((user: any) => {
            return {
                elderId: user.id,
                code: linkNumber,
            } 
        });
    }
}