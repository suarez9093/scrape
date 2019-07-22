const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const logger = require("morgan");


// Scrapping tools
const cheerio = require("cheerio");
const axios = require("axios");

// Require the models
let db = require("./models");

const PORT = 3000;

// Initilize express
const app = express();

// Middleware

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static("public"));

// Setting up HandleBars

app.engine('handlebars', exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to Mongo DB
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });


// Routes

// Home Route
app.get("/", (req, res) => {
    db.Article.find({}).then(function(dbArticle){
        res.render("index", dbArticle);
    })
  
})

app.get("/scrape", (req, res) => {
     // First, we grab the body of the html with axios
  axios.get("http://www.echojs.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
    });
});

// Route to get all the Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles Model, send them back to the client
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    // Using ID passed in the id paramater, prepare a query that finds the matching one in our db
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err)
        });
});

// Route for saving/udating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: db.Note._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })
})


// Start the server 
app.listen(PORT, function () {
    console.log("App listening on port: " + PORT);
})