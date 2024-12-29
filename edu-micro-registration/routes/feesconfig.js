const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const ERRORCODE = require('../constants/ERRORCODE');
const { STATUS, logger, DB_STATUS } = require("edu-micro-common");
const feesconfigModels = require('../models/feesconfigModels');
const feesconfigService = require('../services/feesconfigService')


router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

//POST Feeconfig
router.post("/create", async (req, res) => { 

    try {
      
        const reqUserDetails = req.plainToken;
        const feeconfigDetails = new feesconfigModels.Feeconfig(req.body);
        feeconfigDetails.created_by = reqUserDetails.user_id;
        feeconfigDetails.updated_by = reqUserDetails.user_id;

        const existingConfig = await feesconfigService.getFeeConfigByAcademicAndStudentIds(feeconfigDetails.academic_year_id, feeconfigDetails.student_admission_id);
        if (existingConfig > 0 ) {
            return res.status(STATUS.BAD_REQUEST).json({ error: "Combination of academic year and student already exists" });
        }


        const {error } = feesconfigModels.validateFeeconfig(feeconfigDetails)
        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);

        }
       
        const createFeeConfigResult = await feesconfigService.createFeeConfig(feeconfigDetails);
        let fees_config_id = createFeeConfigResult[0].fees_config_id;
        for (const feeConfigMapping of feeconfigDetails.fees_list){
            let configMapping = feeConfigMapping;
            configMapping.fees_config_id = fees_config_id;
            configMapping.created_by = reqUserDetails.user_id;
            configMapping.updated_by = reqUserDetails.user_id;
            configMapping.status = DB_STATUS.STATUS_MASTER.ACTIVE;
            await feesconfigService.createFeeConfigMapping(configMapping);
        }
       
        res.status(STATUS.CREATED).json({message:"Fee Configuration Created"});
        return;

  
    } catch (error) {
        logger.error(`Error adding fee config: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

//GET Specific getFeeConfigDetailsByfeeConfigId 
router.get("/getFeeConfig/:feeConfigId", async (req, res) => {
    try {
        const fees_config_id = parseInt(req.params.feeConfigId);
        const feeConfigDetails = await feesconfigService.getFeeConfogDetailsByfeeConfigId(fees_config_id);
        res.status(STATUS.OK).json(feeConfigDetails);
        return;

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"FEECONFIG000", "error":"${ERRORCODE.FEECONFIG.FEECONFIG000}"}`);
    }
});

//UPDATE fee_config
router.post("/update", async (req, res) => {
    try {
        const reqUserDetails = req.plainToken;
        const feeConfigDetails = new feesconfigModels.updateFeeconfig(req.body);
        feeConfigDetails.updated_by = reqUserDetails.user_id;
        const { error } = feesconfigModels.validateUpdateFeeconfig(feeConfigDetails);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
      
        }
           
        const isFeeconfigDetailsExist = await feesconfigService.checkisFeeconfigDetailsExist(feeConfigDetails.fees_config_id);
            if (isFeeconfigDetailsExist == 0) {
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"FEECONFIG001", "error":"${ERRORCODE.FEECONFIG.FEECONFIG001}"}`);
            }
        
         await feesconfigService.updateFeeconfig(feeConfigDetails);
    

        await feesconfigService.deleteFeesConfigMapping(feeConfigDetails.fees_config_id);
        for (const feeConfigMapping of feeConfigDetails.fees_list){
            let configMapping = feeConfigMapping;
            configMapping.fees_config_id = feeConfigDetails.fees_config_id;
            configMapping.updated_by = reqUserDetails.user_id;
            configMapping.status = DB_STATUS.STATUS_MASTER.ACTIVE;
            await feesconfigService.createFeeConfigMapping(configMapping);
        }
        res.status(STATUS.OK).json({
            fees_config_id: feeConfigDetails.fees_config_id,
            message: 'Fee Config Updated Successfully'
        });
        return;

    } catch (error) {
        logger.error( error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"FEECONFIG000", "error":"${ERRORCODE.FEECONFIG.FEECONFIG000}"}`);
    }

});

//GET All feeconfig
router.post("/getAllFeeConfig", async (req, res) => {
    try {

        const pageSize = req.body.page_size ? req.body.page_size : 0;
        let currentPage = req.body.current_page ? req.body.current_page : 0;
        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);
        const status = req.body.status ?  req.body.status : null;
        const {academic_year_id , class_id , section_id  } = req.body;
        

        const reqParams = {
            academic_year_id,
            class_id,
            pageSize,
            currentPage,
            status
        };

        const FeeConfigList = await feesconfigService.getAllFeeConfigs(reqParams);
        console.log("FeeConfigList",FeeConfigList);
        res.status(STATUS.OK).send(FeeConfigList);
        return;

    } catch (error) {
        logger.error("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"FEECONFIG000", "error":"${ERRORCODE.FEECONFIG.FEECONFIG000}"}`);
    }
});

//get_Config_Details_By_academic_and_student_id 
router.post('/getStudentdetailsinFeeConfig', async (req, res) => {
    try {
        const { academic_year_id } = req.body;
        const {student_admission_id } = req.body;

        const feeConfig = await feesconfigService.getfeesConfig(academic_year_id, student_admission_id);

        if (feeConfig && feeConfig.length > 0 && feeConfig[0].fees_config_id > 0) {
            const feeConfigDetails = await feesconfigService.getAllfeesConfig(feeConfig[0].fees_config_id);
            feeConfig[0].fees_list = feeConfigDetails;
            res.status(STATUS.OK).json({data: feeConfig });
        }else{
            return res.status(STATUS.OK).json({ error: 'No Data Found. Kindly Configure Your Fee' });
        }

        
    } catch (error) {
        logger.error(`Error retrieving fees config details: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong!' });
    }
});

module.exports= router;