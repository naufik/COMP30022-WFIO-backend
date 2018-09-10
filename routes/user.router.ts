import { Router, Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import UserController from '../controllers/users.controller'
import { Action } from '../interfaces/action.interface';
import { NewUser } from '../interfaces/user.interface';

const UserRouter: Router = Router();
const RouterFunctions: any = {}

UserRouter.get('/', (req: Request, res: Response) => {
    res.json({
        endpoint: "users",
        online: true,
    });
});

UserRouter.post('/', (req: Request, res: Response) => {
    let request = <Action<any>>req.body;

    switch (request.action) {
        case "sign.up":
            RouterFunctions.signUp(req, res);
            break;
        case "login":
            RouterFunctions.login(req,res);
            break;
        default:
            res.json({error: "konak"});
    }
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

    res.json({
        success: false,
        user: action.params,
    });
};

RouterFunctions.login = (req: Request, res: Response) => {
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

    res.json({
        success: false,
        user: action.params,
    });
};

export default UserRouter;