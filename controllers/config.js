var utils = require('../utils/utils.js');
var pdf = require('../utils/outputPDF.js');

module.exports = {

  makeNewCoverLetter: function (req, res, next) {
    utils.parseJobOpening(req, res, next);
  },

  makePDF: function (req, res, next) {
    pdf.makePDF(req, res, next);
  }

};
