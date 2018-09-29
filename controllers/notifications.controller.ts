import * as Bluebird from 'bluebird';
import * as Socket from 'socket.io';
import { Notification } from '../interfaces/notification.interface';

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


}