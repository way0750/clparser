(function () {
  angular.module('coverLetter')
  .factory('PSA', function () {
    var safeColor = 'green';
    var warnning = 'red';

    var psaObj = {
      msg : "",
      color: 'green'
    };

    var safeAnnouncement = function (msg) {
      psaObj.msg = msg;
      psaObj.color = safeColor;
    };

    var badNews = function (msg) {
      psaObj.msg = msg;
      psaObj.color = warnning;
    };

    return {
      psaObj: psaObj,
      safeAnnouncement: safeAnnouncement,
      badNews: badNews
    };

  });
})();
