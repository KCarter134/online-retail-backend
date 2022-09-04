// imports important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// imports our database connection from config.js
const sequelize = require('../config/connection');

// Initializes Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    // defines the id column
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // define product name column
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // defines the price column
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true
      }
    },
    // defines stock attribute column
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        isNumeric: true
      }
    },
    // defines category ID column
    category_id: {
      type: DataTypes.INTEGER,
      // passes the category model ID
      references: {
        model: 'category',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
