const Budget = require("../models/budget");

module.exports = {
  create,
  delete: deleteEntry,
  edit,
  update,
};

// Create New Entry
function create(req, res) {
  if (!req.user) return res.redirect("/home");
  Budget.findById(req.params.id, function (err, budget) {
    budget.entries.push(req.body);
    budget.spent = parseInt(budget.spent) + parseInt(req.body.amount); // Update spent
    budget.remaining = parseInt(budget.remaining) - parseInt(req.body.amount); // Update remaining
    budget.save(function (err) {
      res.redirect(`/budgets/${budget._id}`);
    });
  });
}

// Delete Selected Entry 
function deleteEntry(req, res) {
  if (!req.user) return res.redirect("/home");
  Budget.findOne({ "entries._id": req.params.id }, function (err, budget) {
    if (!budget || err) return res.redirect(`/budgets/${budget._id}`);
    const entry = budget.entries.id(req.params.id);
    budget.spent = parseInt(budget.spent) - parseInt(entry.amount); // Update spent 
    budget.remaining = parseInt(budget.remaining) + parseInt(entry.amount); // Update Remaining
    budget.entries.remove(req.params.id);
    budget.save(function (err) {
      res.redirect(`/budgets/${budget._id}`);
    });
  });
}

// Display Page to Edit and Entry
function edit(req, res) {
  if (!req.user) return res.redirect("/home");
  Budget.findOne({ "entries._id": req.params.id }, function (err, budget) {
    const entry = budget.entries.id(req.params.id);
    res.render("entries/edit", {
      title: "Update Entry",
      budget,
      entry,
    });
  });
}

// Apply Updates to Selected Entry
function update(req, res) {
  if (!req.user) return res.redirect("/home");
  Budget.findOne({ "entries._id": req.params.id }, function (err, budget) {
    const entry = budget.entries.id(req.params.id);
    if (!budget.userId.equals(req.user._id))
      return res.redirect(`/budgets/${budget._id}`);

    budget.spent = budget.spent + (parseInt(req.body.amount) - entry.amount); // Update spent
    budget.remaining =
      budget.remaining + (entry.amount - parseInt(req.body.amount)); // Update remaining

    entry.amount = req.body.amount;
    entry.date = req.body.date;
    entry.description = req.body.description;
    budget.save(function (err) {
      res.redirect(`/budgets/${budget._id}`);
    });
  });
}
