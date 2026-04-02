import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false,
});

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'images/products/default.png',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Unnamed Product',
  },
  rating: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: { stars: 0, count: 0 },
  },
  priceCents: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  keywords: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
});

export default sequelize;
export { Product };