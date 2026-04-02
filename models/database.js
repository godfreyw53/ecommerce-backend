import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false,
});

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
});

export default sequelize;
export { Product };