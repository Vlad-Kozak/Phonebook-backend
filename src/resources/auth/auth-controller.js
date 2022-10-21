const { Router } = require("express");
const { validate } = require("../../shared/middlewares/validate");
const { catchAsync } = require("../../shared/middlewares/catch-async");
const { serializeUserResponse } = require("../users/user-serializers");
const { serializeLogin } = require("./auth-serializers");
const {
  signUpSchema,
  loginSchema,
  reVerificationSchema,
} = require("./auth-schemas");
const authService = require("./auth-service");
const { authorize } = require("../../shared/middlewares/authorize");

const authRouter = Router();

authRouter.post(
  "/signup",
  validate(signUpSchema),
  catchAsync(async (req, res, next) => {
    const user = await authService.signUp(req.body);
    res.status(201).send(serializeUserResponse(user));
  })
);

authRouter.post(
  "/login",
  validate(loginSchema),
  catchAsync(async (req, res, next) => {
    const response = await authService.login(req.body);
    const { user, token } = response;
    res.status(201).send(serializeLogin(user, token));
  })
);

authRouter.get(
  "/current",
  authorize,
  catchAsync(async (req, res, next) => {
    const user = await authService.getCurrentUser(req.userId);
    res.status(200).send(serializeUserResponse(user));
  })
);

authRouter.get(
  "/logout",
  authorize,
  catchAsync(async (req, res, next) => {
    await authService.logout(req.userId);
    res.status(204).send();
  })
);

authRouter.get(
  "/verify/:verificationToken",
  catchAsync(async (req, res, next) => {
    await authService.getUserByVerificationToken(req.params.verificationToken);
    res.status(200).send("Verification successful");
  })
);

authRouter.post(
  "/verify",
  validate(reVerificationSchema),
  catchAsync(async (req, res, next) => {
    console.log(req.body.email);
    await authService.reVerificationUser(req.body.email);
    res.status(200).send("Verification email sent");
  })
);

module.exports = authRouter;
