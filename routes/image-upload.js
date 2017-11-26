const express   = require('express');
const multer    = require('multer');
const path      = require('path');
const app       = express();

const storage = multer.diskStorage({
    destination: './assets/images',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
  
  // Init Upload
  const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
  }).single('myimage');

// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }

app.get('/', (req, res, next) => {
    res.render('./file-upload/form', {title: 'Image Upload', formName: 'Upload Image (jpeg, jpg, png and gif are allowed).'});
});

app.use(express.static('./assets'));

app.post('/', (req, res) => {
    upload(req, res, (err) => {
        if(err){
          res.send('error')
        } else {
          if(req.file == undefined){
            res.send('errorr');
          } else {
            res.send('done');
          }
        }
    }
);
  });

module.exports = app;