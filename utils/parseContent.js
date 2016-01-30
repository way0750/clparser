var fileSystem = require('fs');

var parseCatagory = function(str) {
  return str.split(/(?=^#{1,2}[^#])/gm);
};

var removeHash = function (str) {
  return str.replace(/#/g, '');
};

var condenceSpaces = function (str) {
  str = str.trim();
  return str.replace(/\s+/g, ' ');
};

var makeKeyAndSentences = function (path) {
  var rawFile = fileSystem.readFileSync(path, 'utf8');
  var categoryArr = parseCatagory(rawFile);
  return categoryArr.reduce(function (obj, str) {
    str = str.split('\n');
    var title = condenceSpaces(removeHash(str[0]));
    var keywords = condenceSpaces(removeHash(str[1])).split(',');
    keywords = keywords.map(condenceSpaces);
    var sentence = str.slice(2).join('\n').trim();
    var categoryObj = {
      title: title,
      keywords: keywords,
      sentence: sentence
    };
    obj[categoryObj.title] = categoryObj;

    return obj;
  }, {});
};

// console.log(makeKeyAndSentences('../content/reuse.md'));

module.exports = {
  makeKeyAndSentences: makeKeyAndSentences
};
