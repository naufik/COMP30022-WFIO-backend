import * as Sequelize from 'sequelize';
import Database from "../config/database.config";
import Elder from "./elder.model"

const ElderToken = Database.define("eldertoken", {
    token: {
        type: Sequelize.STRING,
        unique: true,
    },
    lastUpdate: {
        type: Sequelize.DATE,
    }
});

ElderToken.belongsTo(Elder);
export default ElderToken;
