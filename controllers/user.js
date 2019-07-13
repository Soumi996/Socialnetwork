const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Getting Models
const User = require("../model/user");

// Get All Users
const getAllUsers = (req, res) => {
  User.user.find({}, (err, response) => {
    console.log(response)
    if (err){
      return res.status(400).json({ error: "OOPS ERROR HAPPENED" });
    }else{
      res.status(200).json({
        allUsers: response
      });
    }
  }).select("_id name email updated")
}

// Get Single User
const getSingleUser = (req, res) => {
  User.user.findOne({email: req.body.email}, (err, response) => {
    
    if (err){
      return res.status(400).json({ error: "OOPS ERROR HAPPENED" });
    }else{
      res.status(200).json({
        userDetails: response
      });
    }

  }).select("_id name email")
}

// Update User
const updateUser = (req, res) => {
  User.hashing(req.body.password, (password) => {
    User.user.updateOne(
    { email: req.decoded.email },
    {
      name: req.body.name,
      email: req.body.email,
      password: password,
      updated: Date.now() 
    },
    (err, response) => {
      if (err) {
        return res.json({
          success: false,
          message: "Some Error Happed"
        });
      } else {
        return res.json({
          success: true,
          message: "User Successfully updated"
        });
      }
    }
  );
  })
}

const deleteUser = (req, res) => {
  User.user.findOne({ email: req.decoded.email },(err, response) => {
    if(err){
      return res.status(400).json({ error: "OOPS ERROR HAPPENED" });
    }else{
      if(response.length === 0){
        return res.status(200).json({ message: "No Data Found" });
      }else{
        User.user.deleteOne({email: req.decoded.email},(err) => {
        if(err){
          return res.status(400).json({error: "OOPS ERROR HAPPENED"})
        }else{
          return res.status(200).json({ message: "Data Deleted" });
        }
      })
      }
    }
  });
  
}

// Register User
const register = (req, res) => {
  // Checking if user already exist or not
  User.user.findOne({ email: req.body.email }, (err, response) => {
    if (err) return res.status(400).json({ message: "OOPS ERROR HAPPENED",status: false });
    if (response !== null) {
      return res
        .status(403)
        .json({ message: "User Already Exist", status: false });
    } else {
      // Creating a newUser
      User.hashing(req.body.password, pass => {
        let data = new User.user({
          name: req.body.name,
          email: req.body.email,
          password: pass
        });
        data.save().then(() => {
          res.status(200).json({
            message: "Signup Successful"
          });
        }).catch(err => {
          res.status(400).json({
            message: "Signup Failed",
            status: false
          });
        });
      });
    }
  });
};

// Login User
const login = (req, res) => {
  User.user.findOne({ email: req.body.email }, (err, response) => {
    // console.log(response);
    if (err) return res.status(400).json({ message: "OOPS ERROR HAPPENED",status: false });
    if (response === null || response === undefined) {
      return res
        .status(400)
        .json({
          message: "Please Check Your Email",
          status: false
        });
    } else {
      let id = response._id;
      let token = jwt.sign(
        { id: id, email: response.email, password: response.password },
        process.env.JWT_SECRET,
        { expiresIn: "5h" }
      );

      res.cookie("t", token, { expire: new Date() + 9999 });

      User.Compare(req.body.password, response.password, result => {
        if (result === "Success") {
          res.status(200).json({
            message: "Bearer " + token,
            name: response.name
          });
        } else {
          res.status(401).json({
            message: "Please Check Your Password",
            status: false
          });
        }
      });
    }
  });
}

// SignOut User
const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({ message: "Sign Out Success" });
};

// PROTECTION TO ROUTES
const requireSignIn = (req, res, next) => {
  if (req.headers["authorization"] === undefined) {
    return res.status(500).json({
      success: false,
      message: "Auth token is not supplied"
    });
  } else {
    let token = req.headers["authorization"].split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, authorizedData) => {
        // console.log(authorizedData);
        if (err) {
          return res.json({
            success: false,
            message: "Token is not valid"
          });
        } else {
          // req.decoded contains all the data
          req.decoded = authorizedData;
          next();
        }
      });
    }
  }
};


module.exports = {
  register,
  login,
  signout,
  requireSignIn,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};
