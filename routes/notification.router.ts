import { Router, Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import UserController from '../controllers/users.controller';
import NotificationController from '../controllers/notifications.controller';
import * as Bluebird from 'bluebird';

const NotifRouter: Router = Router();
const RouterFunctions: any = {};

NotifRouter.get('/', (req, res) => {
  if (req.headers) {
    const identity = req.headers["xwfio-identity"]
    const token = req.headers["xwfio-secret"]
    NotificationController.pollNotifications(<string>identity).then((notifications) => {
      res.json({
        ok: true,
        result: notifications,
      });
    });
  }
});

export default NotifRouter;