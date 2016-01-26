var webPage = require('webpage');
var page = webPage.create();

var url = (require('system')).args[1];

page.open(url, function (status) {
  console.log(page.plainText);
  phantom.exit();
});
