import Carer from '../models/carer.model';
import Elder from '../models/elder.model';
import Connection from '../models/elderHasCarer.model';
import Message from '../models/message.model';
import UserController from './users.controller';

export default class MessagingController {
  public static sendMessage(identity: string, params: any) {
    return UserController.getUserByEmail(identity).then((user) => {
      return Connection.findOne({
        where: {
          carerId: user.id,
          elderId: params.recipient,
        }
      });
    }).then((connection: any) => {
      let poly: any = null;
      if (params.location) {
        poly = { type: 'Point', 
          coordinates: [
            params.location.lat,
            params.location.long
          ]
        };
      }
      return Message.create({
        elderhascarerId: connection.id,
        content: params.content,
        location: poly,
        polled: false, 
      });
    }).then((message: any) => {
      return message.toJSON();
    });
  }
}