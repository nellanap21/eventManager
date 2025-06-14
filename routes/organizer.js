// create a new router
const express = require("express");
const router = express.Router();

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
    let sqlquery = "INSERT INTO events (event_state) VALUES (0)";

    global.db.run(sqlquery, function (err) {
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
})

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

module.exports = router;