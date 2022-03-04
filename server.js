const express = require('express');
const path = require('path');
const fs = require('fs');
const uid = require('.uniqid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//Default Get route to serve the homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//Get route for notes HTML page
app.get("/notes", (req, res) => {
    console.log("Received a get request for the /notes page");
});

//Get route for the api
app.get("/api/notes", (req, res) => {
    console.log("Received a get request for the api/notes page");
});

//Post route for the api notes page
app.post("/api/notes", (req, res) => {
    console.log("Received a post request for the api/notes page");
});

//Catch-all route to serve the home page
app.get("*", (req, res) => {
    console.log("got an unexpected endpoint");
});

app.listen(PORT, () => console.log("Listening at port "+PORT));