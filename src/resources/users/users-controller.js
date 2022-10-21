const { Router } = require("express");
const { extname, resolve } = require("path");
const uuid = require("uuid");
const multer = require("multer");
const authService = require("../auth/auth-service");
const { subscriptionSchema } = require("./users-schemas");
const { serializeUserResponse } = require("./user-serializers");
const { validate } = require("../../shared/middlewares/validate");
const { catchAsync } = require("../../shared/middlewares/catch-async");
const { authorize } = require("../../shared/middlewares/authorize");
const { compressImage } = require("../../shared/middlewares/compressImage");

const usersRouter = Router();

const storage = multer.diskStorage({
  destination: "tmp",
  filename: (req, file, cb) => {
    const ext = extname(file.originalname);
    return cb(null, uuid.v4() + ext);
  },
});

const upload = multer({ storage });

usersRouter.patch(
  "/",
  authorize,
  validate(subscriptionSchema),
  catchAsync(async (req, res, next) => {
    const { subscription } = req.body;

    const user = await authService.updateUser(req.userId, {
      subscription,
    });

    res.status(200).send(serializeUserResponse(user));
  })
);

usersRouter.patch(
  "/avatars",
  upload.single("avatar"),
  authorize,
  compressImage,
  catchAsync(async (req, res, next) => {
    const { filename } = req.file;

    const user = await authService.updateUser(req.userId, {
      avatarURL: `${resolve("public/avatars")}/${filename}`,
    });
    res.status(200).send({ avatarURL: user.avatarURL });
  })
);

module.exports = usersRouter;
