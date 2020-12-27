var express = require('express');
var router = express.Router();
const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');
const multer=require('multer');
var extract = require('pdf-text-extract')
const {PythonShell} =require('python-shell'); 


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })

async function clear(){
  if(fs.existsSync('./public/audio'))
 { fs.readdir('./public/audio',(err,files)=>{
    for (const file of files) {
      fs.unlink(path.join('./public/audio', file), err => {
        if (err) throw err;
      });
    }
  })
}else
 {
  fs.mkdirSync('./public/audio')
}
    if(fs.existsSync('./public/uploads'))
  {
    fs.readdir('./public/uploads',(err,files)=>{
    for (const file of files) {
      fs.unlink(path.join('./public/uploads', file), err => {
        if (err) throw err;
      });
    }
  })
  }
  else
  {
  fs.mkdirSync('./public/uploads')
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  clear()
  res.render('index', { title: 'Text/Speech' });
});

router.get('/favicon.ico', function(req, res) { 
  res.sendStatus(204); 
});

router.post('/files',upload.single('file'), function (req, res) {
  extract('./public/uploads/'+req.file.filename, { splitPages: false }, function (err, text) {
    if (err) {
      console.dir(err)
      return
    }
    res.json({filetext:text})
  })

})

router.post('/audio',upload.single('file'), function (req, res) {
  //'./public/audio/'+req.file.filename
  let options = { 
    mode: 'text', 
    pythonOptions: ['-u'], // get print results in real-time 
    scriptPath: './', //If you are having python_test.py script in same folder, then it's optional. 
   args: [req.file.filename] //An argument which can be accessed in the script using sys.argv[1] 
}; 

PythonShell.run('index.py', options, function (err, result){ 
  if (err) throw err; 
  res.json({filetext:result.toString(),audio:req.file.filename})
}); 
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
