var express = require('express');
var router = express.Router();
const gTTS = require('gtts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Text/Speech' });
});

router.post('/hear', function (req, res) {
  var gtts = new gTTS(req.body.message, 'en');
  var loc='speech'+ Math.floor(Math.random() * Math.floor(300))
  console.log(loc)
  gtts.save(`./public/audio/${loc}.mp3`, function (err, result) {
    if(err) { 
      throw new Error(err) 
    }
    res.json({data:loc});
  });
})
module.exports = router;
