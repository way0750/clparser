var fileSystem = require('fs');
var request = require('request');
var PDFDocument = require('pdfkit');

String.prototype.toCap = function () {
  return this[0].toUpperCase() + this.slice(1);
};

var makeMatchingMatrix = function (skillPathArr, sentencePath, requirement) {
  var sentenceArr = fileSystem.readFileSync(sentencePath, 'utf8').match(/.+/g);
  var mySkillArr = skillPathArr.reduce (function (arr, skillPath) {
    var skillArr = fileSystem.readFileSync(skillPath, 'utf8').toLowerCase().match(/.+/g);
    return arr.concat(skillArr);
  }, []);

  var skillObj = {};
  mySkillArr = mySkillArr.filter(function (skillName) {
    var found = requirement.match(new RegExp('\\b'+skillName, 'ig'));
    if (found) {
      console.log('found this many times:', skillName, found, found.length);
      skillObj[skillName] = {
        sentenceList : [],
        weight: found.length
      };
      return true;
    } else {
      return false;
    }
  });

  var sentenceObj = {};
  sentenceArr.forEach(function (sentence, index) {
    sentence = sentence.replace(/\].+/, "");
    sentenceObj[index] = [];
    mySkillArr.forEach(function (skillName) {
      if (sentence.search(new RegExp('\\b'+skillName, 'i')) > -1) {
        sentenceObj[index].push(skillName);
        skillObj[skillName].sentenceList.push(index);
      }
    });
  });

  mySkillArr = mySkillArr.sort(function (skill1, skill2) {
    return skillObj[skill1].sentenceList.length - skillObj[skill2].sentenceList.length;
  });
  console.log('matched skills:', mySkillArr);
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

Array.prototype.maxBy = function (cb) {
  return this.reduce(function (v1, v2) {
    return cb(v1) > cb(v2) ? v1 : v2;
  });
};

function makeSentence (skillPathArr, sentencePath, requirement, optionObj) {
  var skillObj, sentenceObj, matrix;
  matrix = makeMatchingMatrix(skillPathArr, sentencePath, requirement, optionObj);

  skillObj    = matrix.skillObj;
  mySkillArr  = matrix.skillArr;
  sentenceObj = matrix.sentenceObj;
  sentenceArr = matrix.sentenceArr;

  var sentenceAmountLimit = optionObj && optionObj.limitSentenceAmount;

  //[obj, obj, obj]
  var finalSentences = selectSentence(skillObj , mySkillArr , sentenceObj , sentenceArr, sentenceAmountLimit);

  finalSentences = finalSentences.sort(function (obj1, obj2) {
    return obj2.weight - obj1.weight;
  });

  console.log('weight check: \n', finalSentences);

  finalSentences =  finalSentences.map(function (obj) {
    return obj.sentence;
  });

  return sentenceAmountLimit ? finalSentences.slice(0, sentenceAmountLimit) : finalSentences;

}

function selectSentence (skillObj , mySkillArr , sentenceObj , sentenceArr, sentenceAmountLimit) {

  console.log('\n\n\n-------------------------------\n checking the', sentenceObj, '\n\n');
  return mySkillArr.reduce(function (arr, skillName) {
    if (!skillObj[skillName]) {
      return arr;
    }
    
    var stillExistSentences = skillObj[skillName].sentenceList.filter(function(sentenceID) {
      return sentenceObj[sentenceID];
    });
    
    if (stillExistSentences.length === 0 ) {
      arr.push({
        sentence: '   <<<@@@for ' + skillName + ' you still need to write a sentence @@@>>>   ',
        weight: skillObj[skillName].weight
      });
    } else {
      var sentenceID;
      if (sentenceAmountLimit) {
        sentenceID = stillExistSentences.maxBy(function (id) {
          return sentenceObj[id].length;
        });
      } else {
        sentenceID = random(stillExistSentences);
      }
      var sentence = sentenceArr[sentenceID];

      var dataObj = ({
        sentence: sentence,
        weight: 0
      });

      sentenceObj[sentenceID].forEach(function (skillName) {
        //go through each tech and delete all of its sentenceID from the sentenceObj;
        //then delete itself form the skillObj;
        skillObj[skillName].sentenceList.forEach(function (sentenceID) {
          delete sentenceObj[sentenceID];
        });
        dataObj.weight += skillObj[skillName].weight;
        delete skillObj[skillName];
      });

      arr.push(dataObj);
    }
    return arr;
  }, []);
}

function formatSentence (sentenceArr, connectingWordsPath) {
  var connectingWords;
  var usingConnect = connectingWordsPath;
  if (usingConnect) {
    connectingWords = fileSystem.readFileSync(connectingWordsPath, 'utf8').toLowerCase().match(/.+/g);
  }
  sentenceArr.forEach(function (sentence, index) {
    sentence = sentence.replace(/\s*\[[^\[]+\]\s*/g, ' ');
    if (!/@/.test(sentence)){
      var curConnect = usingConnect ? connectingWords.shift().toCap() + ', ' : '';
      sentenceArr[index] =  curConnect + sentence;
    }
  });

  return sentenceArr;
}

function outputPDF (textObj) {
  var doc = new PDFDocument();
  var paraFormatObj = {
    lineGap: 3,
    paragraphGap: 8,
    indent: 20,
    align: 'left'
  };

  var headOrFootFormat = {
    lineGap: 3,
    paragraphGap: 8
  };

  doc.rect(57, 50, 500, 65);
  doc.fillAndStroke('black', 'black');
  doc.fillColor('white');
  doc.fontSize(30);
  doc.text('< Huiqiang Huang />', headOrFootFormat);

  doc.fontSize(12);
  doc.fillColor('white');
  doc.text('linkedin.com/in/way0750', 100, 65, {align: 'right', link: 'https://www.linkedin.com/in/way0750'});
  doc.text('github.com/way0750', 100, 80, {align: 'right', link: 'https://github.com/way0750'});
  doc.text('way0750huang@gmail.com', 100, 96, {align: 'right', link: 'way0750huang@gmail.com'});

  doc.moveDown(1);
  doc.fillColor('black');
  if (textObj.address) {doc.text(textObj.address, 70, 140, headOrFootFormat);}

  if (textObj.excitment) {doc.text(textObj.excitment, paraFormatObj);}
  if (textObj.skill) {doc.text(textObj.skill, paraFormatObj);}
  if (textObj.closing) {doc.text(textObj.closing, paraFormatObj);}

  if (textObj.thankYou) {doc.text(textObj.thankYou, paraFormatObj);}
  if (textObj.myName) {doc.text(textObj.myName, paraFormatObj);}

  doc.pipe(fileSystem.createWriteStream('./PDF/'+textObj.company+' Cover Letter.pdf'));
  doc.end();
}


module.exports = {
  outputPDF: outputPDF,
  makeSentence: makeSentence,  
  formatSentence: formatSentence
};
