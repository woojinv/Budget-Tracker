const express = require("express");
const router = express.Router();
const budgetsCtrl = require("../controllers/budgets");

router.get("/", budgetsCtrl.index);
router.get("/new", budgetsCtrl.new);
router.get("/archived", budgetsCtrl.indexArchived);
router.delete("/archived/:id", budgetsCtrl.deleteArchived)
router.get("/:id", budgetsCtrl.show);
router.get("/:id/edit", budgetsCtrl.edit);
router.post("/", budgetsCtrl.create);
router.delete("/:id", budgetsCtrl.delete);
router.put("/:id", budgetsCtrl.update);
router.put("/:id/archived", budgetsCtrl.archive);
router.put("/:id/unarchive", budgetsCtrl.unarchive);

module.exports = router;
