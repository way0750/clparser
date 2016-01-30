//makeKeyAndSentences
//makeKeyAndSentences('../content/reuse.md')
var parseContent = require('./parseContent.js');
// '../content/reuse.md'

String.prototype.toCap = function () {
  return this[0].toUpperCase() + this.slice(1);
};


var pickKeywords = function (str, skillArr) {
  return skillArr.filter(function (skillStr) {
    return (new RegExp(skillStr, 'i')).test(str);
  });
};

var lineUpSentences = function (obj) {
  var sentence = obj.concerns + (obj['front end'] || '') + obj['back end'];
  return sentence;
};

var makePragraph = function (requirement) {
  var skillObj = parseContent.makeKeyAndSentences('./content/reuse.md');
  var paragraphObj = {};
  for (var title in skillObj) {
    var foundKeywords = pickKeywords(requirement.toLowerCase(), skillObj[title].keywords);
    if (foundKeywords.length) {
      paragraphObj[title] = skillObj[title].sentence + ' [ ' + foundKeywords.join(', ') + ' ]\n\n\n';
    }
  }
  
  paragraphObj.isFullStack = Object.keys(paragraphObj).length > 2;

  return lineUpSentences(paragraphObj);
};

module.exports = {
  makePragraph: makePragraph
};
