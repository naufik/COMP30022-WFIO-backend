import * as Sequelize from 'sequelize';

import Carer from "./carer.model";
import Elder from "./elder.model";
import Database from "../config/database.config";
//not too sure about the expiry, could use DATETIME could use BOOLEAN
const twoFactorCode = Database.define("twofactorcode", {
  code: Sequelize.STRING,
  expiry: Sequelize.DATETIME,
});

twoFactorCode.belongsTo(Carer);
twoFactorCode.belongsTo(Elder);

export default twoFactorCode;
