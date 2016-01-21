var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var util = require('./easy.js');
var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function (req, res, next) {
  res.send();
});

app.post('/newcover', function (req, res, next) {
  var source = req.body.source;
  if (req.body.isUrl) {
    request(source, function (error, data) {
      var firstPara = 'this is firstPara';
      var secondPara = 'this is secondPara';
      var techSkills = util.selectSentence('mytechlist.txt', 'sentence.txt', data.body);
      techSkills = util.formatSentence(techSkills, 'connectingWords.txt');
      res.send([firstPara, secondPara, techSkills]);
    });
  } else {
    var firstPara = 'this is firstPara';
    var secondPara = 'this is secondPara';
    var techSkills = util.selectSentence('mytechlist.txt', 'sentence.txt', source);
    techSkills = util.formatSentence(techSkills, 'connectingWords.txt');
    res.send([firstPara, secondPara, techSkills]);
  }
});

app.post('/pdf', function (req, res, next) {
  console.log(req.body);
  util.outputPDF(req.body);
  res.send('check local folder');
});

var port = 3333;
app.listen(port);
console.log('running at port: ', port);

