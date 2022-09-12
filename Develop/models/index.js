// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// assigns products to category
Product.belongsTo(Category, {
  foreignKey: 'category_id'
});

// allows for the assignment of as many products as needed to a category
Category.hasMany(Product, {
  foreignKey: 'category_id'
});

//allows products to have as many tags as needed
Product.belongsToMany(Tag, {
  through: ProductTag,
  as: 'tagged_product',
  foreignKey: 'product_id'
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag,
  as: 'tagged_product',
  foreignKey: 'tag_id'
});

//Make sure you set up foreign key relationships that match the column we created in the respective models.

ProductTag.belongsTo(Product, {
  foreignKey: 'product_id',
});

ProductTag.belongsTo(Tag, {
  foreignKey: 'tag_id'
});

Tag.hasMany(ProductTag, {
  foreignKey: 'tag_id'
});

Product.hasMany(ProductTag, {
  foreignKey: 'product_id'
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
