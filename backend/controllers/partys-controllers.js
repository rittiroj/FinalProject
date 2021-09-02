const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Party = require("../models/party.js");
const User = require("../models/user");

const getPartys = async (req, res, next) => {
  let parties;
  try {
    parties = await Party.find({})
  } catch (err) {
    const error = new HttpError(
      'Fetching parties failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ parties: parties.map(party => party.toObject({ getters: true })) });
};

const getPartyById = async (req, res, next) => {
  const partyId = req.params.pid;

  let party;
  try {
    party = await Party.findById(partyId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a party.",
      500
    );
    return next(error);
  }

  if (!party) {
    const error = new HttpError(
      "Could not find party for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ party: party.toObject({ getters: true }) });
};

const getPartysByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let partys;
  let userWithpartys;
  try {
    userWithPartys = await User.findById(userId).populate("partys");
  } catch (err) {
    const error = new HttpError(
      "Fetching partys failed, please try again later.",
      500
    );
    return next(error);
  }

  // if (!partys || partys.length === 0) {
  if (!userWithPartys || userWithPartys.partys.length === 0) {
    return next(
      new HttpError("ไม่พบปาร์ตี้ของผู้ใช้งาน", 404)
    );
  }

  res.json({
    partys: userWithPartys.partys.map((party) =>
      party.toObject({ getters: true })
    ),
  });
};

const createParty = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, platform, amount_platform } = req.body;

  var createdParty = new Party({
    title,
    description,
    platform,
    amount_platform,
    image: req.file.path,
    members: [],
    creator: {}
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
    createdParty.members.push(user)
    createdParty.creator = user
  } catch (err) {
    const error = new HttpError(
      "Creating party failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdParty.save({ session: sess });
    user.partys.push(createdParty);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating party failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ party: createdParty });
};

const updateParty = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const partyId = req.params.pid;

  let party;
  try {
    party = await Party.findById(partyId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update party.",
      500
    );
    return next(error);
  }

  if (party.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this party.", 401);
    return next(error);
  }

  party.title = title;
  party.description = description;

  try {
    await party.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update party.",
      500
    );
    return next(error);
  }

  res.status(200).json({ party: party.toObject({ getters: true }) });
};

const joinParty = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const partyId = req.params.pid;

  let party;  
  let user;
  try {
    party = await Party.findById(partyId);    
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update party.",
      500
    );
    return next(error);
  }

  try {
    party.members.push(user)
    await party.save();
    user.partys.push(party)
    await user.save()
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update party.",
      500
    );
    return next(error);
  }

  res.status(200).json({ party: party.toObject({ getters: true }) });
};

const deleteParty = async (req, res, next) => {
  const partyId = req.params.pid;

  let party;
  try {
    party = await Party.findById(partyId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete party.",
      500
    );
    return next(error);
  }

  if (!party) {
    const error = new HttpError("Could not find party for this id.", 404);
    return next(error);
  }

  if (party.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this party.",
      401
    );
    return next(error);
  }

  const imagePath = party.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await party.remove({ session: sess });
    party.creator.partys.pull(party);
    await party.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete party.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted party." });
};

exports.getPartys = getPartys
exports.getPartyById = getPartyById;
exports.getPartysByUserId = getPartysByUserId;
exports.createParty = createParty;
exports.updateParty = updateParty;
exports.joinParty = joinParty;
exports.deleteParty = deleteParty;
