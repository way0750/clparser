var webPage = require('webpage');
var page = webPage.create();

var str = "http://stackoverflow.com/jobs/106238/software-engineer-conductor-io";

page.open(str, function (status) {
  console.log(page.plainText);
  phantom.exit();
});
