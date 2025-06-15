// javascript functionality for the organizer home page

function copyLink(event_id) {

    const url = "http://localhost:3000/attendee/book-event/" + event_id;
    navigator.clipboard.writeText(url);
    alert("Link has been copied to clipboard!"); 
}
