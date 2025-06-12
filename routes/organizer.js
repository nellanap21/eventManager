// create a new router
const express = require("express");
const router = express.Router();

// handle the organizer route
router.get("/", (req, res) => {
    const data = {
        siteName: req.app.locals.siteName,
        siteDescription: req.app.locals.siteDescription
    }
    res.render("organizer.ejs", data);
});

router.get("/site-settings", (req, res) => {
    const data = {
        siteName: req.app.locals.siteName,
        siteDescription: req.app.locals.siteDescription
    }
    res.render("site-settings.ejs", data);
});

router.post("/site-settings", (req, res) => {
    req.app.locals.siteName = req.body.siteName;
    req.app.locals.siteDescription = req.body.siteDescription;
    res.redirect('/organizer');
});

router.get("/edit-event", (req, res) => {
    res.render("edit-event.ejs");
});

module.exports = router;