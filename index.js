/**
* index.js
* This is your main app entry point
*/

// Set up express, bodyparser and EJS
const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set the app to use ejs for rendering
app.use(express.static(__dirname + '/public')); // set location of static files

// Set up local variables for the application
// Per requirements, application is designed for one individual or organisation
app.locals.siteName = 'Default Name';
app.locals.sitedDescription = 'Default Description';

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

// Add all the route handlers in mainRoutes to the app under the path /
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

// Add all the route handlers in organizerRoutes to the app under the path /organizer
const organizerRoutes = require("./routes/organizer");
app.use('/organizer', organizerRoutes);

const attendeeRoutes = require("./routes/attendee");
app.use('/attendee', attendeeRoutes);

// Add all the route handlers in usersRoutes to the app under the path /users
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

// add all the route handlers in emailRoutes to the app under the path /emails
const emailRoutes = require('./routes/emails');
app.use('/emails', emailRoutes);

// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

