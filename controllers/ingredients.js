const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredient.js');

// Middleware: Require login
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Apply login middleware to all routes
router.use(requireLogin);

router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find({});
    res.render('ingredients/index', { ingredients });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) {
      // req.flash('error', 'Ingredient name cannot be empty.');
      return res.redirect('/ingredients');
    }

    // Avoid duplicates (case-insensitive)
    const existing = await Ingredient.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (!existing) {
      await Ingredient.create({ name });
    }

    res.redirect('/ingredients');
  } catch (error) {
    console.error(error);
    res.redirect('/ingredients');
  }
});

module.exports = router;

