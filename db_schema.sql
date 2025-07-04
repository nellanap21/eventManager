
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create tables

CREATE TABLE IF NOT EXISTS events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_title TEXT DEFAULT 'Draft Title',
    event_descrip TEXT DEFAULT 'Draft Description',
    event_date TEXT DEFAULT CURRENT_TIMESTAMP,
    create_date TEXT,
    event_state INT NOT NULL,
    pub_date TEXT,
    ticket_max INT,
    ticket_price REAL,
    ticket_sold INT,
    d_ticket_max INT,
    d_ticket_price REAL,
    d_ticket_sold INT,
    mod_date TEXT
);

CREATE TABLE IF NOT EXISTS attendees (
    attendee_id INTEGER PRIMARY KEY AUTOINCREMENT,
    attendee_name TEXT,
    attendee_email TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_type TEXT,
    ticket_quantity INT,
    event_id INT, --the event the booking belongs to
    attendee_id INT, --the attendee the booking belongs to
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (attendee_id) REFERENCES attendees(attendee_id)
);

-- Insert default data 

-- Set up 2 events
INSERT INTO events ('event_title', 'event_descrip', 'event_date', 'create_date', 'event_state', 'pub_date', 'ticket_max', 'ticket_price', 'ticket_sold', 'd_ticket_max', 'd_ticket_price', 'd_ticket_sold', 'mod_date')
VALUES ('Chapel Sound Bath', 'Sound Bath in a Beautiful Berkeley Chapel', '2025-06-30T09:00', '2025-06-15T09:30:18.804Z', 1, '2025-06-16T22:58:48.169Z', 40, 20.99, 10, 20, 15.99, 6, '2025-06-02 14:30:00');

INSERT INTO events ('event_title', 'event_descrip', 'event_date', 'create_date', 'event_state', 'pub_date', 'ticket_max', 'ticket_price', 'ticket_sold', 'd_ticket_max', 'd_ticket_price', 'd_ticket_sold', 'mod_date')
VALUES ('Crystal Bowl Sound Bath', 'Attuning Back to Self: A Somatic Breathwork and Sound Bath Journey', '2025-08-30T12:00', '2025-06-17T22:58:18.804Z', 1, '2025-06-18T22:58:18.804Z', 20, 15.99, 0, 10, 12.99, 0, '2025-06-14 14:30:00');

INSERT INTO events ('event_title', 'event_descrip', 'event_date', 'create_date', 'event_state', 'pub_date', 'ticket_max', 'ticket_price', 'ticket_sold', 'd_ticket_max', 'd_ticket_price', 'd_ticket_sold', 'mod_date')
VALUES ('Summer Sunset Sound Bath', 'Led by Blue Muse Sound Healing in collaboration with The Celestial Voice', '2025-09-30T17:30', '2025-06-19T22:58:18.804Z', 1, '2025-06-20T22:58:18.804Z', 25, 30.99, 0, 20, 20.99, 0, '2025-06-14 14:30:00');


-- Set up 3 attendees
INSERT INTO attendees ('attendee_name', 'attendee_email') VALUES ('Allen Pan', 'allen@gmail.com');
INSERT INTO attendees ('attendee_name', 'attendee_email') VALUES ('Devin Towns', 'devin@gmail.com');
INSERT INTO attendees ('attendee_name', 'attendee_email') VALUES ('Kevin Gonzales', 'kevin@gmail.com');

-- Set up 3 bookings
INSERT INTO bookings ('ticket_type', 'ticket_quantity', 'event_id', 'attendee_id')
VALUES ('general', 2, (SELECT event_id FROM events WHERE event_id = 1), (SELECT attendee_id FROM attendees WHERE attendee_email = 'allen@gmail.com'));
INSERT INTO bookings ('ticket_type', 'ticket_quantity', 'event_id', 'attendee_id')
VALUES ('general', 0, (SELECT event_id FROM events WHERE event_id = 2), (SELECT attendee_id FROM attendees WHERE attendee_email = 'devin@gmail.com'));
INSERT INTO bookings ('ticket_type', 'ticket_quantity', 'event_id', 'attendee_id')
VALUES ('discount', 2, (SELECT event_id FROM events WHERE event_id = 1), (SELECT attendee_id FROM attendees WHERE attendee_email = 'kevin@gmail.com'));


COMMIT;

