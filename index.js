// var request = require('request');
var fileSystem = require('fs');
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;

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
    // request(source, function (error, data) {
    //   console.log(data.body);
      // var mission = 'this is mission';
      // // ,'content/mytechlist.txt'
      // // data = data.body.replace(/<[^<]+>/ig, '');
      // // console.log(data.body.replace(/<[^<]+>/ig, ''));
      // var techSkills = util.selectSentence(['content/companyConcernList.txt', 'content/mytechlist.txt'], 'content/companyConcernSentence.txt', data.body, {limitSentenceAmount: 3});
      // // var techSkills = techSkills.concat(util.selectSentence(['content/mytechlist.txt'], 'content/techSentence.txt', data.body));
      // // var techSkills = util.selectSentence(['content/mytechlist.txt'], 'content/techSentence.txt', data.body, {limitSentenceAmount: 1});

      // techSkills = util.formatSentence(techSkills, 'content/connectingWords.txt');
      // var lastPara = 'this is last';

      // res.send([mission, techSkills, lastPara]);
    // });

    var barePath = '/Users/Way/repos/coverletter/';
    var script = fileSystem.readFileSync(barePath + 'phantomTemplate.js', 'utf8');
    script = script.replace('xxxx', '"' + source + '"');
    fileSystem.writeFileSync(barePath + 'phantomParse.js', script);

    var childArgs = [
      barePath + 'phantomParse.js'
    ];

    childProcess.execFile(binPath, childArgs, function(err, data, stderr) {

      console.log(data);

      var mission = 'this is mission';
      var techSkills = util.selectSentence(['content/companyConcernList.txt', 'content/mytechlist.txt'], 'content/companyConcernSentence.txt', data, {limitSentenceAmount: 3});
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

