import Carer from '../models/carer.model';
import Elder from '../models/elder.model';
import Connection from '../models/elderHasCarer.model';
import Message from '../models/message.model';
import UserController from './users.controller';
import { User } from '../interfaces/user.interface';
import ElderHasCarer from '../models/elderHasCarer.model';

import { Op } from 'sequelize';
import * as Bluebird from 'bluebird';

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
        timestamp: new Date(),
        content: params.content,
        location: poly,
        polled: false, 
      });
    }).then((message: any) => {
      return message.toJSON();
    });
  }

  public static pollMessages(identity: string, params: any) {
    return UserController.getUserByEmail(identity).then((user: User) => {
      const type = user.accountType;
      
      if (type === "ELDER") {
        return Bluebird.all([ElderHasCarer.findAll({
          where: {
            elderId: user.id,
          }
        }), "ELDER"]);
      } else if (type === "CARER") {
        return Bluebird.all([ElderHasCarer.findAll({
          where: {
            carerId: user.id,
          }
        }), "CARER"]);
      } 
      return Bluebird.reject(new Error("User Not Found"));
    }).spread((connections: any[], kind: string) => {
      return Message.findAll({
        where: {
          [Op.or]: connections.map((thing) => {
            return {
              elderhascarerId: thing.toJSON().id,
            }
          }),
          location: (kind == "ELDER" ? {
            [Op.eq]: null,
          } : {
            [Op.not]: null
          }), 
          polled: false,
        }
      });

    }).then((messages: any[]) => {
      const sortedMessages = messages.sort((t1: any, t2: any) => {
        return 1;  
      });
      
      sortedMessages.forEach((msg) => {
        msg.polled = true,
        msg.save();
      });


      return {
        messages: sortedMessages.map(thing => thing.toJSON()).sort((m, n) => {
          let md: Date = new Date(m.timestamp);
          let nd: Date = new Date(n.timestamp);
          if (md > nd) {
            return -1;
          }
          if (nd < md) {
            return 1;
          }
          return 0;
        }),
      };
    });
  }
}