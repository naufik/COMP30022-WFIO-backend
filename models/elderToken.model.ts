import * as Sequelize from 'sequelize';
import Database from "../config/database.config";
import Elder from "./elder.model"

const ElderToken = Database.define("eldertoken", {
    password: Sequelize.STRING,
    //Timestamps
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
});

EldeToken.belongsTo(Elder);
export default ElderToken;
