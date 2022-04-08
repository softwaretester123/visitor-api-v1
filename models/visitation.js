const mongoose = require("mongoose");
const vali = require("validator");

//creating schema for user database.
const visitation_Schema = new mongoose.Schema({
  visitor: {
    type: String,
    required: true
  },
  building: {
    type: String,
    required: true
  },
  floor_no: {
    type: Number,
    required: true
  },
  gate_no: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  visit_date: {
    type: Date,
    required: true
  },  
});

module.exports = mongoose.model("Visitation", visitation_Schema);
