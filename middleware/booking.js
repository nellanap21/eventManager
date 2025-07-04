const { dbAll, dbGet, dbRun } = require("../utils/db");

/**
 * @purpose retrieve event details from the database
 * @input   req.params.id - the ID of the event 
 * @output  retrieves event, adds max tickets to request body,
 *          calls next middleware
 */
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
        next(error);
    }
}


/**
 * @purpose verify ticket availability to prevent overbooking
 * @input   req.params.id - the ID of the event 
 *          req.body.ticket_type - the type of ticket 
 *          req.body.ticket_quantity - number of tickets 
 *          req.body.ticket_max - maximum general tickets 
 *          req.body.d_ticket_max - maximum discount tickets
 * @output  if enough tickets availble, calls next 
 *          if not enough tickets, sends error message
 */
async function checkTickets (req, res, next) {
    const eventId = req.params.id;
    let sqlqueryCheck = "SELECT * FROM bookings WHERE event_id = ? AND ticket_type = ?";
    let bookingCheckData = [eventId, req.body.ticket_type];
    let rows = [];
    try {
        rows = await dbAll(sqlqueryCheck, bookingCheckData);
    } catch (error) {
        console.error(error);
        next(error);
    }
    // calculate tickets already sold
    let ticketsSold = 0;
    for (let i = 0; i < rows.length; i++) {
        ticketsSold += rows[i].ticket_quantity;
    }

    if (req.body.ticket_type == 'general' && (ticketsSold + parseInt(req.body.ticket_quantity)) > req.body.ticket_max) {
        res.send(`There are only ${req.body.ticket_max - ticketsSold} general tickets available.`)
        // TODO: passing message too a view, send alert, or redirect
    }
    else if (req.body.ticket_type == 'discount' && (ticketsSold + parseInt(req.body.ticket_quantity)) > req.body.d_ticket_max) {
        res.send(`There are only ${req.body.d_ticket_max - ticketsSold} discount tickets available.`);
        // TODO: passing message too a view, send alert, or redirect
    } else { // there are enough tickets available
        next();
    }
};

/**
 * @purpose create new attendee record in DB
 * @input   req.body.attendee_name - name of attendee
 *          req.body.attendee_email - email of attendee
 * @output  insert attendee into DB, adds attendee ID to req.body
 */
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
        next(error);
    }
}

/**
 * @purpose create new ticket booking record in DB
 * @input   req.body.ticket_type - the type of ticket 
 *          req.body.ticket_quantity - number of tickets requested 
 *          req.body.attendeeId - ID of the newly created attendee
 *          req.params.id - ID of the event
 * @output  inserts a new booking record with event and attendee foreign keys
 */
async function createBooking (req, res, next) {
    const sqlqueryBooking = "INSERT INTO bookings ('ticket_type', 'ticket_quantity', 'event_id', 'attendee_id') VALUES (?, ?, ?, ?)";
    let newBooking = [req.body.ticket_type, req.body.ticket_quantity, req.params.id, req.body.attendeeId];
    try {
        result = await dbRun(sqlqueryBooking, newBooking);
        next();
        // res.send("booking created")
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = { getEvent, checkTickets, createAttendee, createBooking };