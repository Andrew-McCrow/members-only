const { createMessage, deleteMessage } = require("../db/queries");

// Render the new message form
function getNewMessage(req, res) {
  res.render("new-message", { errors: {}, formData: {} });
}

// Handle new message form submission
async function postNewMessage(req, res, next) {
  const { title, message } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).render("new-message", {
      errors: { title: { msg: "Title is required" } },
      formData: req.body,
    });
  }
  if (!message || !message.trim()) {
    return res.status(400).render("new-message", {
      errors: { message: { msg: "Message is required" } },
      formData: req.body,
    });
  }
  try {
    await createMessage(req.user.id, title.trim(), message.trim());
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

// Handle message deletion (admins only)
async function deleteMessageHandler(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).send("Forbidden");
  }
  try {
    await deleteMessage(req.params.id);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = { getNewMessage, postNewMessage, deleteMessageHandler };
