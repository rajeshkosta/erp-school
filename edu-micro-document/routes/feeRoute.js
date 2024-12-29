const express = require("express");
const router = express.Router();
const { STATUS } = require("edu-micro-common");
const fs = require('fs');
const ejs = require('ejs');
const { generatePDF } = require('../services/pdfService');
const { getSchoolDetails } = require('../services/schoolService');

router.post('/getInvoice', async (req, res) => {
    try {

        const { school_id } = req.plainToken;
        const schoolDetails = await getSchoolDetails(school_id);
        const ejsData = { ...schoolDetails };
        console.log(ejsData);
        const template = fs.readFileSync('views/pages/invoice.ejs', 'utf8');
        const htmlSource = ejs.render(template, ejsData);
        const pdfOptions = {
            format: 'A4',
            printBackground: true
        }

        const pdf = await generatePDF(htmlSource, pdfOptions)
        const fileName = 'invoice.pdf'

        res.header('Content-type', 'application/pdf');
        res.header('Content-Disposition', `attachment;filename=${fileName}`);
        res.status(STATUS.OK).send(pdf)

    } catch (error) {
        console.error(error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(error.message);
    }
})



module.exports = router;