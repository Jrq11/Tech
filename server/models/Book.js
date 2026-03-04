const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  bookcode: String,
 copyright: {
  type: Number,
  default: () => new Date().getFullYear(),
  },
  date: Date,
  edition: String,
  units: String,
  lesson: {
  type: Number,
  required: true,
  min: 1, // optional, but ensures at least 1 lesson
  },
  description: String,

}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
