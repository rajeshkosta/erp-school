const express = require("express");
const router = express.Router();
const { STATUS } = require("edu-micro-common");
const puppeteer = require('puppeteer');
const fs = require('fs');
const ejs = require('ejs');


router.get('/health', async (req, res) => {
    try {
        return res.status(STATUS.OK).send("Document Service is Healthy");
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

router.get('/createPDF', async (req, res) => {

    try {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const template = fs.readFileSync('views/pages/invoice.ejs', 'utf8');
        const html = ejs.render(template, { facilityName: "Tima Hospital"});
        await page.setContent(html);

        // const website_url = 'https://www.bannerbear.com/blog/how-to-download-images-from-a-website-using-puppeteer/';
        // await page.goto(website_url, { waitUntil: 'networkidle0' });
        await page.emulateMediaType('screen');

        const pdf = await page.pdf({
            //path: 'result.pdf',
            format: 'A4',
            printBackground: true,
            //margin: "none",
            // width: '16.4in',
             //height: '7.7in',
            //landscape: true,
            // margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
            // landscape: true,
            // displayHeaderFooter: true,
            // headerTemplate: '<div style="font-size: 10px; text-align: center;">Header</div>',
            // footerTemplate: '<div style="font-size: 10px; text-align: center;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
            // printBackground: true,
            // pageRanges: '1-5, 8, 11',
            //preferCSSPageSize: true,

        });

        await browser.close();

        res.header('Content-type', 'application/pdf');
        res.header('Content-Disposition', `attachment;filename=report_card.pdf`);
        res.status(STATUS.OK).send(pdf)

    } catch (error) {
        console.error(error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(error.message);
    }
})



module.exports = router;