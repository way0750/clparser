(function () {
  angular.module('coverLetter', ['ngMaterial'])
  .controller('coverLetterCTRL',function ($scope, httpAPI, contentFormatter) {

    $scope.coverLetter = {
      company:  '@@@@@',
      thankYou: "Thank you very much for your time",
      myName: "Huiqiang Huang"
    };

    $scope.makeCoverLetter = function (source, isUrl) {
      if (!source) {
        $scope.PSA = 'nothing to parse!';
        return;
      }
      if (isUrl && !/http/i.test(source.slice(0, 4))){
        source = 'http://' + source;
      }
      $scope.PSA = 'thinking......';

      httpAPI.makeCoverLetter(source, isUrl).then(function (data) {
        $scope.PSA = 'here you go....';
        console.log('so what is the new format?:\n', data);
        $scope.coverLetter.excitment = contentFormatter.formatSkills(data.excitment);
        $scope.coverLetter.closing = contentFormatter.formatSkills(data.closingStatement);
        $scope.coverLetter.skill = contentFormatter.formatSkills(data.companyConcerns, data.myGeneralSkills, data.myTechSkills);
      });
      
    };


    $scope.outputPDF = function (obj) {
      var allowToOutputPDF = httpAPI.allowToOutputPDF(obj);
      if (!allowToOutputPDF.permission){
        $scope.PSA = allowToOutputPDF.PSA;
        return;
      }

      contentFormatter.capitalizeSentences(obj);
      obj.company = contentFormatter.capitalizeEveryWord(obj.company);
      contentFormatter.fixAddressAddCompanyName('Dear', obj, 'Recruitment Team:');

      httpAPI.outputPDF(obj).then(function (data) {
        $scope.PSA=data;
      });

    };

  });
})();
