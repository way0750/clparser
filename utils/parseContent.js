var fileSystem = require('fs');

var parseCatagory = function(str) {
  return str.split(/(?=^#{1,2}[^#])/gm);
};

var parseSentences = function (path) {
  var rawFile = fileSystem.readFileSync(path, 'utf8');
  var categoryArr = parseCatagory(rawFile);
  var keyWordAndSentences = categoryArr.reduce(function (arr, cataStr) {
    cataStr = cataStr.split(/(?=#{3,})/);
    //only keep the lines with ### or more in front or none at all.
    cataStr = cataStr.filter(function (str) {
      return /^[^#]|^#{3,}/.test(str.trim());
    });
    return arr.concat(cataStr);
  }, []);

  keyWordAndSentences = keyWordAndSentences.reduce(function (arr, setStr) {
    var lines = setStr.split('\n');
    var keySentenceObj = lines.reduce(function (obj, str) {
      str = str.trim();
      if (/^#/.test(str)){
        obj.keyword = str;
      } else if (/^\w/.test(str)){
        obj.sentence.push(str);
      }
      return obj;
    }, {keyword: '', sentence: []});

    var keyedSentenceArr = keySentenceObj.sentence.map(function (str) {
      return '[ '+ keySentenceObj.keyword +' ] ' + str;
    });

    return arr.concat(keyedSentenceArr);

  }, []);

  return keyWordAndSentences;

};

var parseTerms = function (path) {
  return fileSystem.readFileSync(path, 'utf8').match(/.+/g);
};

module.exports = {
  parseSentences: parseSentences,
  parseTerms: parseTerms
};
