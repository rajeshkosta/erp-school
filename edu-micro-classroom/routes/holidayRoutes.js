const express = require("express");
const router = express.Router();
const { STATUS, logger } = require("edu-micro-common");

let async = require('async');

let holidayModels = require("../models/holidayModels");
let ERRORCODE = require("../constants/ERRORCODE");
const holidayService = require("../services/holidayService");
const { Console } = require("console");

const errorHandler = (res, status, message) => {
    console.error(message);
    res.status(status).send({ error: message });
};


router.post("/createHoliday", async (req, res) => {
    try {
        const reqAdminDetails = req.plainToken;
        const holidays = req.body.holidays;

        if (!holidays || !Array.isArray(holidays)) {
            return errorHandler(res, STATUS.BAD_REQUEST, ERRORCODE.ERROR.HOLIDAY000001);
        }

        let successMessages = [];
        let errorMessages = [];

        for (const holiday of holidays) {
            const { academic_year_id, holiday_date, holiday_name, holiday_description } = holiday;

            const holidayDetails = new holidayModels.Holiday({
                school_id: reqAdminDetails.school_id,
                academic_year_id,
                holiday_date,
                holiday_name,
                holiday_description,
                updated_by: reqAdminDetails.user_id,
                created_by: reqAdminDetails.user_id,
            });

            const { error } = holidayModels.validateHoliday(holidayDetails);
            if (error) {
                errorMessages.push(`Holiday "${holiday_name}" could not be added: ${error.details[0].message}`);
                continue;
            }

            const isHolidayAvailable = await holidayService.checkIfHolidayExists(holidayDetails);
            if (isHolidayAvailable > 0) {
                errorMessages.push(`Holiday "${holiday_name}" already exists.`);
                continue;
            }

            await holidayService.addHoliday(holidayDetails);
            successMessages.push(`Holiday "${holiday_name}" added successfully.`);
        }

        let message = "Holidays created successfully.";
        if (errorMessages.length > 0) {
            message += " Some holidays could not be added.";
        }

        res.status(STATUS.CREATED).json({ message, successMessages, errorMessages });
    } catch (error) {
        logger.error("catch error", error);
        errorHandler(res, STATUS.INTERNAL_SERVER_ERROR, ERRORCODE.ERROR.HOLIDAY000003);
    }
});

// update Holiday api 
router.post("/updateHoliday", async (req, res) => {
    try {
        const reqAdminDetails = req.plainToken;
        const holidays = req.body.holidays;

        if (!holidays || !Array.isArray(holidays)) {
            return errorHandler(res, STATUS.BAD_REQUEST, ERRORCODE.ERROR.HOLIDAY000001);
        }

        for (const holiday of holidays) {
            const { holiday_id, house_id, academic_year_id, holiday_date, holiday_name, holiday_description } = holiday;

            const holidayDetails = new holidayModels.HolidayUpdate({
                holiday_id,
                house_id,
                school_id: reqAdminDetails.school_id,
                academic_year_id,
                holiday_date,
                holiday_name,
                holiday_description,
                updated_by: reqAdminDetails.user_id,
            });

            const { error } = holidayModels.validateUpdateHoliday(holidayDetails);
            if (error) {
                return errorHandler(res, STATUS.BAD_REQUEST, ERRORCODE.ERROR.HOLIDAY000001);
            }

            console.log("message -- ", holidayDetails);
            const isHolidayAvailableForUpdate = await holidayService.checkIfHolidayExistsForUpdate(holidayDetails);

            console.log("isHolidayAvailableForUpdate", isHolidayAvailableForUpdate)

            if (isHolidayAvailableForUpdate == 0) {
                return errorHandler(res, STATUS.BAD_REQUEST, ERRORCODE.ERROR.HOLIDAY000004);
            }

            await holidayService.updateHoliday(holidayDetails);
        }

        res.status(STATUS.CREATED).json({ message: "Holidays updated successfully." });
    } catch (error) {
        logger.error("catch error", error);
        errorHandler(res, STATUS.INTERNAL_SERVER_ERROR, ERRORCODE.ERROR.HOLIDAY000003);
    }
});

router.get("/getAllHoliday", async (req, res) => {
    try {

        const reqUserDetails = req.plainToken;
        const school_id = reqUserDetails.school_id;
        console.log(school_id);
        const holidayDetails = await holidayService.getAllHoliday(school_id);
        return res.status(STATUS.OK).send({ message: "All holiday details", holidayDetails })

    } catch (err) {
        console.error(err);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ errorCode: "HOLIDAY000003", error: ERRORCODE.ERROR.HOLIDAY000003 });
    }
});

router.get("/getHolidayById/:holidayId", async (req, res) => {
    try {
        const holidayId = req.params.holidayId;
        if (isNaN(holidayId)) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "HOLIDAY000005", error: ERRORCODE.ERROR.HOLIDAY000005 });
        }

        const holidayIdExist = await holidayService.checkHolidayIdExists(holidayId);
        if (holidayIdExist == 0) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "HOLIDAY000006", error: ERRORCODE.ERROR.HOLIDAY000006 });
        }

        const holidayDetailsById = await holidayService.getHolidayDetailsIdExists(holidayId);
        return res.status(STATUS.OK).send(holidayDetailsById);

    } catch (err) {
        return res.status(STATUS.BAD_REQUEST).send({ errorCode: "HOLIDAY000003", error: ERRORCODE.ERROR.HOLIDAY000003 });
    }
});


module.exports = router;