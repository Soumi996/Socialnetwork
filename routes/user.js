const express = require("express");
const { register, login, signout, requireSignIn, getAllUsers, getSingleUser, updateUser, deleteUser } = require("../controllers/user");
const validator = require("../validators/user");
const router = express.Router();

// POST ROUTE
// DEF : LOGIN AND GET TOKEN
// PARAMS : ['RoutePath','ControllerLogic']
router.post("/login", validator.login , login);

// POST ROUTE
// DEF : REGISTER YOUR SELF
// PARAMS : ['RoutePath','ExpressValidatorLogic','ControllerLogic']
router.post("/register", validator.register, register);

// GET ROUTE
// DEF : SIGNOUT
router.get("/signout", signout);

// POST ROUTE
// DEF : GET ALL USERS
// PARAMS : ['RoutePath','TokenValidation','ControllerLogic']
router.get("/allusers", getAllUsers);

// POST ROUTE
// DEF : GET SINGLE USER
// PARAMS : ['RoutePath','TokenValidation','ControllerLogic']
router.post("/singleuser", requireSignIn, getSingleUser);

// PUT ROUTE
// DEF : UPDATE USER
// PARAMS : ['RoutePath','TokenValidation','ControllerLogic']
router.put("/updateuser", requireSignIn, updateUser);

// DELETE ROUTE
// DEF : DELETE USER
// PARAMS : ['RoutePath','TokenValidation','ControllerLogic']
router.delete("/deleteuser", requireSignIn, deleteUser);

module.exports = router;
