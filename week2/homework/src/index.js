'use strict';

// TODO: Write the homework code in this file
var fs = require("fs");

var filename = "./todos.txt";
var todos = null;	// This keeps the todo data

switch (process.argv[2]) {
	case "list":
	  todos = read(filename);
	  if (!!todos) print(todos);
	break;
	case "add":
	  todos = read(filename);
	  var newItem = {};
	  newItem["" + (todos.length + 1)] = process.argv[3];
	  todos.push(newItem);
	  write(filename, todos);
	break;
	case "remove":
	  todos = read(filename);
	  if (!!todos) {
		var indexToRemove = todos.findIndex(function(element) {
		  return (process.argv[3] in element);
		});
		if (indexToRemove >= 0) {
			todos.splice(indexToRemove, 1);
		} else {
			console.log("You can't remove an item than is not on your todo list.");
		}
	  }
	  write(filename, todos);
	break;
	case "update":
	  todos = read(filename);
	  if (!!todos) {
		var indexToUpdate = todos.findIndex(function(element) {
		  return (process.argv[3] in element);
		});
		if (indexToUpdate >= 0) {
			var updatedObject = todos[indexToUpdate];
			updatedObject[(process.argv[3])] = process.argv[4];
			todos.splice(indexToUpdate, 1, updatedObject);
		} else { 
		    console.log("There is no such item on your todo list");
		}
	  }
	  write(filename, todos);
	break;
	case "reset":
	  reset(filename);
	  break;
	case "help":
	default:
	  var helpMessage = `
	  Manage a list of todo items. Each todo item has a number.
	  We use this number in the remove and update commnads to
	  pick a todo item. These numbers aren't always in sort-order
	  or continuous.
	  
	  Execution:
	  node index.js <command> <options>
	  
	  where command is one of these (without quotes):
	    - help: Show this message
		- list: Show the items of the list
		- add <words>: Add a new item in the list.
		- remove <n>: Remove the n-th item of the list
		- reset: Clear the list
		- update <n> <words>: Change n-th item to new content

	  `;
	  console.log(helpMessage);
	  break;
}

function reset(file) {
	try {
		fs.writeFileSync(file, JSON.stringify([]));
	} catch (err) {
		console.log(err.code);
	}
}

function read(file) {
	try {
		return JSON.parse(fs.readFileSync(file));
	} catch (err) {
		console.log(err.code);
		return null;
	}
}

function write(file, arr) {
	try {
		fs.writeFileSync(file, JSON.stringify(arr));
	} catch (err) {
		console.log(err.code);
	}
}

function print(arr) {
	arr.forEach(function(element) {
		console.log(Object.values(element)[0] + " is todo item: " + Object.keys(element)[0]);
	});
}