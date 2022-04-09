const Budget = require('../models/budget');

module.exports = {
    create
}

function create(req, res) {
    console.log(req.body, "<<< the new entry object");
    console.log(req.params.id, "<<< id of budget");
    // find the budget with the id
    Budget.findById(req.params.id, function(err, budget) {
        // put req.body into the entries array of that budget. 
        budget.entries.push(req.body);        
        // save the budget. 
        budget.save(function(err) {
            // redirect to the budget's show page.
            res.redirect(`/budgets/${budget._id}`);
        });
    });
}