const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');

// INDEX - list all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.render('users/index.ejs', { users });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// SHOW - show user profile + their recipes
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const recipes = await Recipe.find({ owner: req.params.userId });
    res.render('users/show.ejs', { user, recipes });
  } catch (error) {
    console.error(error);
    res.redirect('/users');
  }
});

module.exports = router;
