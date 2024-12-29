const express = require("express");
const router = express.Router();
const Joi = require("joi");
let ERRORCODE = require("../constants/ERRORCODE");
const { pg, logger, queryUtility, STATUS } = require("edu-micro-common");
const contactFormService = require("../services/contactFormService");
const { validateContactFormSchema } = require("../models/contactFormModels");


//create contact form 

router.post("/createContact", async (req, res) => {
    try {

        const api_key = req.headers["x-api-key"];
        console.log(req.headers)
        if (!api_key) {
            return res.status(STATUS.BAD_REQUEST).send('x-api-key is required');
        }

        const contactFormDetails = req.body;
        // const { error } = validateContactFormSchema(contactFormDetails);
        // if (error) {
        //     return res.status(STATUS.BAD_REQUEST).json({ errorCode: "CONTFORM000001", error: ERRORCODE.ERROR.CONTFORM000001 });
        // }
        const checkAccessKeyExist = await contactFormService.checkAccessKey(api_key);
        if (checkAccessKeyExist[0].count > 0) {

            const schoolDetails = await contactFormService.getSchoolAccessDetails(api_key);
            if(schoolDetails){
                contactFormDetails.school_id=schoolDetails[0].school_id;
                const ContactForm = await contactFormService.addContactForm(contactFormDetails);
                res.status(STATUS.CREATED).json({ message: "Contact saved successfully ", contact_id: ContactForm[0].contact_id });        
            }
           
        }
        else{         
            console.log('no api key found for the school')
            res.status(STATUS.UNAUTHORIZED).send({
                message: "Unauthenticated access!"
            });
        }       
    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal server error');
    }
});


//get all 

router.post("/getAllContact", async (req, res) => {
    try {
        const school_id = req.body.school_id;
        const pageSize = req.body.page_size ? req.body.page_size : 50;
        const search = req.body.search ? req.body.search : null;
        let currentPage = req.body.current_page ? req.body.current_page : 0;
        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);
        const reqParams = {
            pageSize,
            currentPage,
            school_id,
            search
        };

        const ContactFormList = await contactFormService.getAllContactFormList(reqParams);
        res.status(STATUS.OK).send(ContactFormList);
        return;
    } catch (error) {
        logger.error(error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal server error');
    }

});

//GET BY ID 

router.get("/getContactDetailsById/:contact_id", async (req, res) => {
    try {
        const contact_id = parseInt(req.params.contact_id);
        console.log("contact id ...", contact_id);
        const checkContactId = await contactFormService.checkContactIdQuery(contact_id);
        if (checkContactId == 0) {
            return res.status(STATUS.BAD_REQUEST).json({ errorCode: "CONTFORM000002", error: ERRORCODE.ERROR.CONTFORM000002 });
        }
        const getContactId = await contactFormService.getContactFormByIdQuery(contact_id);
        res.status(STATUS.OK).send(getContactId);
        return;
    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json('Internal server error');
    }
});

module.exports = router;
