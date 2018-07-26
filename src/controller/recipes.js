const express = require('express');
const router = express.Router();
const authService = require('../service/auth.service');
const Recipe = require('../model/recipe');
var fs = require('fs');

requireAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send('No token provided');
    }
    let owner = authService.decodeUser(req.headers.authorization).sub;
    if (owner) {
        req.owner = owner;
        next();
    }
    else
        return res.status(403).send('Invalid token')

};

router.get('/recipes', (req, res) => {
    Recipe.find({}).then(recipes => {
        recipes.map(recipe => {
            if (recipe.image.data) {
                let newImgData = recipe.image.data.toString('base64');
                recipe._doc.decodedImage = newImgData;
            }
            return recipe;

        });
        res.json(recipes);
    });
});

router.get('/recipes/my', requireAuth, (req, res) => {
    Recipe.find({owner: req.owner}).then(recipes => {
        recipes.map(recipe => {
            if (recipe.image.data) {
                let newImgData = recipe.image.data.toString('base64');
                recipe._doc.decodedImage = newImgData;
            }
            return recipe;

        });
        res.json(recipes);
    }).catch(err => {
        res.status(500).send(err);
    })
});

router.post('/recipes', requireAuth, (req, res) => {
    let recipe = req.body;
    recipe.owner = req.owner;
    recipe = new Recipe(recipe);
    recipe.save(recipe).then(() => {
        res.status(201);
        res.json('Created');
    }).catch(err => {
        res.status(500);
        res.send(err);
    });
});


router.get('/recipes/:id', (req, res) => {
    Recipe.findById(req.params.id).then(recipe => res.json(recipe));
});

router.delete('/recipes/:id', requireAuth, (req, res) => {
    Recipe.findById(req.params.id).then(recipe => {
        if (req.owner !== recipe.owner)
            return res.status(403).send('Forbidden');
        Recipe.findByIdAndDelete(recipe.id).then(() => {
            res.status(204);
            res.json('ok');
        }).catch(err => {
            res.status(500);
            res.json(err);
        })
    });

});

router.patch('/recipes/:id', requireAuth, (req, res) => {
    Recipe.findById(req.params.id).then(recipe => {
        if (req.owner !== recipe.owner) {
            return res.status(403).send('Forbidden');
        }
        let newRecipe = req.body;
        Recipe.findByIdAndUpdate(recipe.id, newRecipe).then(() => {
            res.status(204);
            res.json('ok');
        }).catch(err => {
            res.status(500);
            res.json(err);
        })

    });

});

router.patch(`/recipes/:id/images`, requireAuth, (req, res) => {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    console.dir(JSON.stringify(req.body));
    Recipe.findById(req.params.id).then(recipe => {
        if (req.owner !== recipe.owner) {
            return res.status(403).send('Forbidden');
        }
        recipe.image.data = req.files.image.data;
        recipe.image.contentType = req.files.image.mimetype;
        recipe.save(recipe).then(result => {
            return res.send(result);
        });
    })
});

module.exports = router;
