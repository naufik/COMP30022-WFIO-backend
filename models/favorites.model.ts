import * as Sequelize from 'sequelize';
import Database from "../config/database.config";
const Favorites = Database.define("favorites", {
  name: Sequelize.STRING,
  location: Sequelize.GEOMETRY,
});

export default Favorites;
