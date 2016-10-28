const mongoose = require('mongoose');

const sausageSchema = new mongoose.Schema({
  sausage: { type: String, required: true},
  meat: String,
  girth: Number
});

module.exports = mongoose.model("Sausage", sausageSchema);
