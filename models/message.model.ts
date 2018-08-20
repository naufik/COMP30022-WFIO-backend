import * as Sequelize from 'sequelize';
import ElderHasCarer from "./elderHasCarer.model";
import Database from "../config/database.config";

const Message = Database.define("message", {
    timestamp: Sequelize.DATE,
    content: Sequelize.STRING,
});

Message.belongsTo(ElderHasCarer)
export default Message;
