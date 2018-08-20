import * as Sequelize from 'sequelize';
import Database from "../config/database.config";
import Elder from "./elder.model";
//use GEOMETRY datatype for now...
const GeometryStatus = Database.define("geometrystatus", {
  arrowDirection: Sequelize.STRING,
  startingLocation: Sequelize.GEOMETRY,
  destinationLocation: Sequelize.GEOMETRY,
  expired: Sequelize.DATETIME,
});

GeometryStatus.belongsTo(Elder);
export default GeometryStatus;
