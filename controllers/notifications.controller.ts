import * as Bluebird from 'bluebird';
import * as Socket from 'socket.io';
import { Notification } from '../interfaces/notification.interface';
import UserController from './users.controller';
import { User } from '../interfaces/user.interface';

export default class NotificationController {
  private static notificationsQueue: Notification<any>[] = [];

  public static addNotification(notification: Notification<any>): Bluebird<any> {
    this.notificationsQueue.push(notification);
    return Bluebird.resolve(notification);
  }

  public static addNotifications(notifications: Notification<any>[]): Bluebird<any> {
    this.notificationsQueue = notifications.concat(this.notificationsQueue);
    return Bluebird.resolve(notifications);
  }

  public static pollNotifications(email: string): Bluebird<any> {
    return new Bluebird((resolve, reject) => {
      resolve({
        notifications: this.notificationsQueue.filter(thing => thing.to === email)
      });
    }).then((notifs) => {
      this.notificationsQueue = this.notificationsQueue.filter(thing => thing.to != email);
      return {
        notifications: notifs
      };
    });
  }

  public static notifyCarers(email: string): Bluebird<any> {
    return UserController.getUserByEmail(email).then((user: any) => {
      if (user.accountType === "CARER") {
        throw new Error("Cannot notify carers as a carer.");
      }

      user.carersList.forEach((carer) => {
        this.addNotification({
          to: carer.username,
          redirect: "sos.respond",
          content: {
            from: {
              fullname: user.fullname,
              username: user.username,              
            }
          },
        });
      });

      return Bluebird.resolve({
        success: true,
      });
    });
  }

}