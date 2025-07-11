const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

// INDEX - show all recipes for logged-in user
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({ owner: req.session.user._id }).populate('ingredients');
    res.render('recipe/index.ejs', { recipes });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// NEW - form for new recipe
router.get('/new', async (req, res) => {
  try {
    const ingredients = await Ingredient.find({});
    res.render('recipe/new.ejs', { ingredients });
  } catch (error) {
    console.error(error);
    res.redirect('/recipes');
  }
});

// CREATE - create new recipe
router.post('/', async (req, res) => {
  try {
    let ingredients = req.body.ingredients || [];
    if (!Array.isArray(ingredients)) {
      ingredients = [ingredients];
    }

    const newRecipe = new Recipe({
      ...req.body,
      ingredients,
      owner: req.session.user._id
    });

    await newRecipe.save();
    res.redirect('/recipes');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// SHOW - show recipe details
router.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients');
    res.render('recipe/show.ejs', { recipe });
  } catch (error) {
    console.error(error);
    res.redirect('/recipes');
  }
});

// EDIT - form to edit recipe
router.get('/:recipeId/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    const ingredients = await Ingredient.find({});
    res.render('recipe/edit.ejs', { recipe, ingredients });
  } catch (error) {
    console.error(error);
    res.redirect('/recipes');
  }
});

// UPDATE - update recipe
router.put('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe.owner.equals(req.session.user._id)) {
      return res.redirect('/recipes');
    }

    let ingredients = req.body.ingredients || [];
    if (!Array.isArray(ingredients)) {
      ingredients = [ingredients];
    }

    recipe.name = req.body.name;
    recipe.instructions = req.body.instructions;
    recipe.ingredients = ingredients;

    await recipe.save();
    res.redirect(`/recipes/${recipe._id}`);
  } catch (error) {
    console.error(error);
    res.redirect('/recipes');
  }
});

// DELETE - delete recipe
router.delete('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe.owner.equals(req.session.user._id)) {
      return res.redirect('/recipes');
    }
    await Recipe.deleteOne({ _id: req.params.recipeId });
    res.redirect('/recipes');
  } catch (error) {
    console.error(error);
    res.redirect('/recipes');
  }
});

module.exports = router;


