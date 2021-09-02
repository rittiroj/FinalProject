const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Platform = require("../models/platform");
const User = require("../models/user");

const getPlatformById = async (req, res, next) => {
  const platformId = req.params.pfid;

  let platform;
  try {
    platform = await Platform.findById(platformId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a platform.",
      500
    );
    return next(error);
  }

  if (!platform) {
    const error = new HttpError(
      "Could not find platform for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ platform: platform.toObject({ getters: true }) });
};

const getPlatformsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let platforms;
  let userWithplatforms;
  try {
    userWithPlatforms = await User.findById(userId).populate("platforms");
  } catch (err) {
    const error = new HttpError(
      "Fetching platforms failed, please try again later.",
      500
    );
    return next(error);
  }

  // if (!platforms || platforms.length === 0) {
  if (!userWithPlatforms || userWithPlatforms.platforms.length === 0) {
    return next(
      new HttpError("ไม่พบ Platform ของผู้ใช้งาน", 404)
    );
  }

  res.json({
    platforms: userWithPlatforms.platforms.map((platform) =>
      platform.toObject({ getters: true })
    ),
  });
};

const createPlatform = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name } = req.body;

  const createdPlatform = new Platform({
    name,
    plan: [
      {
        price,
        amount,
        description
      }
    ]
  });

  // let user;
  // try {
  //   user = await User.findById(req.userData.userId);
  // } catch (err) {
  //   const error = new HttpError(
  //     "Creating platform failed, please try again.",
  //     500
  //   );
  //   return next(error);
  // }

  // if (!user) {
  //   const error = new HttpError("Could not find user for provided id.", 404);
  //   return next(error);
  // }

  // console.log(user);

  // try {
  //   const sess = await mongoose.startSession();
  //   sess.startTransaction();
  //   await createdPlatform.save({ session: sess });
  //   user.platforms.push(createdPlatform);
  //   await user.save({ session: sess });
  //   await sess.commitTransaction();
  // } catch (err) {
  //   const error = new HttpError(
  //     "Creating platform failed, please try again.",
  //     500
  //   );
  //   return next(error);
  // }

  res.status(201).json({ platform: createdPlatform });
};

const updatePlatform = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, description } = req.body;
  const platformId = req.params.pfid;

  let platform;
  try {
    platform = await Platform.findById(platformId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update platform.",
      500
    );
    return next(error);
  }

  if (platform.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this platform.", 401);
    return next(error);
  }

  platform.name = name;
  platform.description = description;

  try {
    await platform.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update platform.",
      500
    );
    return next(error);
  }

  res.status(200).json({ platform: platform.toObject({ getters: true }) });
};

const deletePlatform = async (req, res, next) => {
  const platformId = req.params.pfid;

  let platform;
  try {
    platform = await Platform.findById(platformId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete platform.",
      500
    );
    return next(error);
  }

  if (!platform) {
    const error = new HttpError("Could not find platform for this id.", 404);
    return next(error);
  }

  if (platform.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this platform.",
      401
    );
    return next(error);
  }

  const imagePath = platform.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await platform.remove({ session: sess });
    platform.creator.platforms.pull(platform);
    await platform.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete platform.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted platform." });
};

exports.getPlatformById = getPlatformById;
exports.getPlatformsByUserId = getPlatformsByUserId;
exports.createPlatform = createPlatform;
exports.updatePlatform = updatePlatform;
exports.deletePlatform = deletePlatform;
