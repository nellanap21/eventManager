// create a new router
const express = require("express");
const router = express.Router();

// handle the main routes
router.get("/", (req, res) => {
    res.render("index.ejs");
});

module.exports = router;