(function () {
  angular.module('coverLetter')
  .factory('contentFormatter', function () {

    String.prototype.toCap = function () {
      return this[0].toUpperCase() + this.slice(1);
    };

    var formatSkills = function () {
      var arr = Array.apply(null, arguments);
      arr = arr.reduce(function (mainArr, arr) {
        return mainArr.concat(arr);
      }, []);
      return arr.map(function (str) {
        return str.toCap();
      }).join(' ');
    };

    var capitalizeSentences = function (obj) {
      var keys = Object.keys(obj);
      keys.forEach(function (key) {
        obj[key] = obj[key].toCap();
      });
    };

    var capitalizeEveryWord = function (str) {
      return str.replace(/\b\w/g, function (match) {
        return match.toCap();
      });
    };

    var fixAddressAddCompanyName = function (left, obj, right) {
      obj.address = left + ' ' + obj.company + ' ' + right;
    };

    return {
      capitalizeEveryWord: capitalizeEveryWord,
      fixAddressAddCompanyName: fixAddressAddCompanyName,
      formatSkills: formatSkills,
      capitalizeSentences: capitalizeSentences
    };
  });
})();
