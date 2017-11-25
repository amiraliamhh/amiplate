const express   = require('express');
const multer    = require('multer');
const path      = require('path');
const app       = express();

const storage = multer.diskStorage({
    destination: './assets',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
  
  // Init Upload
  const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
  }).single('myimage');

app.get('/', (req, res, next) => {
    res.render('./file-upload/form', {title: 'File Upload', formName: 'Upload file'});
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