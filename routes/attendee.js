// create a new router
const express = require("express");
const router = express.Router();

// handle the attendee routes
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

// promisify db.all
function dbAll(sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// promisify db.get
function dbGet(sql, params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// promisify db.run
function dbRun(sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, 
        function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

async function getEvent (req, res, next) {
    const recordId = req.params.id;
    let sqlquery = "SELECT * FROM events WHERE event_id = ?";
    try {
        const result = await dbGet(sqlquery, recordId);
        req.body.ticket_max = result.ticket_max;
        req.body.d_ticket_max = result.d_ticket_max;
        next();
    } catch (error) {
        console.error(error);
    }
}

async function checkTickets (req, res, next) {
    const eventId = req.params.id;
    let sqlqueryCheck = "SELECT * FROM bookings WHERE event_id = ? AND ticket_type = ?";
    let bookingCheckData = [eventId, req.body.ticket_type];
    let rows = [];
    try {
        rows = await dbAll(sqlqueryCheck, bookingCheckData);
    } catch (error) {
        console.error(error);
    }
    // calculate tickets already sold
    let ticketsSold = 0;
    for (let i = 0; i < rows.length; i++) {
        ticketsSold += rows[i].ticket_quantity;
    }

    if (req.body.ticket_type == 'general' && (ticketsSold + parseInt(req.body.ticket_quantity)) > req.body.ticket_max) {
        res.send(`There are only ${req.body.ticket_max - ticketsSold} general tickets available.`)
        // change send to alert and redirect
    }
    else if (req.body.ticket_type == 'discount' && (ticketsSold + parseInt(req.body.ticket_quantity)) > req.body.d_ticket_max) {
        res.send(`There are only ${req.body.d_ticket_max - ticketsSold} discount tickets available.`);
        // change send to alert and redirect
    } else {
        next();
    }
};

async function createAttendee (req, res, next) {

    // TODO: Change so you check if attendee already exists

    let sqlqueryAttendee = "INSERT INTO attendees ('attendee_name', 'attendee_email') VALUES (?, ?)";
    let newAttendee = [req.body.attendee_name, req.body.attendee_email];
    try {
        result = await dbRun(sqlqueryAttendee, newAttendee);
        req.body.attendeeId = result.lastID;
        next();
    } catch (error) {
        console.log(error);
    }
}

async function createBooking (req, res, next) {
    const sqlqueryBooking = "INSERT INTO bookings ('ticket_type', 'ticket_quantity', 'event_id', 'attendee_id') VALUES (?, ?, ?, ?)";
    let newBooking = [req.body.ticket_type, req.body.ticket_quantity, req.params.id, req.body.attendeeId];
    try {
        result = await dbRun(sqlqueryBooking, newBooking);
        next();
        // res.send("booking created")
    } catch (error) {
        console.log(error);
    }
}

const booking = [getEvent, checkTickets, createAttendee, createBooking];


router.post("/book-event/:id/", booking, (req, res) => {
    res.redirect("/attendee");

});

module.exports = router;