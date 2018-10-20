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

    /**
     * 
     * @param email 
     * @param clean 
     */
    public static getUserByEmail(email: string, clean: boolean = false): Bluebird<any | null> {
        const data = Bluebird.all([
            Elder.findOne({
                where: {
                    email: email,
                }
            }),
            Carer.findOne({
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
                        return Bluebird.all(connections.map(thing => {
                          return Carer.findById(thing.toJSON().carerId);  
                        })).then((clist) => {
                            user.carersList = clist.map((c: any) => {
                                const car = c.toJSON();
                                return {
                                    id: car.id,
                                    fullname: car.fullname,
                                    username: car.username,
                                    email: car.email,
                                }
                            });
                            return user;
                        });
                    });
                } else if (userInfo.kind == "CARER") {
                    // need to extract the list of elders this guy is taking care of
                    return ElderHasCarer.findAll({
                        where: {
                            carerId: user.id
                        }
                    }).then((connections: any[]) => {
                        return Bluebird.all(connections.map(thing => {
                            return Elder.findById(thing.toJSON().elderId);  
                          })).then((elist) => {
                              user.eldersList = elist.map((e: any) => {
                                  const eld = e.toJSON();
                                  return {
                                    id: eld.id,
                                    email: eld.email,
                                    fullname: eld.fullname,
                                    username: eld.username,
                                }
                              });
  
                              return user;
                          });
                    });
                } else {
                    return Bluebird.reject(new Error("0000: Not Implemented"));
                }
            }              
        }).then((userInfo) => {
            const user = userInfo;
            user.accountType = (userInfo.favorites ? "ELDER" : "CARER");
            return userInfo;
        });

        if (clean) {
            return data.then((userInfo: any) => {
                delete userInfo.password;
                delete userInfo.id;
                return userInfo;
            });
        }

        return data.then((info) => {
            return info;
        });
    }

    public static updateUser(user: User): Bluebird<any> {
        return UserController.getUserByEmail(<string>user.email, false)
            .then((result: any) => {
                if (result != null) {
                    let table = user.accountType === "ELDER" ? Elder : Carer;
                    if (user.fullName) {
                        table.update({
                            fullname: user.fullName,
                        }, {
                            where: {
                                id: result.id,
                            }
                        });
                    }
                    if (user.password) {
                        table.update({
                            password: AuthController.passHash(user.password),
                        }, {
                            where: {
                                id: result.id,
                            }
                        });
                    }
                    if (user.connections) {
                        let query: any = {};
                        query[result.accountType === "ELDER" ? "elderId" 
                            : "carerId"] = result.id;
                        ElderHasCarer.findAll({
                            where: query
                        }).then((cnns) => {
                            console.log(cnns);
                            let remove: Bluebird<any>[] = [];
                            cnns.forEach((thing: any) => {
                                let keep: boolean = false;
                                if (result.accountType === "ELDER") {
                                    user.connections.forEach((carer) => {
                                        if (carer.id === thing.toJSON().carerId) {
                                            keep = true;
                                        }
                                    })
                                } else if (result.accountType === "CARER") {
                                    console.log(thing.toJSON().carerId);
                                    user.connections.forEach((elder) => {
                                        if (elder.id === thing.toJSON().elderId) {
                                            keep = true;
                                        }
                                    })
                                }

                                if (!keep) {
                                    remove.push(ElderHasCarer.destroy({
                                        where: {
                                            id: thing.id,
                                        }
                                    }));
                                }

                                return remove
                            });
                        });
                    }
                }
                return null;
            }).then((thing) => {
                if (thing == null) {
                    return Bluebird.resolve({
                        success: false,
                    });
                } else {
                    return UserController.getUserByEmail(<string>user.email, true)
                        .then((newUser) => {
                            return {
                                success: true,
                                user: newUser,
                            }
                    });
                }
            });
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

    public static requestLink(elder: number): Bluebird<any> {
        let randNum = Math.floor(100000 + Math.random() * 899999);

        let timeIn30Minutes = new Date();
        timeIn30Minutes.setMinutes(timeIn30Minutes.getMinutes() + 30);

        let returnedPromise = TwoFactorCode.findOrCreate({
            where: {
                code: randNum.toString(),
            },
            defaults: {
                elderId: elder,
            }
        }).spread((code: any, created: boolean) => {
            if (!created) {
                code.elderId = elder;
                return code.save();
            }
            return code;
        });

        return returnedPromise;
    }

    public static acceptLink(carerId: string, linkNumber: string) {
        return TwoFactorCode.findOne({
            where: {
                code: linkNumber
            }
        }).then((code: any) => {
            if (code == null) {
                return Bluebird.reject("Error: Two factor code incorrect.`")
            }
            return Elder.findById(code.elderId);
        }).then((user: any) => {
            return Carer.findOne({
                where: {
                    email: carerId
                }
            }).then((carer: any) => {
                return UserController.linkUsers({
                    elder: user.id,
                    carer: carer.id,
                });
            }).then((result) => {
                return {
                    elderId: user.id,
                    code: linkNumber,
                } 
            });
        });
    }
}