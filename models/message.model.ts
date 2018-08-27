import * as Sequelize from 'sequelize';
import Database from "../config/database.config";

const Message = Database.define("message", {
    timestamp: Sequelize.DATE,
    content: Sequelize.STRING,
});

export default Message;