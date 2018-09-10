import * as Sequelize from 'sequelize';
import Database from "../config/database.config";

const Carer = Database.define("carer", {
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
  }
});

export default Carer;
