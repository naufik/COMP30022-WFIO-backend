import { Router, Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import UserController from '../controllers/users.controller'
import MessageController from '../controllers/messaging.controller';
import NotificationController from '../controllers/notifications.controller';
import { Action, Receipt, Token } from '../interfaces/action.interface';
import * as Bluebird from 'bluebird';

const MsgRouter: Router = Router();
const RouterFunctions: any = {};

MsgRouter.get('/', (req: Request, res: Response) => {
  if (req.headers) {
    const identity = req.headers["xwfio-identity"];
    const token = req.headers["xwfio-secret"];
    MessageController.pollMessages(<string>identity).then((msgs) => {
      res.json({
        ok: true,
        result: msgs,
      });
    });
}
});

MsgRouter.post('/', (req: Request, res: Response) => {
  const params = req.body.params;
  const identity = req.body.identity;
  const action = req.body.action;

  let returnedPromise: Bluebird<any> = Bluebird.resolve(true);
  console.log(req.body);
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
    case "msg.sos":
      returnedPromise = NotificationController.notifyCarers(identity.email, params.destination, params.route).then((success) => {
        return {
          ok: success.success,
          result: {}
        };
      });
      break;
    case "msg.sosaccept":
      returnedPromise = UserController.getUserByEmail(identity.email).then((user) =>{
        return NotificationController.addNotification({
          to: params.elderEmail,
          redirect: "sos.accepthelp",
          timestamp: new Date(),
          content: {
            from: {
              email: identity.email,
              fullname: user.fullname,
            },
            route: params.route,
            destination: params.destination,
          },
          display: {
            title: "Carer Found!",
            subtitle: user.fullname +" has agreed to help you!"
          },
        });
      }).then((success) => {
        return {
          ok: true,
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

export default MsgRouter;