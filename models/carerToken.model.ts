import * as Sequelize from 'sequelize';
import Database from "../config/database.config";
import Carer from "./carer.model"

const CarerToken = Database.define("carertoken", {
    password: Sequelize.STRING,
    //Timestamps
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE

});

CarerToken.belongsTo(Carer);
export default CarerToken;
