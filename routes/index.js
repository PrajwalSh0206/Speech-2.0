var express = require('express');
var router = express.Router();
const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');
const multer=require('multer');
var extract = require('pdf-text-extract')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readdir('./public/audio',(err,files)=>{
    for (const file of files) {
      fs.unlink(path.join('./public/audio', file), err => {
        if (err) throw err;
      });
    }
  })
  fs.readdir('./uploads',(err,files)=>{
    for (const file of files) {
      fs.unlink(path.join('./uploads', file), err => {
        if (err) throw err;
      });
    }
  })
  res.render('index', { title: 'Text/Speech' });
});

router.get('/favicon.ico', function(req, res) { 
  res.sendStatus(204); 
});

router.post('/files',upload.single('file'), function (req, res) {
  console.log(req.file)
  extract('./uploads/'+req.file.filename, { splitPages: false }, function (err, text) {
    if (err) {
      console.dir(err)
      return
    }
    res.json({filetext:text})
  })

})

router.post('/hear', async function (req, res) {
  var gtts = new gTTS(req.body.message, 'en');
  var loc='speech'+ Math.floor(Math.random() * Math.floor(300))

  gtts.save(`./public/audio/${loc}.mp3`, function (err, result) {
    if(err) { 
      throw new Error(err) 
    }
    console.log(loc)
    res.json({data:loc});
  });
})
module.exports = router;
