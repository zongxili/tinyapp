const express = require("express");
let cookieSession = require('cookie-session');
const app = express();
const PORT = 8080;
const { generateRandomString, getUserByEmail } = require('./helpers'); // Input helper functions

// Set up field: initialize the Server Environment
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
let morgan = require('morgan'); // Supervisory Plugin function in terminal
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['some_secret_keys'], // This can be also set as "secret"
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Database area
const users = {
  "testingID123": {
    id: "testingID123",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

app.get("/", (req, res) => {
  // Message disappear in the loaded page
  res.set('Content-Type', 'application/json');
  res.send("<h1>Hello!</h1>");
});

app.get("/urls.json", (req, res) => {
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
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/urls", (req, res) => {
  console.log("Here is the URLS GET page.");
  const userID = req.session.userID;
  const user = users[userID];
  // This is the logIN case
  let userDatabase = {};
  if (user !== undefined) {
    const databaseArr =  Object.keys(urlDatabase);
    for (let ele of databaseArr) {
      const shortURL = urlDatabase[ele];
      if (user.id === urlDatabase[ele].userID) {
        userDatabase[ele] = shortURL; // Inserting data to user's database
      }
    }
  }
  let templateVars = { urls: userDatabase, passinUser: user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];
  if (user === undefined) {
    const user = { id: "nothing", error: "Please login or register first to see the URL page." };
    let templateVars = { urls: urlDatabase, passinUser: user };
    res.render("urls_login", templateVars);
  } else {
    console.log("IN THE STATEMENT!!!!_______________________");
    let templateVars = { urls: urlDatabase, passinUser: user };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];
  console.log("req.params", req.params);
  const shortLink = req.params.shortURL;
  const longLink = urlDatabase[shortLink]["longURL"];
  let templateVars = { shortURL: shortLink, longURL: longLink, passinUser: user};
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], passinUser: user};
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  console.log("IN LOGIN GET");
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], passinUser: undefined};
  res.render("urls_login", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  console.log("IN GET SHORT URL");
  console.log("Req here is ", req.params);
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  console.log("longURL =============", longURL);
  res.redirect(longURL);
});

// POST methods
app.post("/register", (req, res) => {
  const randomNewUserID = generateRandomString();
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  // Handle Registration Errors
  if (userEmail === undefined || userPassword === undefined) { // If one of those input fields are undefined
    res.status(403);
    const user = { id: "nothing", error: "Oh uh, one of or both of Email and password fields are UNDEFINED." };
    let templateVars = { urls: urlDatabase, passinUser: user };
    res.render("urls_register", templateVars);
  } else if (userEmail === "" || userPassword === "") { // If one of those fields are empty
    res.status(403);
    const user = { id: "nothing", error: "Oh uh, one of or both of Email and password fields are empty." };
    let templateVars = { urls: urlDatabase, passinUser: user };
    res.render("urls_register", templateVars);
  }
  if (getUserByEmail(userEmail, users)) { // If this account is already registered
    res.status(403);
    const user = { id: "nothing", error: "Oh uh, it seems like this email is already registered." };
    let templateVars = { urls: urlDatabase, passinUser: user };
    res.render("urls_register", templateVars);
  }
  const hashedPassword = bcrypt.hashSync(userPassword, 10);
  users[randomNewUserID] = {
    id: randomNewUserID,
    email: userEmail,
    password: hashedPassword
  };
  req.session.userID = randomNewUserID;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  const newLongURL = req.body["longURL"];
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL]["longURL"] = newLongURL;
  urlDatabase[shortURL]["userID"] = req.session.userID;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];
  if (user === undefined) {
    res.redirect("/urls");
  } else {
    const shortNewURL = req.params.shortURL;
    delete urlDatabase[shortNewURL];
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!getUserByEmail(email, users) || !bcrypt.compareSync(password, getUserByEmail(email, users)["password"])) { // If the email or password not match
    res.status(403);
    const user = { id: "nothing", email: "The email or the password don't match.", password: null };
    let templateVars = { urls: urlDatabase, passinUser: user };
    res.render("urls_login", templateVars);
  } else if (email === "" || password === "") { // One of those field is empty
    res.status(403);
    const user = { id: "nothing", email: "Please don't leave any of those field empty.", password: null };
    let templateVars = { urls: urlDatabase, passinUser: user };
    res.render("urls_login", templateVars);
  } else {
    req.session.userID = getUserByEmail(email, users).id;
    res.redirect("/urls");
  }
});

app.post("/logout/", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortNewURL = req.params.shortURL;
  const newLongURL = req.body['Long URL'];
  urlDatabase[shortNewURL]["longURL"] = newLongURL;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});