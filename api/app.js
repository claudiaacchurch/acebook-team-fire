const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");

const postsRouter = require("./routes/posts");
const authenticationRouter = require("./routes/authentication");
const usersRouter = require("./routes/users");
const tokenChecker = require("./middleware/tokenChecker");

const app = express();

//cors
app.use(cors());

// setup for receiving JSON
app.use(express.json());

app.use(logger("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/build")));


// route setup
app.use("/api/posts", tokenChecker, postsRouter);
app.use("/api/tokens", authenticationRouter);
app.use("/api/users", usersRouter);

// When in production the backend will forward all requests to the production client, (which doesn't live on a server)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "../frontend/build/index.html"))
})


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../frontend/build/index.html"));
});

// error handler
app.use((err, _req, res, _) => {
  // respond with details of the error
  res
    .status(err.status || 500)
    .json({ message: "server error", code: err.status || 500 });
});

module.exports = app;
