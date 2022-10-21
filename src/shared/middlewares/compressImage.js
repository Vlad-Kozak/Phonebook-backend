const Jimp = require("jimp");
const fs = require("fs/promises");
const { join } = require("path");

const UPLOADS_PATH = "public/avatars";

const compressImage = async (req, res, next) => {
  const tmpPath = req.file.path;
  const file = await Jimp.read(tmpPath);
  const newPath = join(UPLOADS_PATH, req.file.filename);
  await file.resize(250, 250).writeAsync(newPath);
  req.file.path = newPath;
  req.file.destination = UPLOADS_PATH;

  await fs.unlink(tmpPath);
  next();
};

module.exports = { compressImage };
