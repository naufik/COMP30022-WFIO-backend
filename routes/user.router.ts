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
    let actionRequest = req.body;
    let actionReceipt: Bluebird<Receipt<any>>;

    console.log(actionRequest);

    switch (actionRequest.action) {
        case "user.signup":
            actionReceipt = RouterFunctions.signUp(actionRequest.params);
            break;
        case "user.login":
            actionReceipt = RouterFunctions.login(actionRequest.params);
            break;
        default:
            break;

    actionReceipt.then((value) => {
        res.json(value);
    });
}
    
    return new Bluebird((resolve, reject) => {
        resolve({
           ok: true,
           result: {
               token: "This is the example returned token"
           }
        });
    });
});

RouterFunctions.signUp = (req, res) => {
    let action: Action<any> = req.body;

    // AuthController.login({
    //     username: <string> action.params.username,
    //     password: <string> action.params.password,
    //     accountType: <string> action.params.accountType,
    // }).then((auth) => {
    //     res.json(auth);
    // });


};

RouterFunctions.login = (req: Request, res: Response): Bluebird<Receipt<Token>> => {
    let action: Action<NewUser> = req.body;

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