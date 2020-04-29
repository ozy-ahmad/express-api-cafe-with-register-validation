var express = require("express");
var path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const privateKey = "testing123";

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/User");
const menuRouter = require("./routes/Menu");
const categoryRouter = require("./routes/Category");

var app = express();
mongodConnect = process.env.DB_CONNECTION;
mongoose.connect(mongodConnect, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/menu", validateUser, menuRouter);
app.use("/category", validateUser, categoryRouter);

function validateUser(req, res, next) {
  jwt.verify(req.headers["x-access-token"], privateKey, (err, decoded) => {
    if (err) {
      res.json(err);
    } else {
      req.body.userId = decoded.id;
      next();
    }
  });
}
module.exports = app;
