var utils = require('../utils/utils.js');

module.exports = {

  makeNewCoverLetter: function (req, res, next) {
    utils.parseJobOpening(req, res, next);
  },

  makePDF: function (req, res, next) {
    utils.makePDF(req, res, next);
  }

};
