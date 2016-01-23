var express = require('express');
var bodyParser = require('body-parser');
var controller = require('./controllers/config.js');
var app = express();

app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/newcover', controller.makeNewCoverLetter);

app.post('/pdf', controller.makePDF);

var port = 3333;
app.listen(port);
console.log('running at port: ', port);
