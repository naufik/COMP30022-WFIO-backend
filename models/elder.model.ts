import * as Sequelize from 'sequelize';
import Database from "../config/database.config";

const Elder = Database.define("elder", {
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    currentLocation: Sequelize.GEOMETRY,
    username: {type: Sequelize.STRING, allowNull: false, unique: true},
    fullName: Sequelize.STRING
});

export default Elder;
