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

  doc.rect(57, 50, 500, 65);
  doc.fillAndStroke('black', 'black');
  doc.fillColor('white');
  doc.fontSize(30);
  doc.text('< Huiqiang Huang />', headOrFootFormat);

  doc.fontSize(12);
  doc.fillColor('white');
  doc.text('linkedin.com/in/way0750', 100, 65, {align: 'right', link: 'https://www.linkedin.com/in/way0750'});
  doc.text('github.com/way0750', 100, 80, {align: 'right', link: 'https://github.com/way0750'});
  doc.text('way0750huang@gmail.com', 100, 96, {align: 'right', link: 'way0750huang@gmail.com'});

  doc.moveDown(1);
  doc.fillColor('black');
  if (textObj.address) {doc.text(textObj.address, 70, 140, headOrFootFormat);}

  if (textObj.excitment) {doc.text(textObj.excitment, paraFormatObj);}
  if (textObj.skill) {doc.text(textObj.skill, paraFormatObj);}
  if (textObj.closing) {doc.text(textObj.closing, paraFormatObj);}

  if (textObj.thankYou) {doc.text(textObj.thankYou, paraFormatObj);}
  if (textObj.myName) {doc.text(textObj.myName, paraFormatObj);}

  doc.pipe(fileSystem.createWriteStream('./PDF/'+textObj.company+' Cover Letter.pdf'));
  doc.end();
}

module.exports = {
  outputPDF: outputPDF
};
