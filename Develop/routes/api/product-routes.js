const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// gets all products
router.get('/', (req, res) => {
  // find all products
  // includes associated category and tag
  Product.findAll({
    include: [
      {
        model: Category,
        attributes: ['id', 'category_name']
      },
      {
        model: Tag,
        attributes: ['id', 'tag_name']
      },
    ],
  })
      .then(dbProductData => res.json(dbProductData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});


// gets  product
router.get('/:id', (req, res) => {
  // finds a single product by its ID
  // includes associated Category and Tag data
  Product.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Category,
        attributes: ['id', 'category_name']
      },
      {
        model: Tag,
        attributes: ['id', 'tag_name']
      },
    ],
  })
      // if product does not exist, a 404 error will be thrown
      .then(dbProductData => {
        if (!dbProductData) {
          res.status(404).json({ message: 'No product found with this id'});
          return;
        }
        res.json(dbProductData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});


// creates new product
router.post('/', (req, res) => {
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIds: req.body.tag_id
  })
      .then((product) => {
        // if there's product tags, we need to create pairings to bulk create in the ProductTag model
        if (req.body.tagIds.length) {
          const productTagIdArr = req.body.tagIds.map((tag_id) => {
            return {
              product_id: product.id,
              tag_id,
            };
          });
          return ProductTag.bulkCreate(productTagIdArr);
        }
        // if no product tags, just respond
        res.status(200).json(product);
      })
      .then((productTagIds) => res.status(200).json(productTagIds))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
});

// updates product
router.put('/:id', (req, res) => {
  // updates product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
      .then((product) => {
        // finds all associated tags from ProductTag
        return ProductTag.findAll({ where: { product_id: req.params.id } });
      })
      .then((productTags) => {
        // gets list of current tag_ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        // creates filtered list of new tag_ids
        const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });
        // figures out which ones to remove
        const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);

        // runs both actions
        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      })
      .then((updatedProductTags) => res.json(updatedProductTags))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
});

router.delete('/:id', (req, res) => {
  // deletes a product based on ID value
  Product.destroy({
    where: {
      id: req.params.id
    }
  })
      .then(dbProductData => {
        if (!dbProductData) {
          res.status(404).json({ message: 'No product found with this id'});
          return;
        }
        res.json(dbProductData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});


module.exports = router;
