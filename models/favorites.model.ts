import * as Sequelize from 'sequelize';
import Elder from "./elder.model";
import Database from "../config/database.config";
const Favorites = Database.define("favorites", {
  name: {
    type: Sequelize.STRING
  },
  location: {
    type: Sequelize.GEOMETRY,
  },
});

Favorites.belongsTo(Elder);

export default Favorites;
