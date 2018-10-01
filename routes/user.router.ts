import { Router, Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import UserController from '../controllers/users.controller'
import { Action, Receipt, Token } from '../interfaces/action.interface';
import { NewUser, Credentials, User } from '../interfaces/user.interface';
import * as Bluebird from 'bluebird';

const UserRouter: Router = Router();
const RouterFunctions: any = {}

UserRouter.get('/', (req: Request, res: Response) => {
    if (req.headers) {
        const identity = req.headers["xwfio-identity"]
        const token = req.headers["xwfio-secret"]
        UserController.getUserByEmail(<string>identity, true).then((user) => {
            res.json({
                ok: true,
                result: { 
                    user: user
                },
            });
        });
    }
    
});

UserRouter.post('/', (req: Request, res: Response) => {
    let actionRequest: Action<any> = req.body;
    let actionReceipt: Bluebird<Receipt<any>>;

    console.log("New request received: " + actionRequest.action);
    console.log(actionRequest);
    switch (actionRequest.action) {
        case "user.signup":
            actionReceipt = RouterFunctions.signUp(actionRequest.params);
            break;
        case "user.login":
            actionReceipt = RouterFunctions.login(actionRequest.params);
            break;
        case "user.genlink":
            // actionReceipt = AuthController.authenticate(req.body.identity.email, req.body.identity.token).then((auth) => {
                // if (auth.verified) {
                    actionReceipt =  RouterFunctions.getLinkCode(req.body.identity.email);
                // } else {
                    // return Bluebird.reject("403: Forbidden Access");
                // }
            // });
            break;
        case "user.link":
            actionReceipt = RouterFunctions.linkElder(req.body.identity.email, actionRequest.params);
            break;
        case "user.authtest":
            actionReceipt = AuthController.authenticate(req.body.identity.email, req.body.identity.token).then((auth) => {
                return {
                    ok: true,
                    result: auth,
                };
            });
            break;
        case "user.details":
            actionReceipt = UserController.getUserByEmail(req.body.identity.email, true).then((userInfo) => {
                return {
                    ok: true,
                    result: userInfo
                };
            });
            break;
        case "user.modify":
            let par: User = <User> actionRequest.params ;
            par.email = req.body.identity.email;

            actionReceipt = UserController.updateUser(par).then((info) => {
                let rec: any = {
                    ok: info.success,
                }

                if (info.user) {
                    rec.result = info.user;
                }

                return rec;
            })
            break;
        default:
            actionReceipt = Bluebird.reject(new Error("Invalid Action"));
            break;
    }

    actionReceipt.then((value) => {
        res.json(value);
    }).catch((err: Error) => {
        let rec: Receipt<any> = {
            ok: false,
            result: err,
        }
    });
});

RouterFunctions.getLinkCode = (elderEmail: string): Bluebird<Receipt<any>> => {
    return UserController.getUserByEmail(elderEmail).then((user: any) => {
        return UserController.requestLink(user.id).then((newCode) => {
            return {
                ok: true,
                result: {
                    code: newCode.code,
                    elderId: user.id
                }
            };
        });
    })
}

RouterFunctions.signUp = (userDetails: NewUser): Bluebird<Receipt<Token>> => {
    return UserController.createUser(userDetails).then((userEntry: NewUser) => {
        return AuthController.login({
            username: userEntry.username,
            password: userDetails.password,
        }).then((token) => {
            return {
                ok: true,
                result: token,
            }
        }).catch((error) => {
            return {
                ok: false,
                result: error,
            }
        });
    });
};

RouterFunctions.login = (loginParams: Credentials): Bluebird<Receipt<Token>> => {
    return AuthController.login({
        username: loginParams.username,
        password: loginParams.password,
    }).then((userToken: Token) => {
        return {
            ok: true,
            result: userToken,
        }
    });
};

RouterFunctions.linkElder = (carerEmail: string, linkParams: { code: string }): Bluebird<Receipt<any>> => {
    return UserController.acceptLink(carerEmail, linkParams.code).then((result) => {
        return {
            ok: true,
            result: result,
        };
    })
};

export default UserRouter;