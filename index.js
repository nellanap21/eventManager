// Set up express, bodyparser and EJS
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(__dirname + '/public')); // set location of static files
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// Set up express session
app.use(session({
    secret: 'keyboard dog', 
    resave: false,
    saveUninitialized: true
}))

/**
 * @purpose   middleware to restrict access to authenticated users only
 * @input     req.session.user - checked to determine if a user is logged in
 * @output    if authenticated: calls `next()` to proceed to the next middleware/route
 */
function isAuthenticated (req, res, next) {

    if (req.session.user !== undefined) {
        next()
    } else {
        res.send("you are logged out");
    }
}

// Set up local variables for the application
app.locals.siteName = 'Fractals of Sound';
app.locals.siteDescription = `A collective of musicians creating sound bath experiences rooted in world music.`;

// set up SQLite
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

// add route handlers in mainRoutes to the app under path /
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

// add route handlers in organizerRoutes to the app under path /organizer
const organizerRoutes = require("./routes/organizer");
app.use('/organizer', isAuthenticated, organizerRoutes);

// add route handlers in attendeeRoutes to the app under path /attendee
const attendeeRoutes = require("./routes/attendee");
app.use('/attendee', attendeeRoutes);

// add error handler
app.use(function (err, req, res, next) {    
    res.status(500).send("Something went wrong: " + err.message);
});

// make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

