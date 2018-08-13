import * as Sequelize from 'sequelize';
import Database from "../config/database.config";
//use GEOMETRY datatype for now...
const GeometryStatus = Database.define("geometrystatus", {
  arrowDirection: Sequelize.STRING,
  startingLocation: Sequelize.GEOMETRY,
  destinationLocation: Sequelize.GEOMETRY,
  expired: Sequelize.DATETIME,
});

export default GeometryStatus;
