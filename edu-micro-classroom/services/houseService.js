const { pg } = require("edu-micro-common");

const QUERY = require("../constants/QUERY");
const { query } = require("express");

const checkIfExist = async (houseName, academicYearId) => {
    try {
        const query = {
            text:QUERY.CLASSROOM.HOUSE.checkIfExistQuery,
            values: [houseName, academicYearId],
        };

        const result = await pg.executeQueryPromise(query);
        return result[0].count;
    } catch (error) {
        throw error;
    }
};

const addHouse = async (house) => {
    try {

        const _query = {
            text: QUERY.CLASSROOM.HOUSE.insertHouseQuery,
            values: [
                house.academic_year_id,
                house.house_name,
                house.house_description,
                house.status,
                house.updated_by,
                house.created_by
            ]
        };

        const result = await pg.executeQueryPromise(_query);
        return result;
    } catch (error) {
        throw error;
    }

}
const updateHouse = async (updateHouse) => {
    try {
        const _query = {
            text: QUERY.CLASSROOM.HOUSE.updateHouseQuery,
            values: [
                updateHouse.house_id, 
                updateHouse.academic_year_id,
                updateHouse.house_name,
                updateHouse.house_description,

            ]
        };
console.log(query)

        const result = await pg.executeQueryPromise(_query);
        return result;
    } catch (error) {
        throw error;
    }
};

const checkIfIdExist = async (houseId) => {
    try {
        const query = {
            text: QUERY.CLASSROOM.HOUSE.checkIfIdExistQuery,
            values: [houseId],
        };

        const result = await pg.executeQueryPromise(query);
        return result[0].count;
    } catch (error) {
        throw error;
    }
}; 

const getAllHouse = async() =>{
    try{
        const query = {
            text :QUERY.CLASSROOM.HOUSE.getAllHouseQuery,
            value:[],
        };

        const result = await pg.executeQueryPromise(query);
        return result;                   
    }catch(error){
        throw error;
    }
};

const getHouseById = async (house_id) => {
    try {
        const query = {
            text:QUERY.CLASSROOM.HOUSE.getHouseByIdQuery,
            values: [house_id]
        };
        const result = await pg.executeQueryPromise(query);
        return result;
    } catch (error) {
        throw error;
    }
};

const checkHouseIdExists = async (house_id)=>{
    try{
        const query = {
            text:QUERY.CLASSROOM.HOUSE.checkIfHouseIdExists,
            values:[house_id]
        };
        const result = await pg.executeQueryPromise(query);
        return result[0].count;       
    } catch (error) {
        throw error;

    }
}


module.exports = {
    checkIfExist,
    checkIfIdExist,
    updateHouse,
    addHouse,
    getAllHouse,
    getHouseById,
    checkHouseIdExists,
};
