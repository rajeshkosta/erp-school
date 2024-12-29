const puppeteer = require('puppeteer');

const generatePDF = async (htmlSource, pdfOptions) => {

    const browser = await puppeteer.launch();

    try {

        const page = await browser.newPage();
        await page.setContent(htmlSource);
        await page.emulateMediaType('screen');
        const pdf = await page.pdf(pdfOptions);
        await browser.close();
        return pdf;

    } catch (error) {
        console.error('Generate PDF Error:', error);
        throw error;
    }
}


module.exports = {
    generatePDF
}