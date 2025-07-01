// create a new router
const express = require("express");
const router = express.Router();

/**
 * @purpose     render the home page of the application
 * @input       none
 * @output      renders the index.ejs view as the response
 */
router.get("/", (req, res) => {
    res.render("index.ejs");
});

/**
 * @purpose  display the login page for user authentication
 * @input    none
 * @output   reders login.ejs view as the response
 */
router.get('/login', (req, res) => {
    res.render('login.ejs');
});

/**
 * @purpose  handle user login and establish a session
 * @input    user - the username 
 *           pass - the password 
 * @output   regenerates session, sets user, redirects to /organizer
 */
router.post('/login', (req, res, next) => {
    const password = 'pass';

    if (req.body.pass === password) {
        req.session.regenerate(function (err) {
            if (err) return next(err);

            req.session.user = req.body.user;

            req.session.save(function (err) {
                if (err) return next(err);
                res.redirect('/organizer');
            });
        });
    } else {
        res.send('Your username or password is incorrect');
    }
});

/**
 * @purpose  log user out by clearing session data 
 * @input    none
 * @output   clears `req.session.user`, regenerates session 
 *           redirects the user to the home page (`/`)
 */
router.get('/logout', (req, res, next) => {
    req.session.user = null;

    req.session.save(function (err) {
        if (err) return next(err);

        // prevents session fixation where attacker tries to use old session
        req.session.regenerate(function (err) {
            if (err) return next(err);
            res.redirect('/');
        });
    });
});

module.exports = router;