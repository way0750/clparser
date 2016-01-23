var webPage = require('webpage');
var page = webPage.create();

var str = "http://jobs.jobvite.com/careers/square/job/ovAP1fwF";

page.open(str, function (status) {
  console.log(page.plainText);
  phantom.exit();
});
