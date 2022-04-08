const Budget = require('../models/budget');

module.exports = {
    index,
    new: newBudget,
    create,
    show
}

function index(req, res) {
    Budget.find({}, function(err, budgets) {
        res.render('budgets/index', {
            title: 'All Budgets',
            budgets
        });
    });
}

function newBudget(req, res) {
    res.render('budgets/new', {
        title: 'New Budget'
    });
}

function create(req, res) {
    // create a new budget object
    const budget = new Budget(req.body);
    // Assign the logged in user's id to that budget
    budget.userId = req.user._id;
    budget.save(function(err) {
        if (err) return res.redirect('/budgets/new');
        res.redirect(`/budgets/${budget._id}`);
    })
}

function show(req, res) {
    console.log(req.params.id, "<<< This is req.params.id");
    Budget.findById(req.params.id, function(err, budget) {
        console.log(budget, "<<< This is the budget");
        res.render('budgets/show', {
            title: budget.name,
            budget,
            remaining: budget.budget
        });
    })
    
}