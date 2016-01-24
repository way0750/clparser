var fileSystem = require('fs');
var coverGenerator = require('./coverGenerator.js');

var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var barePath = '/Users/Way/repos/coverletter/';
var childArgs = [ barePath + 'phantomParse.js' ];

var contentPaths = {
  companyConcerns : './content/companyConcernList.md', 
  myGeneralSkills: './content/companyConcernSentence.md',
  myTechSkills: './content/mytechlist.md',
  techSentences: './content/techSentence.md',
  connectingWords: './content/connectingWords.md'
};

function superlog () {
  var terminalWidth = process.stdout.columns;
  var str = '\n\n\n\n   ' + '_'.repeat(terminalWidth-6) + '   \n';
  var beg1 = ' /' + ' '.repeat(terminalWidth-6) + '\\ \n';
  var beg2 = '/' + ' '.repeat(terminalWidth-4) + '\\\n';
  
  var end1 = '\\' + ' '.repeat(terminalWidth-2) + '/\n';
  var end2 = '\\' + '_'.repeat(terminalWidth-4) + '/\n\n\n\n';
 console.log(str, beg1, beg2);
 console.log.apply(console, arguments);
 console.log(end1, end2);
}


function makeParagrapObj (res, source, mission, lastPara) {
  var beg = new Date();
  var nonTech = coverGenerator.makeSentence(
    [contentPaths.companyConcerns, contentPaths.myTechSkills],
    contentPaths.myGeneralSkills,
    source);

  nonTech = coverGenerator.formatSentence(nonTech);

  nonTech = nonTech.reduce(function (obj, str) {
    var concernAndAnswer = str.split('||');
    obj.companyConcerns.push(concernAndAnswer[0].trim());
    
    var myAnswer = concernAndAnswer[1] ? concernAndAnswer[1] : concernAndAnswer[0];
    obj.myGeneralSkills.push(myAnswer.trim());
    return obj;
  }, {companyConcerns: [], myGeneralSkills: []});

  var companyConcerns = nonTech.companyConcerns;  
  var myGeneralSkills = nonTech.myGeneralSkills;

  var myTechSkills = coverGenerator.makeSentence(
    [contentPaths.myTechSkills],
    contentPaths.techSentences,
    source);
  myTechSkills = coverGenerator.formatSentence(myTechSkills, contentPaths.connectingWords);

  var contentObj = {
    requirement: source,
    excitment: [mission],
    companyConcerns: companyConcerns,
    myGeneralSkills: myGeneralSkills,
    myTechSkills: myTechSkills,
    closingStatement: [lastPara].concat(companyConcerns)
  };
  superlog('time on making sentences:', new Date() - beg);
  res.send(contentObj);
}


function parseByURL (res, source, mission, lastPara, callback) {
  var script = fileSystem.readFileSync(barePath + 'phantomTemplate.js', 'utf8');
  script = script.replace('xxxx', '"' + source + '"');
  fileSystem.writeFileSync(barePath + 'phantomParse.js', script);
  var beg = new Date();
  superlog('this is the requirement:');

  childProcess.execFile(binPath, childArgs, function(err, data, stderr) {
    superlog(data, ' on scraping: ', new Date() - beg);

    callback(res, data, mission, lastPara);
  });
}

function parseJobOpening(req, res, next) {
  var source = req.body.source;
  var mission = 'I am a developer who loves creative problem solving and generating tangible results and @@@@ checkout glassdoor and crunchbase to believe in whatever they do';
  var lastPara = 'I look forward to hear more detail about@@@ challenges and feature they are focusing on right now@@@@@, and show you how I can contribute to their development. ';

  if (req.body.isUrl) {
    parseByURL(res, source, mission, lastPara, makeParagrapObj);
  } else {
    makeParagrapObj(res, source, mission, lastPara);
  }
}

module.exports = {
  parseJobOpening : parseJobOpening
};
