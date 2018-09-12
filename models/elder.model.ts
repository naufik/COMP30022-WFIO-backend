import * as Sequelize from 'sequelize';
import Database from "../config/database.config";

const Elder = Database.define("elder", {
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  fullname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  location: {
    type: Sequelize.GEOMETRY,
  }
});

export default Elder;
