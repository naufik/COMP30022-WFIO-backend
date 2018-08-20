import * as Sequelize from 'sequelize';

import Carer from "./carer.model";
import Elder from "./elder.model";
import Database from "../config/database.config";
//not too sure about the expiry, could use DATETIME could use BOOLEAN
const ElderHasCarer = Database.define("elderhascarer", {
  establishedRelationship: sequelize.DATE,
});

ElderHasCarer.belongsTo(Elder);
ElderHasCarer.belongsTo(Carer);

export default ElderHasCarer;
