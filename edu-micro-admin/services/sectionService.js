const { pg, ERRORCODE, logger } = require("edu-micro-common");
const QUERY = require('../constants/QUERY');



    const checkIfExist = async (school_id, section_name) => {
        try {
            const query = {
                text:QUERY.SECTION.checkIfExistQuery,
                values: [school_id, section_name],
            };

            const result = await pg.executeQueryPromise(query);
            return result[0].count;
        } catch (error) {
            logger.error(`Error checking section existence: ${error}`);
            throw error;
        }
    };


    const checkIfExistbyID = async (schoolId, sectionName, sectionId) => {
        try {
            const query = {
                text: QUERY.SECTION.checkIfExistbyId, 
                values: [schoolId, sectionName, sectionId], 
            };
    
            const result = await pg.executeQueryPromise(query);
            return result[0].count;
        } catch (error) {
            throw error;
        }
    };

const addSection = async (newSection) => {
    try {
        const query = {
            text: QUERY.SECTION.insertSectionQuery,
            values: [
                newSection.school_id,
                newSection.section_name,
                newSection.status,
                newSection.created_by,
                newSection.updated_by,
            ],
        };

        const result = await pg.executeQueryPromise(query);
        return result[0];
    } catch (error) {
        logger.error(`Error adding section: ${error}`);
        throw error;
    }
};


    const getSectionById = async (sectionId) => {
        try {
            const query = {
                text: QUERY.SECTION.getSectionByIdQuery,
                values: [sectionId],
            };
            const result = await pg.executeQueryPromise(query);
            return result[0]; 
        } catch (error) {
            logger.error(`Error getting section details by ID: ${error}`);
            throw error;
        }
    };

    const getAllSection = async (schoolId) => {
        try {

            const query = {
                text: QUERY.SECTION.getAllSection,
                values: [schoolId],
            };
            const result = await pg.executeQueryPromise(query);
            return result;
        } catch (error) {
            logger.error(`Error getting section details: ${error}`);
            throw error;
        }
    };

    const updateSectionDetails = async (sectionDetails) => {
        try {
            const query = {
                text: QUERY.SECTION.updateSectionById,
                values: [
                    sectionDetails.section_name,
                    sectionDetails.updated_by,
                    sectionDetails.section_id,
                 
                ],
            };
    
            const result = await pg.executeQueryPromise(query);
    
            return result;
        } catch (error) {
            console.error(`Error updating section: ${error}`);
            throw error;
        }
    };

module.exports = {checkIfExist,addSection,getSectionById,getAllSection,updateSectionDetails,checkIfExistbyID
    
    
};
 