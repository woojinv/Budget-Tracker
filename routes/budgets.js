const express = require('express');
const router = express.Router();
const budgetsCtrl = require('../controllers/budgets');

router.get('/', budgetsCtrl.index);
router.get('/new', budgetsCtrl.new);
router.get('/:id', budgetsCtrl.show);
router.get('/:id/edit', budgetsCtrl.edit);
router.post('/', budgetsCtrl.create);
router.delete('/:id', budgetsCtrl.delete);


module.exports = router;