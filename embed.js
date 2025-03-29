// This script does two main things: it creates a little box on a webpage
// and communicates with that box to change its size.

// Part 1: Creating and Injecting an iframe

// When the whole webpage finishes loading, do the following:
window.addEventListener("load", () => {

    // This function creates and injects an "iframe" into the webpage.
    // An iframe is like a little window inside the webpage.
    (function (s, i, f, o, l, n) {

        // Find all script tags on the page.
        let ss = document.getElementsByTagName(l);

        // Initialize an empty string to store a part of the script tag's source URL.
        let qp = "";

        // Loop through each script tag to find the one related to the YodaBot.
        for (const t of ss) {
            if (t.src.indexOf(n) > -1 && t.src.indexOf('?') > -1) {
                // If found, extract the part of the URL that comes after the "?".
                qp = t.src.slice(t.src.indexOf('?'));
                break;
            }
        }

        // Create a new "div" element (a box in the webpage).
        let p = document.createElement(s);

        // Set the id of the div element to "edenai-message-iframe-container".
        p.id = i;

        // Set some styles for the div element to make it look a certain way.
        p.style = "position: fixed; z-index: 123456789; right: 10px; bottom: 0; height: 662px; width: 333px; min-height: 96px; min-width: 100px";

        // Create a new "iframe" element (a little window inside the box).
        let m = document.createElement(f);

        // Set the source (URL) of the iframe by combining a base URL and the extracted part of the URL.
        m.src = `${o}${qp}`;

        // Set some styles for the iframe to make it fill the whole box.
        m.style = "width: 100%; height: 100%; border: 0";

        // Put the iframe inside the box.
        p.appendChild(m);

        // Put the box in the webpage.
        document.body.appendChild(p);

    })("div", "edenai-message-iframe-container", "iframe", "https://widget.mhapy.com/", 'script', 'gh/mhapy/widget-connector');
    // The above line is where the function is called with specific values.

    // Part 2: Handling Messages from the iframe

    // This function listens for messages sent by the iframe.
    (function (e, o, i, h, s, v, w, x, y) {

        // When a message is received, do the following:
        window.addEventListener(e, function (ev) {
            // Check if the message came from the expected source (origin).
            console.log("Received a message:", ev.data);
            console.log("Message sent from:", ev.origin);
            if (ev.origin != o) return;

            // Find the box on the webpage using its id.
            let cbc = document.getElementById(i);

            // Adjust the size of the box based on the content of the message.
            switch (ev.data) {
                case h:
                    cbc.style.height = v;
                    cbc.style.width = w;
                    break;
                case s:
                    cbc.style.height = x;
                    cbc.style.width = y;
            }
        }, false);

    })("message", "https://widget.mhapy.com/", "edenai-message-iframe-container", "hide", "show", "662px", "333px", "670px", "400px");
    // The above line is where the function is called with specific values.

});
