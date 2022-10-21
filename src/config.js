const { strict } = require("assert");
const convict = require("convict");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const config = convict({
  port: {
    doc: "Port to listen for clients requests",
    format: Number,
    default: 3000,
    env: "PORT",
  },
  dbUrl: {
    doc: "MongoDB connection URL",
    format: String,
    default: "",
    env: "DB_URL",
  },
  saltRounds: {
    doc: "saltRounds",
    format: Number,
    default: 12,
    env: "BCRYPT_SALT_ROUNDS",
  },
  secret: {
    doc: "JWT secret",
    format: String,
    default: "",
    env: "JWT_SECRET",
  },
  sendgridKey: {
    doc: "sendgrid api key",
    format: String,
    default: "",
    env: "SENDGRID_API_KEY",
  },
});

module.exports = { conf: config.validate({ allowed: strict }).getProperties() };
