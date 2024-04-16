var express = require('express');
var cors = require('cors');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
require('dotenv').config();

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// Multer configuration
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var uploadPath = path.join(process.cwd(), '/public/uploads');
    fs.mkdir(uploadPath, { recursive: true }, function (err) {
      if (err) {
        console.log('Error creating uploads directory: ' + err);
      }
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// File upload route
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  if (!req.file) {
    return res.json({ error: 'No file selected' });
  }

  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});