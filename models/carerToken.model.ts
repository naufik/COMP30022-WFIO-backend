import * as Sequelize from 'sequelize';
import Database from "../config/database.config";
import Carer from "./carer.model"

const CarerToken = Database.define("carertoken", {
    token: {
        type: Sequelize.STRING,
        unique: true,
    },
    lastUpdate: {
        type: Sequelize.DATE,
    }
});

CarerToken.belongsTo(Carer);
export default CarerToken;
