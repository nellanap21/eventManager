// create a new router
const express = require("express");
const router = express.Router();


const { format, parseISO } = require("date-fns"); // node cannot mix import and require in same file

// handle the organizer route
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

router.get("/site-settings", (req, res) => {
    const data = {
        siteName: req.app.locals.siteName,
        siteDescription: req.app.locals.siteDescription
    }
    res.render("site-settings.ejs", data);
});

router.post("/site-settings", (req, res) => {
    req.app.locals.siteName = req.body.siteName;
    req.app.locals.siteDescription = req.body.siteDescription;
    res.redirect('/organizer');
});


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