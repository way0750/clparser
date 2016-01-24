(function () {
  angular.module('coverLetter')
  .factory('httpAPI', function ($http) {

    var makeCoverLetter = function (source, isUrl) {
      if (isUrl && !/http/i.test(source.slice(0, 4))){
        source = 'http://' + source;
      }
      return $http({
        method: 'POST',
        url: '/newcover',
        data: {
          isUrl: isUrl,
          source: source
        }
      }).then(function (res) {
        console.log('so what is the new format?:\n', res);
        return res.data;
      });
    };

    var allowToOutputPDF = function (obj) {
      var keys = Object.keys(obj);
      var msg = {};
      msg.permission = keys.every(function (key) {
        var str = obj[key];
        var noContent = str.length === 0;
        var stillNeedToEdit = /@/.test(str);
        if (noContent) {msg.PSA = 'no content in some of the field';}
        if (stillNeedToEdit) {msg.PSA = "you still have some @@@@s";}
        return noContent || stillNeedToEdit ? false : true;
      });
      return msg;
    };


    var outputPDF = function (obj) {
      return $http({
        method: 'POST',
        url: '/pdf',
        data: obj
      }).then(function (data) {
        return 'check your new pdf';
      }).catch(function (err) {
        return 'something bad happened: ' + err;
      });
    };



    return {
      makeCoverLetter: makeCoverLetter,
      allowToOutputPDF: allowToOutputPDF,
      outputPDF: outputPDF
    };

  });  
})();
