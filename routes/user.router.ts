import { Router, Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import UserController from '../controllers/users.controller'
import { Action, Receipt, Token } from '../interfaces/action.interface';
import { NewUser } from '../interfaces/user.interface';
import * as Bluebird from 'bluebird';

const UserRouter: Router = Router();
const RouterFunctions: any = {}

UserRouter.get('/', (req: Request, res: Response) => {
    res.json({
        endpoint: "users",
        online: true,
    });
});

UserRouter.post('/', (req: Request, res: Response) => {
    let actionRequest: Action<any> = req.body;
    let actionReceipt: Bluebird<Receipt<any>> = Bluebird.reject(new Error("Invalid Action"));

    switch (actionRequest.action) {
        case "user.signup":
            actionReceipt = RouterFunctions.signUp(actionRequest.params);
            break;
        case "user.login":
            actionReceipt = RouterFunctions.login(actionRequest.params);
            break;
        default:
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

RouterFunctions.signUp = (signUpParams: any): Bluebird<Receipt<Token>> => {
    let params: NewUser = signUpParams;

    // AuthController.login({
    //     username: <string> action.params.username,
    //     password: <string> action.params.password,
    //     accountType: <string> action.params.accountType,
    // }).then((auth) => {
    //     res.json(auth);
    // });

    return new Bluebird((resolve, reject) => {
        resolve({
           ok: true,
           result: {
               token: "This is the example returned token"
           }
        });
    });
};

RouterFunctions.login = (loginParams: any): Bluebird<Receipt<Token>> => {

    // UserController.createUser(action.params)
    //     .then((returned) => {
    //         res.json(returned);     
    //     }).then((user) => {
    //         return AuthController.login({
    //             username: action.params.username,
    //             password: action.params.password,
    //             accountType: action.params.accountType,
    //         });
    //     }).then((token) => {
    //         res.json(token);
    //     });

    return new Bluebird((resolve, reject) => {
        resolve({
           ok: true,
           result: {
               token: "This is the example returned token"
           }
        });
    });
};

export default UserRouter;