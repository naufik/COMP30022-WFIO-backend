import * as Sequelize from 'sequelize';
import Database from "../config/database.config";
import Carer from "./carer.model";
import Elder from "./elder.model";
//not too sure about the expiry, could use DATETIME could use BOOLEAN
const ElderHasCarer = Database.define("elderhascarer", {
  establishedRelationship: Sequelize.DATE
});

ElderHasCarer.belongsTo(Elder);
ElderHasCarer.belongsTo(Carer);

export default ElderHasCarer;
