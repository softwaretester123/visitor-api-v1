const mongoose = require("mongoose");

//creating schema for user database.
const visitor_Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  phone: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("Visitor", visitor_Schema);
