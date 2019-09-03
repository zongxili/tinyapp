const express = require("express");
const app = express();
const PORT = 8080;

// Set up field
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
var morgan = require('morgan')
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

function generateRandomString() {
  var returnOutput = "";
  var charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < 6; i++ ) {
    returnOutput += charList.charAt(Math.floor(Math.random() * charList.length));
  }
  return returnOutput;
}

app.get("/", (req, res) => {
  // Message disappear in the loaded page
  res.set('Content-Type', 'application/json');
  res.send("<h1>Hello!</h1>");
  // res.send(urlDatabase);
});

app.get("/urls.json", (req, res) => {
  // res.write("Before testing");
  // res.write("After testing");
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});


app.get("/urls", (req, res) => {
  // console.log("Here is the URLS HOME page.");
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(`/urls/${longURL}`);
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  // codes
  console.log(typeof req.body);
  let shortURL = generateRandomString();
  newLongURL = req.body["longURL"];
  urlDatabase[newLongURL] = shortURL;
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // codes
  const shortNewURL = req.params.shortURL;
  delete urlDatabase[shortNewURL];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  // Notify the user when the Server listening the Client
  console.log(`Example app listening on port ${PORT}!`);
});