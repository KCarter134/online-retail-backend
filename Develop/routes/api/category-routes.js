const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  Category.findAll({
      attributes: ["id", "category_name"],
      include: [
          {
              model: Product,
              attributes: ["id", "product_name", "price", "stock", "category_id"]
          },
      ],
  })
      .then(dbCatagoryData => res.json(dbCatagoryData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.get("/:id", (req, res) => {

    // finds one category by its `id` value and its associated products
    Category.findOne({
        where: {
            id: req.params.id,
        },
        attributes: ["id", "category_name"],
        include: [
            {
                model: Product,
                attributes: ["id", "product_name", "price", "stock", "category_id"],
            },
        ],
    })
        .then((dbCategoryData) => {
            if (!dbCategoryData) {
                res.status(404).json({ message: "Category not found" });
                return;
            }
            res.json(dbCategoryData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

//creates new category
router.post('/', (req, res) => {
    Category.create({
        category_name: req.body.category_name
    })
        .then(dbCategoryData => res.json(dbCategoryData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// implements an update to a category based on ID
router.put('/:id', (req, res) => {
    Category.update(req.body, {
        where: {
            id: req.params.id
        },
    })
        .then(dbCategoryData => {
            if (!dbCategoryData[0]) {
                res.status(404).json({ message: 'No category found with this id'});
                return;
            }
            res.json(dbCategoryData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// deletes a category by its ID value
router.delete("/:id", (req, res) => {
    Category.destroy({
        where: { id: req.params.id },
    })
        .then((dbCategoryData) => {
            if (!dbCategoryData) {
                res.status(404).json({ message: "No category found" });
                return;
            }
            res.json(dbCategoryData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
