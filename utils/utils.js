var fileSystem = require('fs');
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var barePath = '/Users/Way/repos/coverletter/';
var childArgs = [ barePath + 'phantomParse.js' ];
var coverLetter = require('./easy.js');

var contentPaths = {
  companyConcerns : './content/companyConcernList.txt', 
  myGeneralSkills: './content/companyConcernSentence.txt',
  myTechSkills: './content/mytechlist.txt',
  techSentences: './content/techSentence.txt',
  connectingWords: './content/connectingWords.txt'
};

function makeSentence (res, source, mission, lastPara) {
  var nonTech = coverLetter.makeSentence(
    [contentPaths.companyConcerns, contentPaths.myTechSkills],
    contentPaths.myGeneralSkills,
    source);

  nonTech = coverLetter.formatSentence(nonTech);

  nonTech = nonTech.reduce(function (obj, str) {
    var concernAndAnswer = str.split('||');
    obj.companyConcerns.push(concernAndAnswer[0].trim() + ' ');
    
    var myAnswer = concernAndAnswer[1] ? concernAndAnswer[1] : concernAndAnswer[0];
    obj.myGeneralSkills.push(myAnswer.trim() + ' ');
    return obj;
  }, {companyConcerns: [], myGeneralSkills: []});

  var companyConcerns = nonTech.companyConcerns;  
  var myGeneralSkills = nonTech.myGeneralSkills;


  var myTechSkills = coverLetter.makeSentence(
    [contentPaths.myTechSkills],
    contentPaths.techSentences,
    source);
  myTechSkills = coverLetter.formatSentence(myTechSkills);

  var contentObj = {
    excitment: [mission],
    companyConcerns: companyConcerns,
    myGeneralSkills: myGeneralSkills,
    myTechSkills: myTechSkills,
    closingStatement: [lastPara]
  };
  console.log('--------sending this:\n\n\n', contentObj);
  res.send(contentObj);
}

function parseByURL (res, source, mission, lastPara, callback) {
  var script = fileSystem.readFileSync(barePath + 'phantomTemplate.js', 'utf8');
  script = script.replace('xxxx', '"' + source + '"');
  fileSystem.writeFileSync(barePath + 'phantomParse.js', script);

  childProcess.execFile(binPath, childArgs, function(err, data, stderr) {
    console.log(data);
    callback(res, data, mission, lastPara);
  });
}

function parseJobOpening(req, res, next) {
  var source = req.body.source;
  var mission = 'this is mission';
  var lastPara = 'this is last';

  if (req.body.isUrl) {
    parseByURL(res, source, mission, lastPara, makeSentence);
  } else {
    makeSentence(res, source, mission, lastPara);
  }
}

function makePDF (req, res, next) {
  coverLetter.outputPDF(req.body);
  res.send('check local folder');
}

module.exports = {
  parseJobOpening : parseJobOpening,
  makePDF : makePDF
};
