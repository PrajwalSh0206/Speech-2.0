var express = require('express');
var router = express.Router();
const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PythonShell } = require('python-shell');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

async function clear() {
  //Create Audio Folder
  if (fs.existsSync('./public/audio')) {
    fs.readdir('./public/audio', (err, files) => {
      for (const file of files) {
        fs.unlink(path.join('./public/audio', file), err => {
          if (err) throw err;
        });
      }
    })
  } else {
    fs.mkdirSync('./public/audio')
  }

  //Create Upload Folder
  if (fs.existsSync('./public/uploads')) {
    fs.readdir('./public/uploads', (err, files) => {
      for (const file of files) {
        fs.unlink(path.join('./public/uploads', file), err => {
          if (err) throw err;
        });
      }
    })
  }
  else {
    fs.mkdirSync('./public/uploads')
  }

  //Create Image Folder
  if (fs.existsSync('./public/images')) {
    fs.readdir('./public/images', (err, files) => {
      for (const file of files) {
        fs.unlink(path.join('./public/images', file), err => {
          if (err) throw err;
        });
      }
    })
  }
  else {
    fs.mkdirSync('./public/images')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  clear()
  res.render('index', { title: 'Text/Speech' });
});

router.get('/favicon.ico', function (req, res) {
  res.sendStatus(204);
});

router.post('/files', upload.single('file'), function (req, res) {
  let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time 
    scriptPath: './', //If you are having python_test.py script in same folder, then it's optional. 
    args: [req.file.filename] //An argument which can be accessed in the script using sys.argv[1] 
  };

  PythonShell.run('pdf.py', options, function (err, result) {
    if (err) throw err;
    console.log(JSON.parse(result));
    res.json({ filetext: JSON.parse(result) })
  });
})

router.post('/audio', upload.single('file'), function (req, res) {
  //'./public/audio/'+req.file.filename
  let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time 
    scriptPath: './', //If you are having python_test.py script in same folder, then it's optional. 
    args: [req.file.filename] //An argument which can be accessed in the script using sys.argv[1] 
  };

  PythonShell.run('index.py', options, function (err, result) {
    if (err) throw err;
    res.json({ filetext: result.toString(), audio: req.file.filename })
  });
})

router.post('/hear', async function (req, res) {
  var gtts = new gTTS(req.body.message, 'en');
  var loc = 'speech' + Math.floor(Math.random() * Math.floor(300))
  gtts.save(`./public/audio/${loc}.mp3`, function (err, result) {
    if (err) {
      throw new Error(err)
    }
    console.log(loc)
    res.json({ data: loc });
  });
})


module.exports = router;
