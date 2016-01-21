var fileSystem = require('fs');
var request = require('request');
var PDFDocument = require('pdfkit');

String.prototype.toCap = function () {
  return this[0].toUpperCase() + this.slice(1);
};


var makeMatchingMatrix = function (skillPath, sentencePath, requirementPathOrHTML, isUsingHTML) {
  var sentenceArr = fileSystem.readFileSync(sentencePath, 'utf8').match(/.+/g);
  var mySkillArr = fileSystem.readFileSync(skillPath, 'utf8').toLowerCase().match(/.+/g);
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
      arr.push('@@@@@@@@@@@for ' + techName + ' you still need to write a sentence @@@@@@@@@@@');
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
    if (!/@@@@@@@@@@@/.test(sentence)){
      sentenceArr[index] = connectingWords.shift().toCap() + ', ' + sentence;
    }
  });
  
  var finalSentence = sentenceArr.join(' ').toCap();

  return finalSentence.replace(/\s*\[.+\]\s*/, ' ');
}

function outputPDF (textObj) {
  var doc = new PDFDocument();

  doc.fontSize = 12;
  var paraFormatObj = {
    lineGap: 2,
    paragraphGap: 6,
    indent: 20
  };
  var headOrFootFormat = {
    lineGap: 2,
    paragraphGap: 6
  };

  // doc.text(dear, headOrFootFormat);
  if (textObj.address) {doc.text(textObj.address, headOrFootFormat);}
  for (var i = 0 ; i < textObj.paragraphs.length; i++){
    doc.text(textObj.paragraphs[i], paraFormatObj);
  }
  if (textObj.thankYou) {doc.text(textObj.thankYou, paraFormatObj);}
  if (textObj.myName) {doc.text(textObj.myName, paraFormatObj);}


  // doc.text(thankYou, paraFormatObj);
  // doc.text(myName, paraFormatObj);

  var fileName = (new Date()).toJSON();
  doc.pipe(fileSystem.createWriteStream('./'+fileName+'.pdf'));

  doc.end();
}

var textObj = {
  address: 'Dear Blah Blah Blah Hiring Team:',
  thankYou: 'Thank you for your time',
  myName: 'Huiqiang Huang',
};

var url = process.argv[2];
var finalSentences;
if (url) {
  request(url, function (error, data) {
    finalSentences = selectSentence('./mytechlist.txt', 'sentence.txt', data.body, true);
    textObj.paragraphs = [finalSentences.join(' ')];
    console.log(formatSentence(finalSentences, './connectingWords.txt'));  
    outputPDF(textObj);
  });
} else {
  finalSentences = selectSentence('./mytechlist.txt', 'sentence.txt', './req.txt');
  textObj.paragraphs = [finalSentences.join(' ')];
  console.log(formatSentence(finalSentences, './connectingWords.txt'));  
  outputPDF(textObj);
}
