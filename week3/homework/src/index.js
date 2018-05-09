'use strict';

// TODO: Write the homework code in this file
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const uuidv4 = require("uuid/v4");
const fs = require("fs");
const PORT = 3000;
const filename = "./todos.txt";


function returnItem(uuid) {
  try {
    var todosArray = JSON.parse(fs.readFileSync(filename));
  } catch (err) {
    console.log("Could not retrieve todo items.")
    console.log("Error code: " + err.code);
    return -2;
  }
  var item = todosArray.findIndex(function(element) {
    return element.uuid === uuid;
  });
  if (item >= 0) {
    item = todosArray[item];
    return item;
  } else {
    return -1;
  }
}

function updateItem(arr, item) {
  var index = arr.findIndex(function(element) {
    return element.uuid === item.uuid;
  });
  console.log(index);
  if (index >= 0) {
    arr[index] = item;
  } else {
    return -1;
  }
  try {
    fs.writeFileSync(filename, JSON.stringify(arr));
    return 0;
  } catch (err) {
    console.log("I could not update the todo item");
    console.log("Error code: " + err.code);
    return -2;
  }
}

// This has no path specified so the callback function is called for every
// request on the application (eg. /, /put, /whatever).
// The callback function being the bodyparser middleware populates a
// new body object containing the parsed JSON data on the request object.
app.use(bodyParser.json());

app.get("/", function(request, response) {
	// request.query returns the URI parameters of the request
	// e.g. http://localhost:3000/?message=World!
	let message = (request.query.message === undefined) ? "World!" : request.query.message;
	console.log("Hello", message);
	response.send(`Hello ${message}`);
});


app.put("/todos/:uuid", function(request, response) {
  if (request.body.description === undefined) {
    console.log("You should provide a new todo description");
    response.status(500).send("ERROR");
    return;
  }
  var uuid = request.params.uuid;
  var item = returnItem(uuid);
  if (item === -1 ) {
    console.log("Could not find such item");
    response.status(404).send("OK");
  } else if (item === -2 ) {
    response.status(500).send("ERROR");
  } else {
    var todosArray = JSON.parse(fs.readFileSync(filename));
    item.description = request.body.description;
    if (updateItem(todosArray, item) === 0) {
      console.log("Item updated.")
      response.status(201).send("OK");
    };
  }
});

app.delete("/todos/:uuid/done", function(request, response) {
  var uuid = request.params.uuid;
  var item = returnItem(uuid);
  if (item === -1 ) {
    console.log("Could not find such item");
    response.status(404).send("OK");
  } else if (item === -2 ) {
    response.status(500).send("ERROR");
  } else {
    console.log(`Mark todo item ${uuid} as not done`);
    var todosArray = JSON.parse(fs.readFileSync(filename));
    item.done = "false";
    if (updateItem(todosArray, item) === 0) {
      console.log("Item updated.")
      response.status(201).send("OK");
    };
  }
});

app.delete("/todos/:uuid", function(request, response) {
  var uuid = request.params.uuid;
  var item = returnItem(uuid);
  if (item === -1 ) {
    console.log("Could not find such item");
    response.status(404).send("OK");
  } else if (item === -2 ) {
    response.status(500).send("ERROR");
  } else {
    console.log(`Deleting item with uuid: ${item.uuid}`);
    // Since we are here we know there is the file, and the item
    // on the file
    var todosArray = JSON.parse(fs.readFileSync(filename));
    var index = todosArray.findIndex(function(element) {
      return element.uuid === uuid;
    });
    todosArray.splice(index, 1);
    fs.writeFileSync(filename, JSON.stringify(todosArray));
    response.status(202).send("OK");
  }
});

app.delete("/todos", function(request, response) {
  // Reset todo file
  try {
		fs.writeFileSync(filename, JSON.stringify([]));
	} catch (err) {
		console.log(err.code);
	}
});

app.get("/todos", function(request, response) {
  console.log("List all todos from file");
  try {
		var todosArray = JSON.parse(fs.readFileSync(filename));
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
	} catch (err) {
		console.log(err.code);
		return null;
    response.status(500).send("ERROR");
	}
});

app.get("/todos/:uuid", function(request, response) {
	// request.query returns the URI parameters of the request
	// e.g. http://localhost:3000/todo/19455f26-4a8e-4816-b5a7-00aa641227e9
	// to access the parameter we do: request.params.uuid
  var uuid = request.params.uuid;
  var item = returnItem(uuid);
  if (item === -1 ) {
    console.log("Could not find such item");
    response.status(404).send("OK");
  } else if (item === -2 ) {
    response.status(500).send("ERROR");
  } else {
    console.log(" Done | Todo");
    var description = item.description;
    var done = (item.done === "true") ? "  + " : "  - ";
    console.log(done + "  | " + description);
    response.status(200).send("OK");
  }
});

app.post("/todos", function(request, response) {
	if (request.body.todo === undefined) response.status(400).send();
  var obj = request.body.todo;
  obj.uuid = uuidv4();
  // FIXME - Save todo on file.
  var todosArray = null;
  try {
    todosArray = JSON.parse(fs.readFileSync(filename));
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.log("There was an error. I could not add todo item.")
      console.log("Error code: " + err.code);
      return null;
    } else {
      todosArray = [];
    }
  }
  todosArray.push(obj);
  try {
    fs.writeFileSync(filename, JSON.stringify(todosArray));
  } catch (err) {
    console.log(err.code);
  }
	// Sending response with 201 status because
	// POST changes data and should the client
	// would expect the CREATED status response
	// which is 201.
	response.status(201).send("OK");
});

app.post("/todos/:uuid/done", function(request, response) {
  var uuid = request.params.uuid;
  var item = returnItem(uuid);
  if (item === -1 ) {
    console.log("Could not find such item");
    response.status(404).send("OK");
  } else if (item === -2 ) {
    response.status(500).send("ERROR");
  } else {
    console.log(`Mark todo item ${uuid} as done`);
    var todosArray = JSON.parse(fs.readFileSync(filename));
    item.done = "true";
    if (updateItem(todosArray, item) === 0) {
      console.log("Item updated.")
      response.status(201).send("OK");
    };
  }
});

app.listen(PORT, function() {
	console.log("Server listening on port " + PORT);
});
