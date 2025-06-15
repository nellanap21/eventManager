// create a new router
const express = require("express");
const router = express.Router();

// handle the attendee routes
router.get("/", (req, res) => {

    let data = {
        siteName: req.app.locals.siteName,
        siteDescription: req.app.locals.siteDescription
    };

    let sqlquery = "SELECT * FROM events WHERE event_state = 1";

    global.db.all(sqlquery, 
        function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                data.publishedEvents = rows;
                res.render("attendee.ejs", data);
            }
        }
    )
});

router.get("/book-event/:id", (req, res) => {
    const recordId = req.params.id;
    let sqlquery = "SELECT * FROM events WHERE event_id = ?";
    global.db.get(sqlquery, [recordId], (err, result) => {
        if (err) {
            next(err);
        } else if (result == 0) {
            res.send("No event found");
        } else {
            res.render("book-event.ejs", {data: result});
        }
    });
});

// sql query to check sold tickets
// SELECT SUM(ticket_quantity) FROM bookings WHERE event_id = 1 AND ticket_type = 'general';

router.post("/book-event/:id/:ticketMax/:discountMax", (req, res) => {
    const eventId = req.params.id;
    const ticketMax = req.params.ticketMax;
    const discountMax = req.params.discountMax;

    let sqlqueryCheck = "SELECT * FROM bookings WHERE event_id = ? AND ticket_type = ?";
    let bookingCheckData = [eventId, req.body.ticket_type];
    global.db.all(sqlqueryCheck, bookingCheckData,
        function (err, rows) {
            ticketsSold = 0;
            for (let i = 0; i < rows.length; i++) {
                ticketsSold += rows[i].ticket_quantity;
            }

            if (req.body.ticket_type == 'general' && (ticketsSold + req.body.ticket_quantity) > ticketMax) {
                res.send(`There are only ${ticketMax - ticketsSold} tickets available.`)
                // change send to alert and redirect
            }
            if (req.body.ticket_type == 'discount' && (ticketsSold + req.body.ticket_quantity > discountMax)) {
                res.send(`There are only ${discountMax - ticketsSold} tickets available.`);
                // change send to alert and redirect
            }  

            let sqlqueryAttendee = "INSERT INTO attendees ('attendee_name', 'attendee_email') VALUES (?, ?)";
            let newAttendee = [req.body.attendee_name, req.body.attendee_email];
            global.db.run(sqlqueryAttendee, newAttendee, 
                function (err) {
                    if (err) {
                        next(err);
                    } else {
                        const attendeeId = this.lastID;
                        const sqlqueryBooking = "INSERT INTO bookings ('ticket_type', 'ticket_quantity', 'event_id', 'attendee_id') VALUES (?, ?, ?, ?)";
                        let newBooking = [req.body.ticket_type, req.body.ticket_quantity, eventId, attendeeId];
                        global.db.run(sqlqueryBooking, newBooking, 
                            function(err) {
                                if (err) {
                                    next(err);
                                } else {
                                    res.redirect("/attendee");
                                }
                            }
                        )
                    }
                }
            )
        }
        
    )

});

module.exports = router;