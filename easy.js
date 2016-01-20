var fileSystem = require('fs');
var requirement = fileSystem.readFileSync('./req.txt', 'utf8').toLowerCase();

var connectingWords = fileSystem.readFileSync('./connectingWords.txt', 'utf8').toLowerCase().match(/.+/g);

var myTechList = fileSystem.readFileSync('./mytechlist.txt', 'utf8').toLowerCase().match(/\w+/g);

var sentenceArr = fileSystem.readFileSync('./sentence.txt', 'utf8').match(/.+/g);


var techObj = {};

myTechList = myTechList.filter(function (techName) {
  if (requirement.search(techName) > -1) {
    techObj[techName] = [];
    return true;
  } else {
    return false;
  }
});

var sentenceObj = {};
sentenceArr.forEach(function (sentence, index) {
  sentenceObj[index] = [];
  myTechList.forEach(function (techName) {
    if (sentence.search(new RegExp(techName, 'i')) > -1) {
      matchingSentence = true;
      sentenceObj[index].push(techName);
      techObj[techName].push(index);
    }
  });
});


var myTechList = myTechList.sort(function (tech1, tech2) {
  return techObj[tech1].length - techObj[tech2].length;
});

function random (arr) {
  var index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

var finalSentences = myTechList.reduce(function (arr, techName) {
  if (!techObj[techName]) {
    return arr;
  }

  var stillExistSentences = techObj[techName].filter(function(sentenceID) {
    return sentenceObj[sentenceID];
  });
  
  if (stillExistSentences.length === 0 ) {
    arr.push('for ' + techName + ' you still need to write a sentence@@@@@@@@@@@@@@@@@@@@@@@@@');
    return arr;
  }
  
  var randomSentenceID = random(stillExistSentences);

  arr.push(sentenceArr[randomSentenceID]);

  sentenceObj[randomSentenceID].forEach(function (techName) {
    //go through each tech and delete all of its sentenceID from the sentenceObj;
    //then delete itself form the techObj;
    techObj[techName].forEach(function (sentenceID) {
      delete sentenceObj[sentenceID];
    });
    delete techObj[techName];
  });

  return arr;

}, []);

String.prototype.toCap = function () {
  return this[0].toUpperCase() + this.slice(1);
};

finalSentences.slice(1).forEach(function (sentence, index) {
  finalSentences[index+1] = connectingWords[index].toCap() + ', ' + sentence;
});

console.log(finalSentences.join(' ').toCap());
