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

module.exports = router;