// create a new router
const express = require("express");
const router = express.Router();
const { format } = require("date-fns"); 
const { dbAll, dbGet, dbRun } = require("../utils/db");
const { getEvent, checkTickets, createAttendee, createBooking } = require("../middleware/booking");

/**
 * @purpose display published events in chronological order
 * @input   none 
 * @output  renders 'attendee.ejs' with site name, site description
 *          and published events
 */
router.get("/", (req, res) => {

    let data = {
        siteName: req.app.locals.siteName,
        siteDescription: req.app.locals.siteDescription
    };

    let sqlquery = "SELECT * FROM events WHERE event_state = 1 ORDER BY event_date ASC";

    global.db.all(sqlquery, 
        function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                for (let i = 0; i < rows.length; i++) {
                  rows[i].event_date = format(rows[i].event_date, 'LLL d @ h:mm aaa');
                }
                data.publishedEvents = rows;
                res.render("attendee.ejs", data);
            }
        }
    )
});

/**
 * @purpose display page to allow user to book an event
 * @input   req.params.id - the ID of the event to 
 *          retrieve from the database 
 * @output  renders 'book-event.ejs' with event data
 */
router.get("/book-event/:id", (req, res) => {
    const recordId = req.params.id;
    let sqlquery = "SELECT * FROM events WHERE event_id = ?";
    global.db.get(sqlquery, [recordId], (err, result) => {
        if (err) {
            next(err);
        } else if (result == 0) {
            res.send("No event found");
        } else {
            result.event_date = format(result.event_date, 'LLL d @ h:mm aaa');
            res.render("book-event.ejs", {data: result});
        }
    });
});

/**
 * @purpose handle the full ticket booking workflow
 * @input   req.params.id - the ID of the event 
 *          req.body.attendee_name - attendee's name 
 *          req.body.attendee_email - attendee's email 
 *          req.body.ticket_type - type of ticket
 *          req.body.ticket_quantity - number of tickets 
 * @output  executes all 4 booking middleware functions in sequence
 *          - get the event
 *          - check ticket availability
 *          - create attendee record
 *          - create booking record
 */
const booking = [getEvent, checkTickets, createAttendee, createBooking];
router.post("/book-event/:id/", booking, (req, res) => {
    res.redirect("/attendee");
});

module.exports = router;