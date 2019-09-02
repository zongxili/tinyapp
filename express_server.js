const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  // Message disappear in the loaded page
  res.send("<h1>Hello!</h1>");
});

app.listen(PORT, () => {
  // Notify the user when the Server listening the Client
  console.log(`Example app listening on port ${PORT}!`);
});