var webPage = require('webpage');
var page = webPage.create();

var str = "https://www.lyft.com/jobs/front-end-engineer";

page.open(str, function (status) {
  console.log(page.plainText);
  phantom.exit();
});
