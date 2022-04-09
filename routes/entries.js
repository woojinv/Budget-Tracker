const express = require('express');
const router = express.Router();
const entriesCtrl = require('../controllers/entries');

router.post('/budgets/:id/entries', entriesCtrl.create);

module.exports = router;