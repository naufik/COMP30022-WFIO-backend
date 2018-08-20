import * as Sequelize from 'sequelize';
import Database from "../config/database.config";

const Elder = Database.define("elder", {
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    fullName: Sequelize.STRING,
    currentLocation: Sequelize.GEOMETRY,
});
  
export default Elder;
