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
    res.status(200).json({
      YourPosts: response
    });
  })
    .populate("postedBy", "_id name")
    .sort("created");
}

// Create a new Post
// Params : GET FILE DATA and GET BODY DATA
const createPost = (req, res, next) => {

  // Content Response
  if(req.body.title.length <= 4 || req.body.body.length <= 10){
    if(req.file !== undefined){
      return res.status(400).json({ message: contentResponse(req.body.title.length, req.body.body.length,req.file.path) });
    }else{
      return res.status(400).json({ message: contentResponse_v2(req.body.title.length, req.body.body.length) });
    }
  }
  
  // Check if the File is uploaded or not
  if(req.file === undefined){
    return res.status(400).json({ message: "Please Upload a File" });
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
  post.save().then(result => {
    res.status(200).json({
      post: result
    });
  })
};

// Update Post of current user
// Params : GET FILE DATA and GET BODY DATA and GET USER ID
const updatePost = (req, res, err) => {

  // Content Response
  if(req.body.title.length <= 4 || req.body.body.length <= 10){
    if(req.file !== undefined){
      return res.status(400).json({ message: contentResponse(req.body.title.length, req.body.body.length,req.file.path) });
    }else{
      return res.status(400).json({ message: contentResponse_v2(req.body.title.length, req.body.body.length) });
    }
  }

  // While updating no file changes takes place
  if(req.file === undefined){
    Post.find({ _id: req.params.id }, (err, response) => {
      if (response.length > 0){
        Post.updateOne({ _id: req.params.id },{ title: req.body.title, body: req.body.body },(err, response) => {
            return res
              .status(200)
              .json({ message: "Post Successfully Updated" });
          }
        );
      }else{
        return res
          .status(400)
          .json({ message: "No Post Found" });
      }
    });
    return;
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

  // Delete old photo and update new photo
  Post.find({ _id: req.params.id }, (err, response) => {    
    if (response.length === 1) {
      if (req.file.path !== response[0].photo){
        deleteFile(response[0].photo);
      }else if (req.file.path === response[0].photo){
        deleteFile(response[0].photo);
      }
    }

    // Update the entire post with new Photo
    Post.updateOne({ _id: req.params.id },{ title: req.body.title, body: req.body.body, photo: req.file.path },
      (err, response) => {
        if(response.nModified === 0){
          return res.status(400).json({message: "No Post Found"});
        }else{
          return res.status(200).json({ message: "Post Successfully Updated" });
        }
      }
    );
  });
}

// Delete Post of current user
// Params : GET USER ID
const deletePost = (req, res) => {

  // Checking the post actually exist or not
  Post.find({ _id: req.params.id }, (err, response) => {
    if (err) {
      return res.status(401).json({
        message: "Post notFound"
      });
    }

    // If the post exist then delete 
    // the image related to the post
    if(response.length === 1){
      console.log(response[0].photo);
      if (response[0].photo !== undefined){
       deleteFile(response[0].photo); 
      }
    }else{
      return res.status(401).json({
        message: "Post notFound"
      });
    }
    
    // Deleteing the Post
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
  end(file.mimetype);
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png"){
    return true;
  }else{
    return false
  }
}

// Check the File Size
const FileSizeChecker = (file) => {
  end(file);
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

// Checking Title and body
const contentResponse = (titleLength, bodyLength, filepath) => {
  // Check the length of the title and body
  if (ContentChecker(titleLength, bodyLength) === 1) {
    deleteFile(filepath);
    return "Title Required";
  } else if (ContentChecker(titleLength, bodyLength) === 2) {
    deleteFile(filepath);
    return "Title should be atleast 4 letter";
  }else if (ContentChecker(titleLength, bodyLength) === 3) {
    deleteFile(filepath);
    return "Body Required";
  }else if (ContentChecker(titleLength, bodyLength) === 4) {
    deleteFile(filepath);
    return "Body should be atleast 10 letter";
  }
}

// Checking Title and body
const contentResponse_v2 = (titleLength, bodyLength) => {
  // Check the length of the title and body
  if (ContentChecker(titleLength, bodyLength) === 1) {
    return "Title Required";
  } else if (ContentChecker(titleLength, bodyLength) === 2) {
    return "Title should be atleast 4 letter";
  }else if (ContentChecker(titleLength, bodyLength) === 3) {
    return "Body Required";
  }else if (ContentChecker(titleLength, bodyLength) === 4) {
    return "Body should be atleast 10 letter";
  }
}

// Delete a File
const deleteFile = (path) => {
  end(path);
  fs.unlinkSync(path);
}

// Deploy the file and check the fileSize
const upload = multer({
  storage: storage
});

const end = (data) => {
  if(data === undefined){
    return;
  }
}

module.exports = {
  getPost,
  createPost,
  upload,
  userPost,
  deletePost,
  updatePost
};
