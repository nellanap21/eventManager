// create a new router
const express = require("express");
const router = express.Router();

// required for date formatting
const { format, parseISO } = require("date-fns"); 

/**
 * @purpose display organizer dashboard 
 * @input   none
 * @output  render 'organizer.ejs' with site name, site description, and events
 */
router.get("/", (req, res) => {

    let data = {
        siteName: req.app.locals.siteName,
        siteDescription: req.app.locals.siteDescription
    };

    let sqlquery = "SELECT * FROM events";

    global.db.all(sqlquery, 
        function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                let publishedEvents = [];
                let draftEvents = [];
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].event_state === 0) {
                        draftEvents.push(rows[i]);
                    } else {
                        publishedEvents.push(rows[i]);
                    }
                }
                data.draftEvents = draftEvents; 
                data.publishedEvents = publishedEvents;
                res.render("organizer.ejs", data);
            }
        }
    );
});

/**
 * @purpose display site settings page  
 * @input   none
 * @output  render 'site-settings.ejs' with site name and site description
 */
router.get("/site-settings", (req, res) => {
    const data = {
        siteName: req.app.locals.siteName,
        siteDescription: req.app.locals.siteDescription
    }
    res.render("site-settings.ejs", data);
});

/**
 * @purpose update the site name and description
 * @input   req.body.siteName - new site name 
 *          req.body.siteDescription - new site description 
 * @output  updates `req.app.locals` with new values
 */
router.post("/site-settings", (req, res) => {
    req.app.locals.siteName = req.body.siteName;
    req.app.locals.siteDescription = req.body.siteDescription;
    res.redirect('/organizer');
});

/**
 * @purpose display add event page  
 * @input   none
 * @output  saves new event to database and renders 'edit-event.ejs' with event
 */
router.get("/add-event", (req, res) => {

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString();

    let sqlquery = "INSERT INTO events (create_date, event_state, mod_date) VALUES (?, ?, ?)";
    let newRecord = [currentDateString, 0, currentDateString];

    global.db.run(sqlquery, newRecord, function (err) {
        if (err) {
            next(err);
        } else {
            res.redirect(`/organizer/edit-event/${this.lastID}`);
        }
    });
});

// TODO: consider changing to POST or DELETE route to avoid accidental link clicks
/**
 * @purpose delete a specific event from the database
 * @input   req.params.id - the ID of the event 
 * @output  deletes the event and redirects to the /organizer 
 */
router.get("/delete-event/:id", (req, res) => {
    const recordId = req.params.id;
    let sqlquery = "DELETE FROM events WHERE event_id = ?";
    global.db.run(sqlquery, [recordId], 
        function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/organizer');
            }
        }
    );
});

/**
 * @purpose publishes an event
 * @input   req.params.id - the ID of the event
 * @output  updates the event in database and redirects to /organizer
 */
router.get("/publish-event/:id", (req, res) => {
    const recordId = req.params.id;

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString();

    let sqlquery = "UPDATE events SET event_state = 1, pub_date = ? WHERE event_id = ?"
    let updatedRecord = [currentDateString, recordId];

    global.db.run(sqlquery, updatedRecord, 
        function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/organizer');
            }
        }
    );
});

/**
 * @purpose displays the edit-event page
 * @input   req.params.id - the ID of the event
 * @output  renders 'edit-event.ejs' with event data
 */
router.get("/edit-event/:id", (req, res) => {
    const recordId = req.params.id;
    let sqlquery = "SELECT * FROM events WHERE event_id = ?";
    global.db.get(sqlquery, [recordId], (err, result) => {
        if (err) {
            next(err);
        } else if (result == 0) {
            res.send("No event found");
        } else {
            // res.json({ data: result });
            res.render("edit-event.ejs", {data: result});
        }
    })
});

/**
 * @purpose updates an event in database
 * @input   req.params.id - the ID of the event
 *          req.body.event_title - updated title
 *          req.body.event_descrip - updated description 
 *          req.body.event_date - updated date 
 *          req.body.ticket_max - updated ticket limit 
 *          req.body.ticket_price - updated regular ticket price
 *          req.body.d_ticket_max - updated discounted ticket limit
 *          req.body.d_ticket_price - updated discounted ticket price 
 * @output  updates the event and renders 'edit-event.ejs'
 */
router.post("/edit-event/:id", (req, res) => {
    const recordId = req.params.id;
    const currentDate = new Date();

    let sqlquery = "UPDATE events SET event_title = ?, event_descrip = ?, event_date = ?, ticket_max = ?, ticket_price = ?, d_ticket_max = ?, d_ticket_price = ?, mod_date = ? WHERE event_id = ? RETURNING *";
    let updatedRecord = [req.body.event_title, req.body.event_descrip, req.body.event_date, req.body.ticket_max, req.body.ticket_price, req.body.d_ticket_max, req.body.d_ticket_price, currentDate.toISOString(), recordId];

    global.db.get(sqlquery, updatedRecord, 
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.render("edit-event.ejs", {data: result});
                // res.redirect(`/organizer/edit-event/${this.lastID}`);
            }
        }
     )
});

module.exports = router;