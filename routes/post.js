const express = require('express')
const { getPost, createPost, userPost, upload, deletePost, updatePost } = require("../controllers/post");
const { requireSignIn } = require("../controllers/user");
const router = express.Router()

// GET ROUTE 
// DEF : TO GET ALL THE POST
// PARAMS : ['RoutePath','ControllerLogic']
router.get("/allposts", getPost);

// POST ROUTE
// DEF : TO CREATE A NEW POST
// PARAMS : ['RoutePath','TokenValidation','ControllerLogic']
router.post("/post", requireSignIn,upload.single("imageFile"), createPost);

// POST ROUTE
// DEF : TO SEE CURRENT USER POST
// PARAMS : ['RoutePath','TokenValidation','ControllerLogic']
router.post("/yourposts", requireSignIn, userPost);

// PUT ROUTE
// DEF : UPDATE A POST OF CURRENT USER
// PARAMS : ['RoutePath','TokenValidation','ControllerLogic']
router.put('/updatepost/:id', requireSignIn,upload.single("imageFile"), updatePost)

// DELETE ROUTE
// DEF : DELETE A POST OF CURRENT USER
// PARAMS : ['RoutePath','TokenValidation','ControllerLogic']
router.delete("/deletepost/:id", requireSignIn, deletePost);

module.exports = router

