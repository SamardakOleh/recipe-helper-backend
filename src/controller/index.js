const express = require('express');
const router = express.Router();

const recipeRouter = require('./recipes');

router.use(recipeRouter);

module.exports = router;