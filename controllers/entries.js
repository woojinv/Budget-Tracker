const Budget = require('../models/budget');

module.exports = {
    create,
    delete: deleteEntry
}

function create(req, res) {
    console.log(req.body, "<<< the new entry object");
    console.log(req.params.id, "<<< id of budget");
    // find the budget with the id
    Budget.findById(req.params.id, function(err, budget) {
        // put req.body into the entries array of that budget. 
        budget.entries.push(req.body);
        // spent should be the sum of the entries
        budget.spent = parseInt(budget.spent) + parseInt(req.body.amount);
        // remaining should subtract each each
        budget.remaining = parseInt(budget.remaining) - parseInt(req.body.amount);
        console.log(budget.remaining, "<<< this is remaining");
        // save the budget. 
        budget.save(function(err) {
            // redirect to the budget's show page.
            res.redirect(`/budgets/${budget._id}`);
        });
    });
}

function deleteEntry(req, res) {
    console.log(req.params.id, "<<< Id of entry");
    console.log(req.body, "<<< req.body");
    Budget.findOne({'entries._id': req.params.id}, function(err, budget) {
        if (!budget || err) return res.redirect(`/budgets/${budget._id}`);
        const entry = budget.entries.id(req.params.id);
        console.log(entry, "<<< this is the entry");
        budget.spent = parseInt(budget.spent) - parseInt(entry.amount);
        budget.remaining = parseInt(budget.remaining) + parseInt(entry.amount);
        budget.entries.remove(req.params.id);
        budget.save(function(err) {
            res.redirect(`/budgets/${budget._id}`);
        })
    })
}