
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create your tables with SQL commands here (watch out for slight syntactical differences with SQLite vs MySQL)

CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS email_accounts (
    email_account_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_address TEXT NOT NULL,
    user_id  INT, --the user that the email account belongs to
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE IF NOT EXISTS events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_title TEXT,
    event_descrip TEXT,
    event_date TEXT,
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
    ticket_quantity INT,
    d_ticket_quantity INT,
    event_id INT, --the event the booking belongs to
    attendee_id INT, --the attendee the booking belongs to
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (attendee_id) REFERENCES attendees(attendee_id)
);

-- Insert default data (if necessary here)

-- Set up 2 events
INSERT INTO events ('event_title', 'event_descrip', 'create_date', 'event_state', 'pub_date', 'ticket_max', 'ticket_price', 'ticket_sold', 'd_ticket_max', 'd_ticket_price', 'd_ticket_sold', 'mod_date')
VALUES ('Chapel Sound Bath', 'Sound Bath in a Beautiful Berkeley Chapel', '2025-06-30 14:30:00', 1, '2025-06-01 14:30:00', 40, 20.99, 10, 20, 15.99, 6, '2025-06-02 14:30:00');

INSERT INTO events ('event_title', 'event_descrip', 'create_date', 'event_state', 'pub_date', 'ticket_max', 'ticket_price', 'ticket_sold', 'd_ticket_max', 'd_ticket_price', 'd_ticket_sold', 'mod_date')
VALUES ('Crystal Bowl Sound Bath', 'Attuning Back to Self: A Somatic Breathwork and Sound Bath Journey', '2025-07-30 14:30:00', 0, '2025-06-12 14:30:00', 20, 15.99, 0, 10, 12.99, 0, '2025-06-14 14:30:00');

-- Set up 3 attendees
INSERT INTO attendees ('attendee_name', 'attendee_email') VALUES ('Allen Pan', 'allen@gmail.com');
INSERT INTO attendees ('attendee_name', 'attendee_email') VALUES ('Devin Towns', 'devin@gmail.com');
INSERT INTO attendees ('attendee_name', 'attendee_email') VALUES ('Kevin Gonzales', 'kevin@gmail.com');

-- Set up 3 bookings
INSERT INTO bookings ('ticket_quantity', 'd_ticket_quantity', 'event_id', 'attendee_id')
VALUES (1, 2, (SELECT event_id FROM events WHERE event_id = 1), (SELECT attendee_id FROM attendees WHERE attendee_email = 'allen@gmail.com'));
INSERT INTO bookings ('ticket_quantity', 'd_ticket_quantity', 'event_id', 'attendee_id')
VALUES (2, 0, (SELECT event_id FROM events WHERE event_id = 2), (SELECT attendee_id FROM attendees WHERE attendee_email = 'devin@gmail.com'));
INSERT INTO bookings ('ticket_quantity', 'd_ticket_quantity', 'event_id', 'attendee_id')
VALUES (1, 2, (SELECT event_id FROM events WHERE event_id = 1), (SELECT attendee_id FROM attendees WHERE attendee_email = 'kevin@gmail.com'));

-- Set up three users
INSERT INTO users ('user_name') VALUES ('Simon Star');
INSERT INTO users ('user_name') VALUES ('Dianne Dean');
INSERT INTO users ('user_name') VALUES ('Harry Hilbert');

-- Give Simon two email addresses and Diane one, but Harry has none
INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('simon@gmail.com', 1); 
INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('simon@hotmail.com', 1); 
INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('dianne@yahoo.co.uk', 2); 

COMMIT;

