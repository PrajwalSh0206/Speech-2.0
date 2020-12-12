var express = require('express');
var router = express.Router();
const gTTS = require('gtts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hear', function (req, res) {
var gtts = new gTTS('text to speak', 'en');
gtts.save('/tmp/hello.mp3', function (err, result) {
  if(err) { throw new Error(err) }
  console.log('Success! Open file /tmp/hello.mp3 to hear result.');
});
})
module.exports = router;
