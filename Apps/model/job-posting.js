const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobSchema = new Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  salary: Number,
  postedAt: { type: Date, default: Date.now },
});
const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
