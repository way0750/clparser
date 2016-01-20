var fileSystem = require('fs');
var request = require('request');

String.prototype.toCap = function () {
  return this[0].toUpperCase() + this.slice(1);
};


var makeMatchingMatrix = function (skillPath, sentencePath, requirementPathOrHTML, isUsingHTML) {
  var sentenceArr = fileSystem.readFileSync(sentencePath, 'utf8').match(/.+/g);
  var mySkillArr = fileSystem.readFileSync(skillPath, 'utf8').toLowerCase().match(/\w+/g);
  var requirement;
  if (isUsingHTML) {
    requirement = requirementPathOrHTML;
  } else {
    requirement = fileSystem.readFileSync(requirementPathOrHTML, 'utf8').toLowerCase();
  }
  var skillObj = {};
  mySkillArr = mySkillArr.filter(function (skillName) {
    if (requirement.search(new RegExp(skillName, 'i')) > -1) {
      skillObj[skillName] = [];
      return true;
    } else {
      return false;
    }
  });

  var sentenceObj = {};
  sentenceArr.forEach(function (sentence, index) {
    sentenceObj[index] = [];
    mySkillArr.forEach(function (skillName) {
      if (sentence.search(new RegExp(skillName, 'i')) > -1) {
        sentenceObj[index].push(skillName);
        skillObj[skillName].push(index);
      }
    });
  });

  mySkillArr = mySkillArr.sort(function (skill1, skill2) {
    return skillObj[skill1].length - skillObj[skill2].length;
  });


  return {
    skillObj: skillObj,
    skillArr: mySkillArr,
    sentenceObj: sentenceObj,
    sentenceArr: sentenceArr
  };
};

function random (arr) {
  var index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

function selectSentence (skillPath, sentencePath, requirementPathOrHTML, isUsingHTML) {
  var techObj, sentenceObj, matrix;
  matrix = makeMatchingMatrix(skillPath, sentencePath, requirementPathOrHTML, isUsingHTML);

  techObj     = matrix.skillObj;
  myTechList  = matrix.skillArr;
  sentenceObj = matrix.sentenceObj;
  sentenceArr = matrix.sentenceArr;
  
  var finalSentences = myTechList.reduce(function (arr, techName) {
    if (!techObj[techName]) {
      return arr;
    }

    var stillExistSentences = techObj[techName].filter(function(sentenceID) {
      return sentenceObj[sentenceID];
    });
    
    if (stillExistSentences.length === 0 ) {
      arr.push('\n\n\t!!!!!for ' + techName + ' you still need to write a sentence@@@@@@@@@@@@@@@@@@@@@@@@@\n\n');
    } else {
      var randomSentenceID = random(stillExistSentences);
      var sentence = sentenceArr[randomSentenceID];
      arr.push(sentence);

      sentenceObj[randomSentenceID].forEach(function (techName) {
        //go through each tech and delete all of its sentenceID from the sentenceObj;
        //then delete itself form the techObj;
        techObj[techName].forEach(function (sentenceID) {
          delete sentenceObj[sentenceID];
        });
        delete techObj[techName];
      });
    }

    return arr;

  }, []);

  return finalSentences;

}

function formatSentence (sentenceArr, connectingWordsPath) {

  var connectingWords = fileSystem.readFileSync(connectingWordsPath, 'utf8').toLowerCase().match(/.+/g);
  sentenceArr.forEach(function (sentence, index) {
    sentenceArr[index] = connectingWords[index].toCap() + ', ' + sentence;
  });
  return sentenceArr.join(' ').toCap();
}

var url = process.argv[2];

if (url) {
  request(url, function (error, data) {
    var finalSentences = selectSentence('./mytechlist.txt', 'sentence.txt', data.body, true);
    console.log(formatSentence(finalSentences, './connectingWords.txt'));  
  });
} else {
  var finalSentences = selectSentence('./mytechlist.txt', 'sentence.txt', './req.txt');
  console.log(formatSentence(finalSentences, './connectingWords.txt'));  
}
