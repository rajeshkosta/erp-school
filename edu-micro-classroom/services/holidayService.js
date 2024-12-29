const { pg } = require("edu-micro-common");
const QUERY = require('../constants/QUERY');


const checkIfHolidayExists = async (holidayDetails) => {
    try {
        const { school_id, holiday_name, academic_year_id, holiday_date } = holidayDetails;
        const query = {
            text: QUERY.HOLIDAY.getHolidayDetails,
            values: [school_id, holiday_name, academic_year_id, holiday_date],
        };
        const queryResult = await pg.executeQueryPromise(query);
        return queryResult[0].count;
    } catch (error) {
        console.error("Error in checkIfHolidayExists:", error);
        throw new Error(error.message);
    }
};

const addHoliday = async (holidayDetails) => {
    try {
        const query = {
            text: QUERY.HOLIDAY.addHolidayQuery,
            values: [holidayDetails.school_id,
            holidayDetails.holiday_name,
            holidayDetails.holiday_description,
            holidayDetails.academic_year_id,
            holidayDetails.holiday_date,
            holidayDetails.created_by,
            holidayDetails.updated_by],
        };

        const queryResult = await pg.executeQueryPromise(query);
        return queryResult;
    } catch (error) {
        console.error("Error in Holiday details:", error);
        throw new Error(error.message);
    }
};

// update 

const checkIfHolidayExistsForUpdate = async (holidayDetailsUpdate) => {
    try {
        const { holiday_id, school_id } = holidayDetailsUpdate;
        const query = {
            text: QUERY.HOLIDAY.getHolidayDetailsforUpdate,
            values: [holiday_id, school_id],
        };
        const queryResult = await pg.executeQueryPromise(query);
        return queryResult[0].count;
    } catch (error) {
        console.error("Error in checkIfHolidayExists:", error);
        throw new Error(error.message);
    }
};

const updateHoliday = async (holidayUpdateDetails) => {
    try {
        const query = {
            text: QUERY.HOLIDAY.updateHolidayQuery,
            values: [
                holidayUpdateDetails.holiday_id,
                holidayUpdateDetails.school_id,
                holidayUpdateDetails.holiday_name,
                holidayUpdateDetails.holiday_description,
                holidayUpdateDetails.academic_year_id,
                holidayUpdateDetails.holiday_date,
                holidayUpdateDetails.updated_by
            ],
        };

        const queryResult = await pg.executeQueryPromise(query);
        return queryResult;
    } catch (error) {
        console.error("Error in Holiday details:", error);
        throw new Error(error.message);
    }
};

const checkHolidayIdExists = async (holiday_id) => {
    try {
        const query = {
            text: QUERY.HOLIDAY.ischeckHolidayIdExistsQuery,
            values: [holiday_id],
        };
        const result = await pg.executeQueryPromise(query);
        return result[0].count;
    } catch (error) {
        throw error;
    }
};

const getAllHoliday = async (school_id) => {
    try {
        const query = {
            text: QUERY.HOLIDAY.getAllHolidayQuery,
            values: [school_id],
        };
        const result = await pg.executeQueryPromise(query);
        console.log("result",result)
        return result;
    } catch (error) {
        throw error;
    }
};

const getHolidayDetailsIdExists = async (holiday_id) => {
    try {
        const query = {
            text: QUERY.HOLIDAY.getHolidayByIdQuery,
            values: [holiday_id],
        };
        const result = await pg.executeQueryPromise(query);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    checkIfHolidayExists,
    checkIfHolidayExistsForUpdate,
    getAllHoliday,
    checkHolidayIdExists,
    updateHoliday,
    getHolidayDetailsIdExists,
    addHoliday
}