const express = require("express");
const router = express.Router();
const { STATUS, CONST } = require("edu-micro-common");

const houses = require('../models/houseModels');
const ERRORCODE = require('../constants/ERRORCODE');
const houseService = require("../services/houseService");



router.post("/addHouse", async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const house = new houses.House(req.body);
        const created_by = reqUserDetails.user_id;
        const updated_by = reqUserDetails.user_id;
        
        const { error } = houses.validateHouse(house);
        if (error) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "HOUSE000005", error: ERRORCODE.ERROR.HOUSE000005 });
        }

        const checkHouseNameExist = await houseService.checkIfExist(house.house_name, house.academic_year_id);
        if (checkHouseNameExist > 0) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "HOUSE000001", error: ERRORCODE.ERROR.HOUSE000001 });
        }

        house.created_by = created_by;
        house.updated_by = updated_by;

        const data = await houseService.addHouse(house);
        return res.status(STATUS.OK).send({ message: "House added successfully.", data: data });
    } catch (err) {
        console.error(err);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ errorCode: "HOUSE000004", error: ERRORCODE.ERROR.HOUSE000004 });
    }
});


router.post("/updateHouse", async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        let updateHouse = new houses.UpdateHouse(req.body);
        const { error } = houses.validateUpdateHouse(updateHouse);

        if (error) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "HOUSE000005", error: ERRORCODE.ERROR.HOUSE000005 });
        }

        const updated_by = reqUserDetails.user_id;
        updateHouse = CONST.appendReqUserData(updateHouse, reqUserDetails);
        updateHouse.updated_by = updated_by;        

        const checkHouseId = await houseService.checkIfIdExist(updateHouse.house_id);
        if (checkHouseId == 0) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "HOUSE000003", error: ERRORCODE.ERROR.HOUSE000003 });
        }

        const checkHouseNameExist = await houseService.checkIfExist(updateHouse.house_name, updateHouse.academic_year_id);
        if (checkHouseNameExist > 0) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "HOUSE000002", error: ERRORCODE.ERROR.HOUSE000002 });
        }

        console.log("update house",updateHouse)
        const updatedData = await houseService.updateHouse(updateHouse);
        return res.status(STATUS.OK).send({ message: "House updated successfully." });
    } catch (err) {
        console.error(err);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ errorCode: "HOUSE000004", error: ERRORCODE.ERROR.HOUSE000004 });
    }
});


router.get("/getAllHouse",async(req,res)=>{
    try{

        const reqUserDetails = req.plainToken;
        const school_id = reqUserDetails.school_id;
        console.log(school_id);
        const houseDetails = await houseService.getAllHouse();
        return res.status(STATUS.OK).send({message: "All house details",houseDetails})

    } catch (err) {
        console.error(err);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send({ errorCode: "HOUSE000004", error: ERRORCODE.ERROR.HOUSE000004 });
    }   
});

router.get("/getHouseById/:houseId", async (req, res) => {
    try {

        const houseId = req.params.houseId;
        if (isNaN(houseId)) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "HOUSE000006", error: ERRORCODE.ERROR.HOUSE000003 });
        }

        const houseIdExist = await houseService.checkHouseIdExists(houseId);
        if (houseIdExist ==0 ){
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "HOUSE000003", error: ERRORCODE.ERROR.HOUSE000003 });
        }

        const houseDetailsById = await houseService.getHouseById(houseId);
        return res.status(STATUS.OK).send( houseDetailsById );
    } catch (err) {
        return res.status(STATUS.BAD_REQUEST).send({ errorCode: "HOUSE000004", error: ERRORCODE.ERROR.HOUSE000004 });
    }
});

module.exports = router;
