var webPage = require('webpage');
var page = webPage.create();

var str = "https://slack.com/jobs/69907/application-engineer";

page.open(str, function (status) {
  console.log(page.plainText);
  phantom.exit();
});
