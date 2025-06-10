/**
 * emails.js
 * these are example routes for email management
 * This shows how to correctly structure your routes for the project
 * andt he suggested pattern for retrieving data by executing queries
 * 
 * NB. it's better NOT to use arrow functions for callbacks with SQLite
 */

const express = require("express");
const router = express.Router();

/**
 * @desc  Display all the emails
 */

router.get("/list-emails", (req, res, next) => {
    // Defines the query
    query = "SELECT * FROM email_accounts";

    // Execute the query and render the page with the results
    global.db.all(query,
        function (err, rows) {
            if (err) {
                next(err); // send the error on to the error handler
            } else {
                res.json(rows); // render page as simple JSON
            }
        }
    );
});

/**
 * @desc Displays a page with a form for creating an email record
 */
router.get("/add-email", (req, res) => {
    res.render("add-email.ejs");
});


/**
 * @desc Add a new email account to the databse based on 
 * data from the submitted form
 */
router.post("/add-email", (req, res, next) => {
    // Define the query
    query = "INSERT INTO email_accounts (email_address, user_id) VALUES (?, (SELECT user_id FROM users where user_name = ?));"
    query_parameters = [req.body.email_address, req.body.user_name] // NOTE make sure it's in right order

    // Execute the query and send a confirmation message
    global.db.run(query, query_parameters,
        function (err) {
            if (err) {
                next(err); // send the error on to the error handler
            } else {
                res.send(`New data inserted @ id ${this.lastID}!`);
                next();
            }
        }
    );
});


// Export the router object so index.js can access it
module.exports = router;