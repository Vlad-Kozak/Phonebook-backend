const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const authRouter = require("./resources/auth/auth-controller");
const usersRouter = require("./resources/users/users-controller");
const contactsRouter = require("./resources/contacts/contacts-controller");
const { conf } = require("./config");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use("/", express.static("public"));

app.use("/api/users", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).send(err.message);
});

const PORT = conf.port;
const uriDb = conf.dbUrl;

const connection = mongoose.connect(uriDb, {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
