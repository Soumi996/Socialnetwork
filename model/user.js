const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  updated: Date
});

// Bcrypt Hash Function
const hashing = (plainPassword,callback) => {
  bcrypt.hash(plainPassword, 10, (err, hashPassowrd) => {
    if (err) {
      console.log(err);
    }
    callback(hashPassowrd);
  });
};

// Bcrypt Compare Function
const Compare = (plainPassword, hashPassowrd, callback) => {
  bcrypt.compare(plainPassword, hashPassowrd, function(err, res) {
    // console.log(res)
    if(err){
      console.log(err)
    }

    if (res) {
      callback('Success')
    } else {
      callback('Failed')
    }
  });
};
const user = mongoose.model("users", userSchema);

module.exports = { user, hashing, Compare };
