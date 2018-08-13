import * as Sequelize from 'sequelize';
import Database from "../config/database.config";
const Favorites = Database.define("favorites", {
  location: Sequelize.STRING,
});

export default Favorites;
