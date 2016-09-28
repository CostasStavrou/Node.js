This week's homework

## Assignment:
Create a http server that can add and subtract from a number, which we will call the "state". Please see in `index.js` in this folder as starting material. Pay extra attention to line 21, which contains some hints for this week `console.log('New http request received', request.url);`

Rule 1: DO NOT USE EXPRESS.JS
Rule 2: you can use other packages, but you HAVE to also make a version WITHOUT any NPM packages (http, of course, is not NPM but a node native package)
```
// The state
var state = 10; 
```

Endpoints criteria
```
// /state 
// response: the current state in a html format 
// when the server starts, this should return "10"
http://localhost:8080/state 

// /add
// Response: "ok" in html format
// This should add 1 to the current state
http://localhost:8080/add

// /remove
// Response: "ok" in html format
// This should subtract 1 ƒrom the current state
http://localhost:8080/subtract

// /reset
// Response: "ok" in html format
// This should set the state back to 10
http://localhost:8080/subtract
```

## Reading
### Callbacks: 
Video: https://www.youtube.com/watch?v=pTbSfCT42_M
Read: http://callbackhell.com/

### Require/exporting
Video: https://www.youtube.com/watch?v=e1Ln1FrLvh8
Read: http://openmymind.net/2012/2/3/Node-Require-and-Exports/

### http, http listen
Video basic: https://www.youtube.com/watch?v=pYOltVz7kL0
Video routing: https://www.youtube.com/watch?v=_D2w0voFlEk (please focus on request.url, not request.method)
Read: [Node JS documentation about http](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/)
Read Advanced: --

refresh on command line
Video Mac/linux: 
Video PC: -- ()