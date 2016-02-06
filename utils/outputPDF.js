var fileSystem = require('fs');
var PDFDocument = require('pdfkit');

function outputPDF (textObj) {
  var doc = new PDFDocument();
  var paraFormatObj = {
    lineGap: 3,
    paragraphGap: 8,
    indent: 20,
    align: 'left'
  };

  var headOrFootFormat = {
    lineGap: 3,
    paragraphGap: 8
  };

  doc.rect(57, 50, 500, 87);
  doc.fillAndStroke('black', 'black');
  doc.fillColor('white');
  doc.fontSize(30);
  doc.text('< Huiqiang Huang />', headOrFootFormat);

  doc.fontSize(12);
  doc.fillColor('white');
  doc.text('linkedin.com/in/way0750', 100, 65, {align: 'right', link: 'https://www.linkedin.com/in/way0750'});
  doc.text('github.com/way0750', 100, 80, {align: 'right', link: 'https://github.com/way0750'});
  doc.text('angel.co/way0750', 100, 96, {align: 'right', link: 'https://angel.co/way0750'});
  doc.text('way0750huang@gmail.com', 100, 111, {align: 'right', link: 'way0750huang@gmail.com'});

  doc.fillColor('transparent');
  doc.text('https://www.linkedin.com/in/way0750.', 266.7, 191.7, {align: 'left', link: 'https://www.linkedin.com/in/way0750'});

  doc.moveDown(1);
  doc.fillColor('black');
  doc.text(textObj.address, 70, 150, headOrFootFormat);
  doc.text(textObj.excitment, paraFormatObj);
  doc.text(textObj.skill, paraFormatObj);
  doc.text(textObj.closing, paraFormatObj);
  doc.text(textObj.thankYou, paraFormatObj);
  doc.text(textObj.myName, paraFormatObj);

  doc.pipe(fileSystem.createWriteStream('./PDF/'+textObj.company+' Cover Letter.pdf'));
  doc.end();
}

function makePDF (req, res, next) {
  outputPDF(req.body);
  res.send('check local folder');
}

module.exports = {
  makePDF: makePDF
};
