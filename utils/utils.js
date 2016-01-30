var coverGenerator = require('./coverGenerator.js');

var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var barePath = '/Users/Way/repos/coverletter/';
var phantomScript = barePath + 'phantomParse.js';

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

//make the new function to deal with the new coverGeerator
function makeParagrapObj (res, source, mission, lastPara) {
  var companyConcerns = coverGenerator.makePragraph(source);

  console.log(companyConcerns);
  var techSkillOverView = "\nBesides the aforementioned technologies, I am also experienced in: Ruby, MongoDB, Heroku, Mongoose.js, Sequelize —VS— HTML5, CSS3, jQuery, Angular Material. As a curious developer, I am always interested in learning and using new technologies. >>";

  var contentObj = {
    requirement: source,
    excitment: [mission],
    companyConcerns: [companyConcerns, techSkillOverView],
    myGeneralSkills: [],
    myTechSkills: [],
    closingStatement: [lastPara]
  };
  res.send(contentObj);
}

function parseByURL (res, source, mission, lastPara, callback) {
  var beg = new Date();
  superlog('this is the requirement:');

  childProcess.execFile(binPath, [phantomScript, source], function(err, data, stderr) {
    superlog(data, ' on scraping: ', new Date() - beg);

    callback(res, data, mission, lastPara);
  });
}

function parseJobOpening(req, res, next) {
  var source = req.body.source;
  var mission = 'I am a developer who loves creative problem solving and generating tangible results and @@@@ checkout glassdoor and crunchbase to believe in whatever they do';
  var lastPara = 'I look forward to hear more details about the challenges and features you are focusing on right now, and show you how I can contribute to the development of @@@ ';

  if (req.body.isUrl) {
    parseByURL(res, source, mission, lastPara, makeParagrapObj);
  } else {
    makeParagrapObj(res, source, mission, lastPara);
  }
}

module.exports = {
  parseJobOpening : parseJobOpening
};
