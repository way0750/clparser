(function () {
  angular.module('coverLetter', [])
  .controller('coverLetterCTRL',function ($scope, $http) {
    $scope.link = undefined;
    $scope.address = "Dear @@@@@ recruitment team:";
    $scope.thankYou = "Thank you very much for your time";
    $scope.myName = "Huiqiang Huang";
    $scope.makeCoverLetter = function (source, isUrl) {
      // if (!/http/i.test(url.slice(0, 4))){
      //   url = 'http://' + url;
      //   console.log(url);
      // }
      $http({
        method: 'POST',
        url: '/newcover',
        data: {
          isUrl: isUrl,
          source: source
        }
      }).then(function (res) {
        console.log('got this as res for parsing:', res.data);
        //$scope.coverLetter = res.data;//it is an array of text
        $scope.coverLetter = res.data.map(function (paragraph) {
          return{text: paragraph};
        });
      });
    };

    var allowToOutputPDF = function (paragraphArr) {
      if (!paragraphArr || paragraphArr.lenght === 0 ) {
        $scope.warning = 'you need to actually write that cover letter!!!';
        console.log('you need to actually write that cover letter!!!');
        return false;
      }

      var completeText = $scope.address + $scope.thankYou + $scope.myName + $scope.coverLetter.join('');
      if (/@/.test(completeText)){
        $scope.warning = '@ found !!!you did not modify all the required part of the letter';
        console.log('@ found !!!you did not modify all the required part of the letter', completeText);
        return false;
      }
      return true;
    };

    $scope.outputPDF = function () {
      var paragraphArr = $scope.coverLetter.map(function (strObj) {
        return strObj.text;
      });
      if (!allowToOutputPDF(paragraphArr)){
        console.log('error!, not allowed to outputPDF!!!');
        return;
      }
      var textObj = {
        address: $scope.address,
        thankYou: $scope.thankYou,
        myName: $scope.myName,
        paragraphs: paragraphArr
      };
      $http({
        method: 'POST',
        url: '/pdf',
        data: textObj
      }).then(function (data) {
        console.log(data);
      });
    };
  });
})();
