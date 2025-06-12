// create a new router
const express = require("express");
const router = express.Router();

// handle the organizer route
router.get("/", (req, res) => {
    res.render("organizer.ejs");
});

router.get("/site-settings", (req, res) => {
    res.render("site-settings.ejs");
});

router.get("/edit-event", (req, res) => {
    res.render("edit-event.ejs");
});

module.exports = router;