/**
* index.js
* This is your main app entry point
*/

// Set up express, bodyparser and EJS
const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(__dirname + '/public')); // set location of static files

// Set up express session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

// middleware to test if authenticated
function isAuthenticated (req, res, next) {
    console.log("isAuthenticated: " + req.session.user)

    if (req.session.user !== undefined) {
        next()
    } else {
        res.send("you are logged out");
    }
}

// Set up local variables for the application
// Per requirements, application is designed for one individual or organisation
app.locals.siteName = 'Fractals of Sound';
app.locals.siteDescription = `A collective of musicians creating sound 
bath experiences rooted in world music.`;

// Set up SQLite
// Items in the global namespace are accessible throught out the node application
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db',function(err){
    if(err){
        console.error(err);
        process.exit(1); // bail out we can't connect to the DB
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON"); // tell SQLite to pay attention to foreign key constraints
    }
});

app.get('/login', function (req, res) {
    res.render("login.ejs");
});

app.post('/login', function (req, res) {
    // naively stored password according to instructions
    const password = "pass";

    // login logic to validate req.body.password
    if (req.body.pass == password) {
        // regenerate the session, which is good practice to guard against
        // forms of session fixation
        req.session.regenerate(function(err) {
            if (err) next(err)
            // store user information in session
            req.session.user = req.body.user;
            console.log(req.body.user);
            // save the session before redirection to ensure page
            // load does not happen before session is saved
            req.session.save(function (err) {
                if (err) return next(err)
                res.redirect('/organizer');
            })
        })
    } else {
        res.send("Your username or password is incorrect");
    }

})

app.get('/logout', function (req, res, next) {
    // logout logic

    // clear the user from the session object adn save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.user = null;
    req.session.save(function (err) {
        if (err) next (err)
        
        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate(function (err) {
            if (err) next(err)
            res.redirect('/');
        })
    })
})

// Add all the route handlers in mainRoutes to the app under the path /
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

// Add all the route handlers in organizerRoutes to the app under the path /organizer
const organizerRoutes = require("./routes/organizer");
app.use('/organizer', isAuthenticated, organizerRoutes);

const attendeeRoutes = require("./routes/attendee");
app.use('/attendee', attendeeRoutes);

// Add all the route handlers in usersRoutes to the app under the path /users
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

app.use(function (err, req, res, next) {    
    res.status(500).send("Something went wrong: " + err.message);
});

// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

