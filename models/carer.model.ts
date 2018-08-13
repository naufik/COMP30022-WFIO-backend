import * as Sequelize from 'sequelize';
import Database from "../config/database.config";

const Carer = Database.define("carer", {
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  fullName: Sequelize.STRING,
});

export default Carer;