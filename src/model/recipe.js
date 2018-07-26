const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ENV_CONST = require('../../enviroment.const');

const db = mongoose.createConnection(ENV_CONST.DB_URL);

const recipeSchema = new Schema({
    name: String,
    owner: String,
    duration: Number,
    description: String,
    products: [{
        name: String
    }],
    image: {
        data: Buffer,
        contentType: String
    }
});

const Recipe = db.model('Recipe', recipeSchema, 'recipes');

module.exports = Recipe;