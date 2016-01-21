(function () {
  angular.module('coverLetter', [])
  .controller('coverLetterCTRL',function ($scope, $http) {
    $scope.link = undefined;
    $scope.address = "Dear @@@@@ recruitment team:";
    $scope.thankYou = "Thank you very much for your time";
    $scope.myName = "Huiqiang Huang";
    $scope.makeCoverLetter = function (source, isUrl) {
      if (!source) {
        $scope.PSA = 'nothing to parse!';
        return;
      }
      if (isUrl && !/http/i.test(source.slice(0, 4))){
        source = 'http://' + source;
      }
      $scope.PSA = 'thinking......';
      $http({
        method: 'POST',
        url: '/newcover',
        data: {
          isUrl: isUrl,
          source: source
        }
      }).then(function (res) {
        $scope.PSA = 'here you go....';
        $scope.coverLetter = res.data.map(function (paragraph) {
          return{text: paragraph};
        });
      });
    };

    var allowToOutputPDF = function (paragraphArr) {
      if (!paragraphArr || paragraphArr.lenght === 0 ) {
        $scope.PSA = 'you need to actually write that cover letter!!!';
        return false;
      }

      var completeText = $scope.address + $scope.thankYou + $scope.myName + $scope.coverLetter.join('');
      if (/@/.test(completeText)){
        $scope.PSA = '@ found !!!you did not modify all the required part of the letter';
        return false;
      }
      return true;
    };

    $scope.outputPDF = function () {
      $scope.coverLetter = $scope.coverLetter || [];
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
      $scope.PSA = 'trying to make that pdf...';
      $http({
        method: 'POST',
        url: '/pdf',
        data: textObj
      }).then(function (data) {
        $scope.PSA = 'pdf done';
      }).catch(function (err) {
        $scope.PSA = 'got error' + err;
      });
    };
  });
})();
