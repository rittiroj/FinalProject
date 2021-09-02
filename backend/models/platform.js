const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const platformSchema = new Schema({
  name: { type: String, required: true },
  plans: [{
    planName: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true }
  }],
});

module.exports = mongoose.model("Platform", platformSchema);
