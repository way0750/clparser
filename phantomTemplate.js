var webPage = require('webpage');
var page = webPage.create();

var str = xxxx;

page.open(str, function (status) {
  console.log(page.plainText);
  phantom.exit();
});
