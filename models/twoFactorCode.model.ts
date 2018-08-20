import * as Sequelize from 'sequelize';

import Elder from "./elder.model";
import Database from "../config/database.config";
//not too sure about the expiry, could use DATETIME could use BOOLEAN
const TwoFactorCode = Database.define("twofactorcode", {
  code: Sequelize.STRING,
  expiry: Sequelize.DATE,
});

TwoFactorCode.belongsTo(Elder);

export default TwoFactorCode;
