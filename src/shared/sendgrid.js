const sgMail = require("@sendgrid/mail");
const { conf } = require("../config");
sgMail.setApiKey(conf.sendgridKey);

module.exports = {
  sgMail,
};
