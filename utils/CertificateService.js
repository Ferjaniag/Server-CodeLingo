// CertificateService.js
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const generateCertificate = (userName, quizName) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const fileName = `certificate_${userName}_${quizName}.pdf`;
            const filePath = path.join(__dirname, '../certificates', fileName);

            doc.pipe(fs.createWriteStream(filePath));

            // Add certificate content
            doc.fontSize(24).text("Certificate of Completion", { align: 'center' });
            doc.moveDown();
            doc.fontSize(18).text(`This certifies that`, { align: 'center' });
            doc.moveDown();
            doc.fontSize(22).text(`${userName}`, { align: 'center', bold: true });
            doc.moveDown();
            doc.fontSize(18).text(`has successfully completed the quiz`, { align: 'center' });
            doc.fontSize(20).text(`${quizName}`, { align: 'center' });
            doc.moveDown(2);
            doc.fontSize(16).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

            doc.end();

            resolve(filePath);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateCertificate };
