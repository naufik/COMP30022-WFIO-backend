import { Router, Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import UserController from '../controllers/users.controller'
import { Action } from '../interfaces/action.interface';
import { NewUser } from '../interfaces/user.interface';

const UserRouter: Router = Router();

UserRouter.get('/', (req: Request, res: Response) => {
    res.send("Endpoint for Users works!");
});

UserRouter.post('/login', (req: Request, res: Response) => {
    let action: Action<any> = req.body;

    AuthController.login({
        username: <string> action.params.username,
        password: <string> action.params.password,
        accountType: <string> action.params.accountType,
    }).then((auth) => {
        res.json(auth);
    });
});

UserRouter.post('/sign.up', (req: Request, res: Response) => {
    let action: Action<NewUser> = req.body;

    UserController.createUser(action.params)
        .then((returned) => {
            res.json(returned);     
    });
});