import * as Bluebird from 'bluebird';
import * as Socket from 'socket.io';
import { Notification, SOSRequest } from '../interfaces/notification.interface';
import UserController from './users.controller';
import { User } from '../interfaces/user.interface';

export default class NotificationController {
  private static notificationsQueue: Notification<any>[] = [];

  /**
   * Adds a notification to the notification stack.
   * @param notification the notification to be added.
   */
  public static addNotification(notification: Notification<any>): Bluebird<any> {
    this.notificationsQueue.push(notification);
    return Bluebird.resolve(notification);
  }

  /**
   * Adds multiple notifications into the notification stack.
   * @param notifications Array of notification objects.
   */
  public static addNotifications(notifications: Notification<any>[]): Bluebird<any> {
    this.notificationsQueue = notifications.concat(this.notificationsQueue);
    return Bluebird.resolve(notifications);
  }

  /**
   * Polls unread notifications and obtains all the reponses from the notification
   * stack. Returns a Promise.
   * @param email The email of the username whose notifications is redirected
   * to.
   */
  public static pollNotifications(email: string): Bluebird<any> {
    this.cleanNotifications();
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
            timestamp: new Date(),
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
        console.log(this.notificationsQueue);
      });
      console.log(this.notificationsQueue);
      return Bluebird.resolve({
        success: true,
      });
    });
  }

  private static cleanNotifications() {
    this.notificationsQueue = this.notificationsQueue.filter((thing) => {
      let d30mins = new Date(thing.timestamp.toDateString());
      d30mins.setMinutes(d30mins.getMinutes() + 30);
      return new Date() > d30mins;
    });
  }

}
