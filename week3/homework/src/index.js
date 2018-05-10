'use strict';

// TODO: Write the homework code in this file
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const uuidv4 = require("uuid/v4");
const fs = require("fs");
const PORT = 3000;
const filename = "./todos.txt";

// request.query returns the URI parameters of the request
// e.g. http://localhost:3000/todo/19455f26-4a8e-4816-b5a7-00aa641227e9
// to access the parameter we do: request.params.uuid




function readArrayFromFile(file) {
  // This function returns an array on success, or null on failure
  var array;
  try {
    // If this is ok, we opened the file and read the array.
    array = JSON.parse(fs.readFileSync(file));
    return array;
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.log("There was a server error. I could not add todo item.")
      console.log("Error code: " + err.code);
      return null;
    } else {
      // There wasn't a file to read from. We create a new array
      array = [];
      return array;
    }
  }
}

function writeArrayToFile(file, array) {
  try {
    fs.writeFileSync(file, JSON.stringify(array));
    return 0;
  } catch (err) {
    console.log("Error code: " + err.code);
    return -1;
  }
}


// This has no path specified so the callback function is called for every
// request on the application (eg. /, /put, /whatever).
// The callback function being the bodyparser middleware populates a
// new body object containing the parsed JSON data on the request object.
app.use(bodyParser.json());


app.get("/", function(request, response) {
	let message = (request.query.message === undefined) ? "World!" : request.query.message;
	console.log("Hello", message);
	response.send(`Hello ${message}`);
});

// Update the to-do item with id equal uuid
app.put("/todos/:uuid", function(request, response) {
  if (request.body.description === undefined) {
    console.log("You should provide a new todo description");
    response.status(400).send("Bad Request");
    return;
  }
  // Access the uuid from the clien request
  var uuid = request.params.uuid;
  // Read the array with the to-do items
  var todosArray = readArrayFromFile(filename);
  if (todosArray === null) {
    // We had a serious error. Can't complete PUT request
    response.status(500).send("Internal Server Error");
    return;
  }
  // Find the index in the array of the to-do item with the given uuid
  var index = todosArray.findIndex(function(element) {
    return element.uuid === uuid;
  });
  if (index === -1) {
    console.log("Could not find such item");
    response.status(404).send("Not Found");
  } else {
    todosArray[index].description = request.body.description;
  }
  if (writeArrayToFile(filename, todosArray) === 0) {
    console.log(`todo with uuid: ${uuid} updated.`);
    response.status(200).send("OK");
  } else {
    response.status(500).send("Internal Server Error");
  }
});

// Set the done flag of the uuid item to false
app.delete("/todos/:uuid/done", function(request, response) {
  var uuid = request.params.uuid;
  var todosArray = readArrayFromFile(filename);
  if (todosArray === null) {
    // We had a serious error. Can't complete DELETE request
    response.status(500).send("Internal Server Error");
    return;
  }
  // Find the index in the array of the to-do item with the given uuid
  var index = todosArray.findIndex(function(element) {
    return element.uuid === uuid;
  });
  if (index === -1) {
    console.log("Could not find such item");
    response.status(404).send("Not Found");
  } else {
    todosArray[index].done = "false";
  }
  if (writeArrayToFile(filename, todosArray) === 0) {
    console.log(`todo with uuid: ${uuid} deleted.`);
    response.status(204).send("No Content");
  } else {
    response.status(500).send("Internal Server Error");
  }
});

// Delete the to-do item with id equal to uuid
app.delete("/todos/:uuid", function(request, response) {
  var uuid = request.params.uuid;
  var todosArray = readArrayFromFile(filename);
  if (todosArray === null) {
    // We had a serious error. Can't complete DELETE request
    response.status(500).send("Internal Server Error");
    return;
  }
  // Find the index in the array of the to-do item with the given uuid
  var index = todosArray.findIndex(function(element) {
    return element.uuid === uuid;
  });
  if (index === -1) {
    console.log("Could not find such item");
    response.status(404).send("Not Found");
  } else {
    todosArray.splice(index, 1);
  }
  if (writeArrayToFile(filename, todosArray) === 0) {
    console.log(`todo with uuid: ${uuid} deleted.`);
    response.status(204).send("No Content");
  } else {
    response.status(500).send("Internal Server Error");
  }
});

// Clear all to-do items
app.delete("/todos", function(request, response) {
  // Reset todo file
  if (writeArrayToFile(filename, []) === 0) {
    console.log(`todo list cleared.`);
    response.status(204).send("No Content");
  } else {
    response.status(500).send("Internal Server Error");
  }
});

// List all to-do items
app.get("/todos", function(request, response) {
  var todosArray = readArrayFromFile(filename);
  if (todosArray === null) {
    // We had a serious error. Can't complete GET request
    response.status(500).send("Internal Server Error");
    return;
  }
  console.log("There are " + todosArray.length + " todo items.");
  console.log("UUID                                 | Done | Todo");
  for (var i = 0; i < todosArray.length; i++) {
    var item = todosArray[i];
    var uuid = item.uuid;
    var description = item.description;
    var done = (item.done === "true") ? " + " : " - ";
    console.log("" + uuid + " | " + done + "  | " + description);
  }
  response.status(200).send("OK");
});

// List a single to-do item with id equal to uuid
app.get("/todos/:uuid", function(request, response) {
  var uuid = request.params.uuid;
  var todosArray = readArrayFromFile(filename);
  if (todosArray === null) {
    // We had a serious error. Can't complete GET request
    response.status(500).send("Internal Server Error");
    return;
  }
  // Find the index in the array of the to-do item with the given uuid
  var index = todosArray.findIndex(function(element) {
    return element.uuid === uuid;
  });
  if (index === -1) {
    console.log(`Could not find todo item with uuid: ${uuid}`);
    response.status(404).send("Not Found");
  } else {
    console.log(" Done | Todo");
    var description = todosArray[index].description;
    var done = (todosArray[index].done === "true") ? "  + " : "  - ";
    console.log(done + "  | " + description);
    response.status(200).send("OK");
  }
});

// Create a new to-do
app.post("/todos", function(request, response) {
	if (request.body.todo === undefined) response.status(400).send();
  var obj = request.body.todo;
  obj.uuid = uuidv4();

  var todosArray = readArrayFromFile(filename);
  if (todosArray === null) {
    // We had a serious error. Can't complete POST request
    response.status(500).send("Internal Server Error");
    return;
  }
  todosArray.push(obj);
  try {
    fs.writeFileSync(filename, JSON.stringify(todosArray));
  } catch (err) {
    console.log(err.code);
    response.status(500).send("Internal Server Error");
  }
	response.status(201).send("Created");
});

// Set the done flag of the uuid item to true
app.post("/todos/:uuid/done", function(request, response) {
  var uuid = request.params.uuid;
  var todosArray = readArrayFromFile(filename);
  if (todosArray === null) {
    // We had a serious error. Can't complete POST request
    response.status(500).send("Internal Server Error");
    return;
  }
  // Find the index in the array of the to-do item with the given uuid
  var index = todosArray.findIndex(function(element) {
    return element.uuid === uuid;
  });
  if (index === -1) {
    console.log(`Could not find todo item with uuid: ${uuid}`);
    response.status(404).send("Not Found");
  } else {
    todosArray[index].done = "true";
  }
  try {
    fs.writeFileSync(filename, JSON.stringify(todosArray));
    console.log("Item updated.")
    response.status(204).send("No Content");
  } catch (err) {
    console.log(err.code);
    response.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, function() {
	console.log("Server listening on port " + PORT);
});
