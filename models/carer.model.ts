import * as Sequelize from 'sequelize';
import Database from "../config/database.config";
//keep table name in lower case (carer)
const Carer = Database.define("carer", {
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  /*added username and fullname as there can be two or more individuals with the
  same full name, later in frontend users must enter username without spaces*/
  username: {type: Sequelize.STRING, allowNull: false, unique: true},
  fullname: Sequelize.STRING
});

export default Carer;
