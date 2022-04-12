const Budget = require("../models/budget");

module.exports = {
  create,
  delete: deleteEntry,
  edit,
  update,
};

// Create New Entry
async function create(req, res) {
    try {
        if (!req.user) return res.redirect("/home");
        const budget = await Budget.findById(req.params.id);
        await budget.entries.push(req.body);
        budget.spent = parseInt(budget.spent) + parseInt(req.body.amount); // Update spent
        budget.remaining = parseInt(budget.remaining) - parseInt(req.body.amount); // Update remaining
        await budget.save();
        res.redirect(`/budgets/${budget._id}`)

    } catch (err) {
        res.redirect(`/budgets/${req.params.id}`);
    }
}

// Delete Selected Entry 
async function deleteEntry(req, res) {
    try {
        if (!req.user) return res.redirect("/home");
        const budget = await Budget.findOne({ "entries._id": req.params.id });
        if (!budget) return res.redirect(`/budgets/${budget._id}`);
        const entry = await budget.entries.id(req.params.id);
        budget.spent = parseInt(budget.spent) - parseInt(entry.amount); // Update spent 
        budget.remaining = parseInt(budget.remaining) + parseInt(entry.amount); // Update Remaining
        await budget.entries.remove(req.params.id);
        await budget.save();
        res.redirect(`/budgets/${budget._id}`);

    } catch (err) {
        res.redirect(`/budgets/${req.params.id}`);
    }
}

// Display Page to Edit and Entry
async function edit(req, res) {
    try {
        if (!req.user) return res.redirect("/home");
        const budget = await Budget.findOne({ "entries._id": req.params.id });
        const entry = await budget.entries.id(req.params.id);
        res.render("entries/edit", {
            title: "Update Entry",
            budget, 
            entry
        });

    } catch (err) {
        res.redirect(`/budgets/${req.params.id}`);
    }
}

// Apply Updates to Selected Entry
async function update(req, res) {
    try {
        if (!req.user) return res.redirect("/home");
        const budget = await Budget.findOne({ "entries._id": req.params.id });
        const entry = await budget.entries.id(req.params.id);
        if (!budget.userId.equals(req.user._id)) return res.redirect(`/budgets/${budget._id}`);
        budget.spent = await budget.spent + (parseInt(req.body.amount) - entry.amount); // Update spent
        budget.remaining = await budget.remaining + (entry.amount - parseInt(req.body.amount)); // Update remaining
        entry.amount = await req.body.amount;
        entry.date = await req.body.date;
        entry.description = await req.body.description;
        await budget.save();
        res.redirect(`/budgets/${budget._id}`);

    } catch (err) {
        res.redirect(`/budgets/${req.params.id}`);
    }
}

