import * as Bluebird from 'bluebird';
import * as Socket from 'socket.io';
import { Notification, SOSRequest } from '../interfaces/notification.interface';
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
      return notifs;
    });
  }

  public static notifyCarers(email: string, dest: Location, route: Location[]): Bluebird<any> {
    return UserController.getUserByEmail(email).then((user: any) => {
      if (user.accountType === "CARER") {
        throw new Error("Cannot notify carers as a carer.");
      }

      user.carersList.forEach((carer) => {
        let notif: Notification<SOSRequest> = {
            to: carer.email,
            redirect: "sos.respond",
            content: {
              from: {
                fullname: user.fullname,
                email: user.email,              
              },
              destination: dest,
              route: route,
            },
            display: {
              title: "Elder needs help!",
              subtitle: user.fullname + " needs help navigating!",
            },
          }
        this.addNotification(notif);
      });

      return Bluebird.resolve({
        success: true,
      });
    });
  }

}