import * as Sequelize from 'sequelize';
import ElderHasCarer from "./elderHasCarer.model";
import Database from "../config/database.config";

const Message = Database.define("message", {
    timestamp: {
        type: Sequelize.DATE,
    },
    content: {
        type: Sequelize.STRING(160),
    },
    polled: {
        type: Sequelize.BOOLEAN,
    }
}); 

Message.belongsTo(ElderHasCarer)
export default Message;
