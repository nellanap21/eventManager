// create a new router
const express = require("express");
const router = express.Router();

// handle the attendee routes
router.get("/", (req, res) => {
    res.render("attendee.ejs");
});

router.get("/book-event", (req, res) => {
    res.render("book-event");
});

module.exports = router;