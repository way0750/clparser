(function () {
  angular.module('coverLetter', ['ngMaterial'])
  .controller('coverLetterCTRL',function ($scope, httpAPI, contentFormatter, PSA) {

    $scope.PSA = PSA.psaObj;

    PSA.safeAnnouncement('job search diesel: 6 digits here we go!!!!');

    $scope.coverLetter = {
      company:  '@@@@@',
      thankYou: "Thank you very much for your time.\n",
      myName: "Huiqiang Huang"
    };

    $scope.makeCoverLetter = function (source, isUrl) {
      if (!source) {
        PSA.badNews('nothing to parse!');
        return;
      }

      if (isUrl && !/http/i.test(source.slice(0, 4))){
        source = 'http://' + source;
      }

      PSA.inProgress('thinking......');

      httpAPI.makeCoverLetter(source, isUrl).then(function (data) {
        PSA.safeAnnouncement('here you go....');
        
        if (isUrl) {
          $scope.coverLetter.company = '@@@@@';
        }
        $scope.coverLetter.requirement = data.requirement;
        $scope.coverLetter.excitment = contentFormatter.formatSkills(data.excitment);
        $scope.coverLetter.closing = contentFormatter.formatSkills(data.closingStatement);
        $scope.coverLetter.skill = contentFormatter.formatSkills(data.companyConcerns, data.myGeneralSkills, data.myTechSkills);
      });
    };

    $scope.remakeCoverLetter = function (requirement) {
      $scope.makeCoverLetter(requirement, false);
    };

    $scope.outputPDF = function (obj) {
      var allowToOutputPDF = httpAPI.allowToOutputPDF({
        company: obj.company,
        thankYou: obj.thankYou,
        myName: obj.myName,
        excitment: obj.excitment,
        closing: obj.closing,
        skill: obj.skill
      });
      if (!allowToOutputPDF.permission){
        PSA.badNews(allowToOutputPDF.PSA);
        return;
      }

      contentFormatter.capitalizeSentences(obj);
      obj.company = contentFormatter.capitalizeEveryWord(obj.company);
      contentFormatter.fixAddressAddCompanyName('Dear', obj, 'Recruitment Team:');

      httpAPI.outputPDF(obj).then(function (data) {
        PSA.safeAnnouncement(data);
      });

    };

  });
})();
