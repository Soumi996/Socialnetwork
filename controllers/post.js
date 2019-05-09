const multer = require("multer");
const fs = require("fs");

// Getting Models
const Post = require("../model/post").post;

// Get All Post
// Params : NULL
const getPost = (req, res) => {
  Post.find({}, (err, response) => {
    if (err) {
      return res.json({ error: err });
    }
    res.json({
      allPosts: response
    });
  })
    .select("_id title body")
    .populate("postedBy", "_id name");
};

// Get All Posts of Current User
// Params : GET ID OF CURRENT USER
const userPost = (req, res) => {
  Post.find({ postedBy: req.decoded.id }, (err, response) => {
    res.status(400).json({
      YourPosts: response
    });
  })
    .populate("postedBy", "_id name")
    .sort("created");
}

// Create a new Post
// Params : GET FILE DATA and GET BODY DATA
const createPost = (req, res, next) => {
  
  // Check if the File is uploaded or not
  if(req.file === undefined){
    return res.status(400).json({ message: "Please Upload a File" });
  }

  // Check the length of the title and body
  if (ContentChecker(req.body.title.length, req.body.body.length) === 1) {
    deleteFile(req.file.path);
    return res.status(400).json({ message: "Title Required" });
  } else if (ContentChecker(req.body.title.length, req.body.body.length) === 2) {
    deleteFile(req.file.path);
    return res.status(400).json({ message: "Title should be atleast 4 letter" });
  }else if (ContentChecker(req.body.title.length, req.body.body.length) === 3) {
    deleteFile(req.file.path);
    return res.status(400).json({ message: "Body Required" });
  }else if (ContentChecker(req.body.title.length, req.body.body.length) === 4) {
    deleteFile(req.file.path);
    return res.status(400).json({ message: "Body should be atleast 10 letter" });
  }
  
  // Checking the File Type
  if(FileTypeChecker(req.file) === false){
    deleteFile(req.file.path);
    return res.status(400).json({ message: "Only PNG and JPEG" });
  }
  
  // Checking the File Size
  if(FileSizeChecker(req.file) === false){
    deleteFile(req.file.path);
    return res.status(400).json({ message: "Not More Than 5 MB file" });
  }   
  
  let post = new Post(req.body);
  // Photo Path
  post.photo = req.file.path;
  // Posted By Id
  post.postedBy = req.decoded.id;
  post
  .save()
  .then(result => {
    res.status(200).json({
      post: result
    });
  })
};

// Update Post of current user
// Params : GET FILE DATA and GET BODY DATA and GET USER ID
const updatePost = (req, res) => {
  
  // Check if the File is uploaded or not
  if(req.file === undefined){
    return res.status(400).json({ message: "Please Upload a File" });
  }

  // Check the length of the title and body
  if (ContentChecker(req.body.title.length, req.body.body.length) === 1) {
    deleteFile(req.file.path);
    return res.status(400).json({ message: "Title Required" });
  } else if (ContentChecker(req.body.title.length, req.body.body.length) === 2) {
    deleteFile(req.file.path);
    return res.status(400).json({ message: "Title should be atleast 4 letter" });
  }else if (ContentChecker(req.body.title.length, req.body.body.length) === 3) {
    deleteFile(req.file.path);
    return res.status(400).json({ message: "Body Required" });
  }else if (ContentChecker(req.body.title.length, req.body.body.length) === 4) {
    deleteFile(req.file.path);
    return res.status(400).json({ message: "Body should be atleast 10 letter" });
  }
  
  // Checking the File Type
  if(FileTypeChecker(req.file) === false){
    deleteFile(req.file.path);
    return res.status(400).json({ message: "Only PNG and JPEG" });
  }
  
  // Checking the File Size
  if(FileSizeChecker(req.file) === false){
    deleteFile(req.file.path);
    return res.status(400).json({ message: "Not More Than 5 MB file" });
  }   

  Post.find({ _id: req.params.id }, (err, response) => {
    if (err) {
      return res.status(401).json({
        message: "Post notFound"
      });
    }
    if (response.length === 1) {
      deleteFile(response[0].photo);
    } else {
      return res.status(401).json({
        message: "Post notFound"
      });
    }
    Post.updateOne(
      { _id: req.params.id },
      { title: req.body.title, body: req.body.body, photo: req.file.path },
      (err, response) => {
        if (err) {
          return res.json({
            success: false,
            message: "Some Error Happed"
          });
        } else {
          return res.json({
            success: true,
            message: "Post Successfully updated"
          });
        }
      }
    );
  });
};

// Delete Post of current user
// Params : GET USER ID
const deletePost = (req, res) => {
  Post.find({ _id: req.params.id }, (err, response) => {
    if (err) {
      return res.status(401).json({
        message: "Post notFound"
      });
    }
    if(response.length === 1){
      deleteFile(response[0].photo);
    }else{
      return res.status(401).json({
        message: "Post notFound"
      });
    }
    
    Post.deleteOne({ _id: req.params.id }, err => {
      if (err) {
        return res.status(401).json({
          message: "Post notFound"
        });
      }else{
        return res.status(200).json({
          message: "Post Deleted"
        });
      }
    });
  });
}


// Storage Strategy
const storage = multer.diskStorage({
  // Destination
  destination: function(req, file, cb) {
    cb(null, "./upload/");
  },
  // FileName
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  }
});

// Check the File Type
const FileTypeChecker = (file) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png"){
    return true;
  }else{
    return false
  }
}

// Check the File Size
const FileSizeChecker = (file) => {
  if (file.size >= 1024 * 1024 * 5) {
    return false;
  }
}

// Check Title and Body length
const ContentChecker = (title, body) => {
  if (title === 0) {
    return 1;
  }else if (title <= 4) {
    return 2;
  }else if (body === 0) {
    return 3;
  }else if (body <= 10) {
    return 4;
  }
}

// Delete a File
const deleteFile = (path) => {
  fs.unlinkSync(path);
}

// Deploy the file and check the fileSize
const upload = multer({
  storage: storage
});

module.exports = {
  getPost,
  createPost,
  upload,
  userPost,
  deletePost,
  updatePost
};
