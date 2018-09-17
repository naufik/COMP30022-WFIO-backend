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
        return ElderHasCarer.findAll({
          where: {
            elderId: user.id,
          }
        });
      } else if (type === "CARER") {
        return ElderHasCarer.findAll({
          where: {
            carerId: user.id,
          }
        })
      } 
      return Bluebird.reject(new Error("User Not Found"));
    }).then((connections: any[]) => {

      return Message.findAll({
        where: {
          [Op.or]: connections.map((thing) => {
            return {
              elderhascarerId: thing.toJSON().id,
            }
          }), 
          polled: false,
        }
      });

    }).then((messages: any[]) => {
      return {
        messages: messages.sort((t1: any, t2: any) => {
          // compare by date later on.
          return 1;  
        })
      };
    });
  }
}