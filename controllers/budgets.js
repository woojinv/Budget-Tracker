const Budget = require("../models/budget");

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
  unarchive,
  deleteArchived
};

// Display Current Budgets
async function index(req, res) {
  try {
    if (!req.user) return res.redirect("/home");
    const budgets = await Budget.find({})
                                .sort({ updatedAt: "desc" })
                                .exec();
    const avatar = await req.user.avatar;
    res.render("budgets/index", {
      title: "Current Budgets",
      budgets,
      avatar
    });

  } catch (err) {
    res.redirect("/home");
  }
}

// Render Form to Create New Budget
function newBudget(req, res) {
  if (!req.user) return res.redirect("/home");
  const avatar = req.user.avatar;
  res.render("budgets/new", {
    title: "New Budget", 
    avatar
  });
}

// Create New Budget
async function create(req, res) {
  try {
    if (!req.user) return res.redirect("/home");
    const budget = await new Budget(req.body);
    budget.userId = await req.user._id;
    budget.remaining = await budget.budget;
    await budget.save();
    res.redirect("/budgets");

  } catch (err) {
    res.redirect('/budgets/new');
  }
}

// Display Page for Selected Budget
async function show(req, res) {
  try {
    if (!req.user) return res.redirect("/home");
    const budget = await Budget.findById(req.params.id);
    const avatar = await req.user.avatar;
    await budget.entries.sort((a, b) => b.date - a.date);
    await budget.save();
    res.render("budgets/show", {
      title: budget.name,
      budget,
      remaining: budget.budget,
      avatar
    });

  } catch (err) {
    res.redirect("/budgets");
  }
}

// Delete Budget
async function deleteBudget(req, res) {
  try {
    if (!req.user) return res.redirect("/home");
    await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.redirect("/budgets");

  } catch (err) {
    res.redirect("/budgets");
  }
}

// Display Page to Update a Budget
async function edit(req, res) {
  try {
    if (!req.user) return res.redirect("/home");
    const budget = await Budget.findOne({_id: req.params.id, userId: req.user._id });
    const avatar = await req.user.avatar;
    if (!budget) return res.redirect(`/budgets/${req.params.id}`);
    res.render("budgets/edit", {
      title: "Update Budget",
      budget,
      avatar
    });

  } catch (err) {
    res.redirect(`/budgets/${req.params.id}`);
  }
}


// Apply Changes Made to a Budget
async function update(req, res) {
  try {
    if (!req.user) return res.redirect("/home");
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
      );

    budget.remaining = await budget.budget - budget.spent;
    budget.remaining = await budget.budget + budget.earned;
    await budget.save();
    res.redirect(`/budgets/${budget._id}`);

  } catch (err) {
    res.redirect(`/budgets/${budget._id}`);
  }
}

// Archive Selected Budget
async function archive(req, res) {
  try {
    if (!req.user) return res.redirect("/home");
    const budget = await Budget.findById(req.params.id);
    budget.archived = true;
    await budget.save();
    res.redirect("/budgets");

  } catch (err) {
    res.redirect("/budgets");
  }
}

// Display Archived Budgets
async function indexArchived(req, res) {
  try {
    if (!req.user) return res.redirect("/home");
    const budgets = await Budget.find({})
                                .sort({ updatedAt: "desc"})
                                .exec();
    
    const avatar = await req.user.avatar;
    res.render("budgets/archived", {
      title: "Archived Budgets",
      budgets,
      avatar
    });

  } catch (err) {
    res.redirect("/budgets");
  }
}


// Unarchive Selected Budget
async function unarchive(req, res) {
  try {
    if (!req.user) return res.redirect("/home");
    const budget = await Budget.findById(req.params.id);
    budget.archived = false;
    await budget.save();
    res.redirect("/budgets/archived");

  } catch (err) {
    res.redirect("/budgets/archived");
  }
}

// Delete Archived Budget
async function deleteArchived(req, res) {
  try {
    if (!req.user) return res.redirect("/home");
    await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.redirect("/budgets/archived");

  } catch (err) {
    res.redirect("/budgets/archived");
  }
}