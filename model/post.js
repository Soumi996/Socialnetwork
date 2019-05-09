const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Title is Required",
    minlength: 4,
    maxlength: 150
  },
  body: {
    type: String,
    required: "Body is Required",
    minlength: 10,
    maxlength: 1000
  },
  photo: {
    type: String,
    required: true
  },
  postedBy: {
    type: ObjectId,
    ref: "users"
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

const post = mongoose.model('posts', postSchema)

module.exports = { post }
