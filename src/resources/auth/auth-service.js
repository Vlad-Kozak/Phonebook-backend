const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Conflict, Unauthorized, NotFound, BadRequest } = require("http-errors");
const { UserModel } = require("../users/user-model");
const { conf } = require("../../config");
const gravatar = require("gravatar");
const uuid = require("uuid");
const { sgMail } = require("../../shared/sendgrid");

const signUp = async (dto) => {
  const { email, password } = dto;
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new Conflict("Email in use");
  }

  const verificationToken = uuid.v4();

  const user = UserModel.create({
    email,
    password: await hashPassword(password),
    avatarURL: gravatar.url(email, { s: "250" }),
    verificationToken,
  });

  const verificationMsg = {
    to: email,
    from: "vladkozak.95.ua@gmail.com",
    subject: "Please, verify your account",
    text: `Please confirm your email http://localhost:3001/api/users/verify/${verificationToken}`,
  };

  await sgMail.send(verificationMsg);

  return user;
};

const login = async (dto) => {
  const { email, password } = dto;
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Unauthorized("Email or password is wrong");
  }

  if (!user.verify) {
    throw new Unauthorized("Please verify your email");
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new Unauthorized("Email or password is wrong");
  }

  const token = generateToken(user);

  await UserModel.findByIdAndUpdate({ _id: user._id }, { token });
  return { user, token };
};

const getCurrentUser = async (userId) => {
  const user = await UserModel.findById(userId);
  return user;
};

const logout = async (userId) => {
  await UserModel.findByIdAndUpdate({ _id: userId }, { token: null });
};

const updateUser = async (userId, fields) => {
  const user = await UserModel.findByIdAndUpdate({ _id: userId }, fields, {
    new: true,
  });

  if (!user) {
    throw new NotFound(`Not found contact id: ${userId}`);
  }

  return user;
};

const getUserByVerificationToken = async (verificationToken) => {
  const user = await UserModel.findOne({ verificationToken });

  if (!user) {
    throw new NotFound("User not found");
  }

  await UserModel.findByIdAndUpdate(
    { _id: user._id },
    { verificationToken: null, verify: true }
  );
};

const reVerificationUser = async (email) => {
  if (!email) {
    throw new BadRequest("Missing required field email");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new NotFound("User not found");
  }

  if (user.verify) {
    throw new BadRequest("Verification has already been passed");
  }

  const verificationToken = user.verificationToken;
  const verificationMsg = {
    to: email,
    from: "vladkozak.95.ua@gmail.com",
    subject: "Please, verify your account",
    text: `Please confirm your email http://localhost:3001/api/users/verify/${verificationToken}`,
  };

  await sgMail.send(verificationMsg);
};

const hashPassword = (password) => {
  return bcrypt.hash(password, conf.saltRounds);
};

const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

const generateToken = (user) => {
  return jwt.sign({ sub: user._id.toString() }, conf.secret, {
    expiresIn: "2w",
  });
};

module.exports = {
  signUp,
  login,
  getCurrentUser,
  logout,
  updateUser,
  getUserByVerificationToken,
  reVerificationUser,
};
