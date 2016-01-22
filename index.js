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
      var mission = 'this is mission';
      // ,'content/mytechlist.txt'
      var techSkills = util.selectSentence(['content/companyConcernList.txt', 'content/mytechlist.txt'], 'content/companyConcernSentence.txt', data.body, {limitSentenceAmount: 3});
      // var techSkills = techSkills.concat(util.selectSentence(['content/mytechlist.txt'], 'content/techSentence.txt', data.body));
      // var techSkills = util.selectSentence(['content/mytechlist.txt'], 'content/techSentence.txt', data.body, {limitSentenceAmount: 1});

      techSkills = util.formatSentence(techSkills, 'content/connectingWords.txt');
      var lastPara = 'this is last';
    
      res.send([mission, techSkills, lastPara]);
    });
  } else {
    var mission = 'this is mission';
    var techSkills = util.selectSentence(['content/companyConcernList.txt','content/mytechlist.txt'], 'content/companyConcernSentence.txt', source, {limitSentenceAmount: 3});
    // techSkills = techSkills.concat(util.selectSentence(['content/mytechlist.txt'], 'content/techSentence.txt', source));
  
    techSkills = util.formatSentence(techSkills, 'content/connectingWords.txt');
    var lastPara = 'this is last';
    res.send([mission, techSkills, lastPara]);
  }
});

app.post('/pdf', function (req, res, next) {

  util.outputPDF(req.body);
  res.send('check local folder');
});

var port = 3333;
app.listen(port);
console.log('running at port: ', port);

