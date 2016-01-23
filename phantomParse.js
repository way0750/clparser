var webPage = require('webpage');
var page = webPage.create();

var str = "https://jobs.lever.co/twitch/b70d9cec-5fef-4d40-a77b-a337ad5ba15e";

page.open(str, function (status) {
  console.log(page.plainText);
  phantom.exit();
});
