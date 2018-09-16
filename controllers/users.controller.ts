import * as Bluebird from 'bluebird';

import Carer from '../models/carer.model';
import Elder from '../models/elder.model';
import ElderHasCarer from '../models/elderHasCarer.model';
import Favorites from '../models/favorites.model';
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

    public static getUserByEmail(email: string): Bluebird<any | null> {
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
        }).then((userInfo: any) => {
            if (userInfo != null) {
                const user = userInfo.user.toJSON();
                if (userInfo.kind === "ELDER") {
                    // need to extract list of carers and list of favorite locations.
                    return Bluebird.all([
                        Favorites.findAll({
                            where: {
                                elderId: user.id
                            }
                        }),
                        ElderHasCarer.findAll({
                            where: {
                                elderId: user.id
                            }
                        })
                    ]).spread((favorites: any[], connections: any[]) => {
                        user.favorites = favorites.map(thing => thing.toJSON());
                        user.carersList = connections.map(thing => thing.toJSON().carerId);
                        return user;
                    });
                } else if (userInfo.kind == "CARER") {
                    // need to extract the list of elders this guy is taking care of
                    return ElderHasCarer.findAll({
                        where: {
                            carerId: user.id
                        }
                    }).then((connections: any[]) => {
                        user.eldersList = connections.map(thing => thing.toJSON().elderId);
                        return user;
                    });
                } else {
                    return Bluebird.reject(new Error("0000: Not Implemented"));
                }
            }              
        });
    }

    public static updateUser(user: User): Bluebird<any> {
        return Bluebird.reject(new Error("0000: Not implemented."));
    }

    /**
     * Methods to link a carer and an elder.
     */

    public static linkUsers(id: {elder: string | number, carer: string | number}) {
        return Bluebird.reject(new Error("0000: Not implemented."));
    }
}