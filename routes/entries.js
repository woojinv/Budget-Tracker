const express = require("express");
const router = express.Router();
const entriesCtrl = require("../controllers/entries");

router.post("/budgets/:id/entries", entriesCtrl.create);
router.delete("/entries/:id", entriesCtrl.delete);
router.get("/entries/:id/edit", entriesCtrl.edit);
router.put("/entries/:id", entriesCtrl.update);

module.exports = router;
