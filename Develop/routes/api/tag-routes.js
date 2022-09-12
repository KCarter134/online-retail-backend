const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET route
router.get('/', (req, res) => {
    // find all tags
    Tag.findAll({
        include: [
            {
                model: Product,
                attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
            },
        ],
    })
        .then(dbTagData => res.json(dbTagData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//GET route
router.get('/:id', (req, res) => {
    // find a single tag by its `id`
    Tag.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Product,
                attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
                through: ProductTag,
                as: "products",
            },
        ],
    })
        .then(dbTagData => {
            if (!dbTagData) {
                res.status(404).json({ message: 'No tag was found with this id'});
                return;
            }
            res.json(dbTagData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//POST route
router.post('/', (req, res) => {
    // creates a new tag
    Tag.create({
        tag_name: req.body.tag_name
    })
        .then(dbTagData => res.json(dbTagData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//PUT route
router.put('/:id', (req, res) => {
    // updates a tag via its ID
    Tag.update(req.body, {
        where: {
            id: req.params.id
        },
    })
        .then(dbTagData => {
            if (!dbTagData[0]) {
                res.status(404).json({ message: 'No tag found with this id'});
                return;
            }
            res.json(dbTagData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//DELETE route
router.delete('/:id', (req, res) => {
    // deletes a tag based on ID
    Tag.destroy({
        where: {
            id: req.params.id
        },
    })
        .then(dbTagData => {
            if (!dbTagData) {
                res.status(404).json({ message: 'No tag found with this id'});
                return;
            }
            res.json(dbTagData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
