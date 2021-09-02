const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const partySchema = new Schema({
  title: { type: String, required: true },
  platform: { type: String, required: true },
  amount_platform: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  members: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }]
});

module.exports = mongoose.model('Party', partySchema);
