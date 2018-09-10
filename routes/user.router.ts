import { Router, Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import UserController from '../controllers/users.controller'
import { Action } from '../interfaces/action.interface';
import { NewUser } from '../interfaces/user.interface';

const UserRouter: Router = Router();
const RouterFunctions: any = {}

UserRouter.get('/', (req: Request, res: Response) => {
    res.send("Endpoint for Users works!");
});

UserRouter.post('/', (req: Request, res: Response) => {
    let request = <Action<any>>req.body;

    switch (request.action) {

    }
});

RouterFunctions.SignUp = (req, res) => {
    let action: Action<any> = req.body;

    AuthController.login({
        username: <string> action.params.username,
        password: <string> action.params.password,
        accountType: <string> action.params.accountType,
    }).then((auth) => {
        res.json(auth);
    });
};

RouterFunctions.SignUp = (req: Request, res: Response) => {
    let action: Action<NewUser> = req.body;

    UserController.createUser(action.params)
        .then((returned) => {
            res.json(returned);     
        }).then((user) => {
            return AuthController.login({
                username: action.params.username,
                password: action.params.password,
                accountType: action.params.accountType,
            });
        }).then((token) => {
            res.json(token);
        });
};

export default UserRouter;