'use strict';

// TODO: Write the homework code in this file
const http = require("http");
const PORT = 8080;

/* /state
 * response: the current state in a HTML format
 * When the server starts, this should return '10'
 */
const stateUrl = 'http://localhost:8080/state';

/* /add
 * Response: "OK" in HTML format
 * This should add 1 to the current state
 */
const addUrl = 'http://localhost:8080/add';

/* /subtract
 * Response: "OK" in HTML format
 * This should subtract 1 ƒrom the current state
 */
const subtractUrl = 'http://localhost:8080/subtract';

/* /reset
 * Response: "OK" in HTML format
 * This should set the state back to '10'
 */
const resetUrl = 'http://localhost:8080/reset';

/* Any other URL
 * Response: return error code 404: 'Not found' with a friendly message and do
 * not change the state variable
 */
const badUrl = 'http://localhost:8080/bad';


// The state variable
let state = 10;

const server = http.createServer(function(request, response) {
  switch(("http://localhost:" + PORT + request.url)) {
    case stateUrl:
      response.setHeader("Content-Type", "text/html");
      response.write("<h2>" + state + "</h2>");
      break;
    case addUrl:
      state++;
      response.setHeader("Content-Type", "text/html");
      response.write("<h2>OK</h2>");
      break;
    case subtractUrl:
      state--;
      response.setHeader("Content-Type", "text/html");
      response.write("<h2>OK</h2>");
      break;
    case resetUrl:
      state = 10;
      response.setHeader("Content-Type", "text/html");
      response.write("<h2>OK</h2>");
      break;
    case badUrl:
    default:
      console.log("Error. Bad URL: " + request.url);
      response.statusCode = 404;
      response.setHeader("Content-Type", "text/html");
      response.write("<h1>Error</h1><p>You asked for: " + request.url + "<br>");
      response.write("There is nothing served from this URL.<br>");
      response.write("Make a different request please.</p>");
      break;
  }
  response.end();
});

server.listen(PORT, function() {
  console.log("The server is listening on localhost port " + PORT);
});
