// create a new router
const express = require("express");
const router = express.Router();

/**
 * @purpose     Render the home page of the application
 * @input       HTTP GET request with no parameters
 * @output      Renders the 'index.ejs' view as the response
 */
router.get("/", (req, res) => {
    res.render("index.ejs");
});

module.exports = router;