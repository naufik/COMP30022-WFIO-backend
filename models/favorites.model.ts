import * as Sequelize from 'sequelize';
import Elder from "./elder.model";
import Database from "../config/database.config";
const Favorites = Database.define("favorites", {
  location: Sequelize.GEOMETRY,
});

Favorites.belongsTo(Elder);

export default Favorites;
