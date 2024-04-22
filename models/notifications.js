import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

class Notifications extends Model {}

Notifications.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize },
);

export default Notifications;
