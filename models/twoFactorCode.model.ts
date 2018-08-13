import * as Sequelize from 'sequelize';
import Database from "../config/database.config";
//not too sure about the expiry, could use DATETIME could use BOOLEAN
const twoFactorCode = Database.define("twofactorcode", {
  code: Sequelize.STRING,
  expiry: Sequelize.DATETIME,
});

export default twoFactorCode;
