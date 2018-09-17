import * as Bluebird from 'bluebird';
import * as Socket from 'socket.io';

export default class NotificationController {
  private static notificationQueue: { to: string, action: {key: string, params: any }, content: string }[] = [];

  public static addNotifications(recipient: string, message: string, action: { key: string, params: any }) {
    this.notificationQueue.push({
      to: recipient,
      content: message,
      action: action,
    });
  }

  public static pollNotifications(identity: string, socket: Socket.Socket) {
    return this.notificationQueue.filter(thing => thing.to === identity);
  }
}