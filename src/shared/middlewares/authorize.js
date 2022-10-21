const jwt = require("jsonwebtoken");
const { conf } = require("../../config");
const { UserModel } = require("../../resources/users/user-model");

const authorize = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, conf.secret);
  } catch (error) {
    return res.status(401).send("Not authorized");
  }

  const user = await UserModel.findById(payload.sub);

  if (!user && user.token !== token) {
    return res.status(401).send("Not authorized");
  }

  req.userId = payload.sub;
  next();
};

module.exports = {
  authorize,
};
