import { Router, Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import UserController from '../controllers/users.controller'
import MessageController from '../controllers/messaging.controller';
import { Action, Receipt, Token } from '../interfaces/action.interface';
import * as Bluebird from 'bluebird';

const MsgRouter: Router = Router();
const RouterFunctions: any = {};

MsgRouter.post('/', (req: Request, res: Response) => {
  const params = req.body.params;
  const identity = req.body.identity;
  const action = req.body.action;

  let returnedPromise: Bluebird<any> = Bluebird.resolve(true);

  switch(action) {
    case "msg.send":
    // works as an echo for now
      returnedPromise = MessageController.sendMessage(identity.email, params).then((messageEntry) => {
        return {
          ok: true,
          result: messageEntry,
        }
      });
      break;
    default:
      res.send("action not found");
      break;
  }
  
  returnedPromise.then((result) => {
    res.json(result);
  })

});