const express = require("express");
var cookieSession = require('cookie-session');
const app = express();
const PORT = 8080;

// Set up field: initialize the Server Environment
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
var morgan = require('morgan');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['some_secret_keys'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// Database area
const users = {
    "testingID123": {
    id: "testingID123",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  }
}

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const getUserByEmail = function(userEmail, database) {
  let arrValue = Object.values(database);
  for (let i = 0; i < arrValue.length; i++){
    console.log("TEST________", arrValue[i]["email"], userEmail)
  	if (arrValue[i]["email"] === userEmail ) {
        return arrValue[i]["id"];
    }
  }
  return null;
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
  console.log("Here is the URLS GET page.");
  const userID = req.session.user_id;
  const user = users[userID];
  // This is the logIN case
  let userDatabase = {};
  if (user !== undefined){
    const databaseArr =  Object.keys(urlDatabase);
    for (let ele of databaseArr){
      const shortURL = urlDatabase[ele];
      console.log(shortURL);
      if (user.id === urlDatabase[ele].userID) {
        userDatabase[ele] = shortURL;
        console.log(userDatabase);
      }
    }
  }
  let templateVars = { urls: userDatabase, passinUser: user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  console.log("In the URLS NEW GET page");
  console.log("This is REQ.COOKIE: ", req.session);
  console.log(Object.keys(req.session).length === 0);

  const userID = req.session.user_id;
  const user = users[userID];
  // This is the logIN case
  if (user === undefined){
    res.redirect("/login");
  } else {
    console.log("IN THE STATEMENT!!!!_______________________");
    let templateVars = { urls: urlDatabase, passinUser: user };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  console.log("req.params", req.params);
  shortLink = req.params.shortURL;
  longLink = urlDatabase[shortLink]["longURL"];
  let templateVars = { shortURL: shortLink, longURL: longLink, passinUser: user};
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], passinUser: user};
  res.render("urls_newTem", templateVars);
});

app.get("/login", (req, res) => {
  console.log("IN LOGIN GET");
  const longURL = urlDatabase[req.params.shortURL];
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
  console.log();
  const randomNewUserID = generateRandomString();
  console.log("randomNewUserID is :" + randomNewUserID);
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  console.log("userEmail: " + userEmail);
  console.log("userPassword: " + userPassword);
  // Handle Registration Errors
  if (userEmail === undefined || userPassword === undefined){
    res.status(403).send("Oh uh, one of or both of Email and password fields are UNDEFINED.");
  }
  else if (userEmail === "" || userPassword === ""){
    res.status(403).send("Oh uh, one of or both of Email and password fields are empty.");
  }
  if (getUserByEmail(userEmail, users)) {
    res.status(403).send("Oh uh, it seems like this email is already registered.");
  }

  const hashedPassword = bcrypt.hashSync(userPassword, 10);
  console.log("Password is: ", userPassword);
  console.log("hashedPassword is: ", hashedPassword);

  users[randomNewUserID] = {
    id: randomNewUserID,
    email: userEmail,
    password: hashedPassword
  };
  // this needs to set the new cookie
  // but how come we need set a new cookie but not just use the res.cookie?
  // res.cookie("user_id", randomNewUserID);
  // res.session("user_id", randomNewUserID);
  req.session.user_id = randomNewUserID;

  // req.session.user_id = "user_id";
  // req.session.user_id = "user_id";
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  // codes
  console.log("IN THE URLS POST PAGE:", typeof req.body);

  let shortURL = generateRandomString();
  newLongURL = req.body["longURL"];
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL]["longURL"] = newLongURL;
  urlDatabase[shortURL]["userID"] = req.session.user_id;
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // codes
  ///
  console.log("jererererere");
  const userID = req.session.user_id;
  const user = users[userID];
  // This is the logIN case
  if (user === undefined){
    res.redirect("/urls");
  } else {
    const shortNewURL = req.params.shortURL;
    delete urlDatabase[shortNewURL];
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  const randomNewUserID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!getUserByEmail(email, users) || !bcrypt.compareSync(password, users[getUserByEmail(email, users)]["password"])) {
    res.status(403).send("Oh uh, account doesn't exist or the password doesn't match.");
  }
  else{
    // res.cookie("user_id", getUserByEmail(email));    
    //error here
    req.session.user_id = getUserByEmail(email, users);
    
    // console.log(req.cookies);
    res.redirect("/urls");
  }
});

app.post("/logout/", (req, res) => {
  console.log("-------------------------------------------------------------------");
  console.log("In the LOGOUT page");
  const inputName = req.session.user_id;
  console.log(typeof inputName);
  // console.log(req.cookies.user_id);
  req.session = null;
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortNewURL = req.params.shortURL;
  console.log("IN THE SHORT URL POST PAGE");
  console.log(req);

  const newLongURL = req.body['Long URL'];
  urlDatabase[shortNewURL]["longURL"] = newLongURL;
  console.log("IN THE POST :SHORTURL Page: " + newLongURL);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  // Notify the user when the Server listening the Client
  console.log(`Example app listening on port ${PORT}!`);
});