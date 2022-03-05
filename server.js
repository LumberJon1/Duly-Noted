const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");
const { title } = require("process");

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
    res.sendFile(path.join(__dirname, "/public/notes.html"))
});

//Get route for the api
app.get("/api/notes", (req, res) => {
    console.log("Received a get request for the api/notes page.  Sending db.json");
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

//Get route for a note by ID
app.get("/api/notes/:id", (req, res) => {
    //Check to ensure server was supplied valid data
    if (req.body && req.params.id) {
        let reqID = req.params.id;

        //Parse through the db.json and find the note ID that matches reqID
        fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
            if (err) {
                throw err;
            }
            const dbArray = JSON.parse(data);
            for (let i = 0; i < dbArray.length; i++) {
                if (dbArray[i].id === reqID) {
                    console.log("Selected Note "+dbArray[i].id);
                    res.send(JSON.stringify(dbArray[i]));
                }
            }
        });
    }
    else {
        res.send("Invalid data provided to server.");
        res.status();
    }
})

//Post route for the api notes page
app.post("/api/notes", (req, res) => {
    console.log("Received a post request for the api/notes page");

    let array = [];

    //Assign a unique ID to the note
    const id = uniqid();
    console.log("Note ID: "+id);

    //Destructure the body of the request
    const {title, text} = req.body;
    console.log({title, text});

    //Get the db.json file
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) {
            throw err;
        }
        if (data) {
            array = JSON.parse(data);
        }
        array.push({title, text, id: id});
        console.log(array);

        fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(array, null, 4), (err) => {
            if (err) {
                throw err;
            }
            console.log("Successfully wrote array to db.json");
        });
    })

    res.send("Successfully wrote the file to db.json!");
});

//Catch-all route to serve the home page
app.get("*", (req, res) => {
    console.log("got an unexpected endpoint");
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => console.log("Listening at port "+PORT));