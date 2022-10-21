const { serializeUser } = require("../users/user-serializers");

const serializeLogin = (user, token) => {
  return { user: serializeUser(user), token };
};

module.exports = {
  serializeLogin,
};
