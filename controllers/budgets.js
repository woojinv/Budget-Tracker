const Budget = require('../models/budget');

module.exports = {
    index,
    new: newBudget,
    create,
    show,
    delete: deleteBudget,
    edit,
    update,
    archive,
    indexArchived,
    unarchive
}


function index(req, res) {
    // find all budgets and sort them with most recently updated at the top
    Budget.find({}).sort({ updatedAt: 'desc'}).exec(function(err, budgets) {
        if (err) return res.redirect('/home');
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
    console.log(req.user, "<<< This is the logged in user");
    // if no user is logged in, redirect to the home page
    if (!req.user) return res.redirect('/home');
    // Assign the logged in user's id to that budget
    budget.userId = req.user._id;
    budget.remaining = budget.budget;
    budget.save(function(err) {
        if (err) return res.redirect('/budgets/new');
        res.redirect(`/budgets`);
    })
}

function show(req, res) {
    Budget.findById(req.params.id, function(err, budget) {
        budget.entries.sort((a, b) => {
            return b.date - a.date;
        })
        budget.save();
        res.render('budgets/show', {
            title: budget.name,
            budget,
            remaining: budget.budget
        });
    })
}

function deleteBudget(req, res) {
    if (!req.user) return res.redirect('/home');
    Budget.findOneAndDelete(
        // ensure that the budget was created by the logged in user
        {_id: req.params.id, userId: req.user._id}, function(err) {
            // redirect to index view
            res.redirect('/budgets');
        }
    )
}

function edit(req, res) {
    if (!req.user) return res.redirect('/home');
    Budget.findOne({_id: req.params.id, userId: req.user._id}, function(err, budget) {
        if (err || !budget) return res.redirect(`/budgets/${req.params.id}`);
        res.render('budgets/edit', {
            title: "Edit Budget",
            budget
        })
    })
}

function update(req, res) {
    if (!req.user) return res.redirect('/home');
    Budget.findOneAndUpdate(
        {_id: req.params.id, userId: req.user._id}, 
        // update object with updated properties
        req.body,
        // options object with new: true to make sure updated doci s retuend
        {new: true},
        function(err, budget) {
            budget.remaining = budget.budget - budget.spent;
            budget.save();
            if (err || !budget) return res.redirect(`/budgets/${budget._id}`);
            res.redirect(`/budgets/${budget._id}`)
            }
        )
}

function archive(req, res) {
    if (!req.user) return res.redirect('/home');
    Budget.findById(req.params.id, function(err, budget) {
        budget.archived = true;
        budget.save();
        res.redirect('/budgets');
    })
}

function indexArchived(req, res) {
    Budget.find({}).sort({ updatedAt: 'desc'}).exec(function(err, budgets) {
        if (err) return res.redirect('/home');
        res.render('budgets/archived', {
            title: 'Archived Budgets',
            budgets
        });
    });
}

function unarchive(req, res) {
    if (!req.user) return res.redirect('/home');
    Budget.findById(req.params.id, function(err, budget) {
        budget.archived = false;
        budget.save();
        res.redirect('/budgets/archived');
    })
}