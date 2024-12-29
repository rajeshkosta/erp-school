const express = require("express");
const router = express.Router();
const { STATUS, CONST, logger } = require("edu-micro-common");

let async = require('async');

let roles = require('../models/roles');
let ERRORCODE = require('../constants/ERRORCODE');
const roleService = require("../services/roleService");

router.get("/getRoles", async (req, res) => {
  try {
    const reqUserDetails = req.plainToken;
    const access_list = req.eduPayload.role_access;
    let role_access = access_list.join("','");
    const school_id = reqUserDetails.school_id ? reqUserDetails.school_id : 0;

    let data = await roleService.getRoleDetails(school_id, role_access);
    res.status(STATUS.OK).send(data);
  } catch (err) {
    logger.error(err);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.post("/addRole", async (req, res) => {
  try {
    const reqUserDetails = req.plainToken;
    const role_id = reqUserDetails.role;

    if (role_id != 3) {
      return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ROLE000010", "error":"${ERRORCODE.ERROR.ROLE000010}"}`);
    }

    let role = new roles.Role(req.body);
    const { error } = roles.validateRole(role);
    let validatePatternError = await roleService.validatePattern(role.role_name, role.role_description);

    if (validatePatternError)
      return res.status(STATUS.BAD_REQUEST).send(validatePatternError);

    if (error) {
      if (
        error.details != null &&
        error.details != "" &&
        error.details != "undefined"
      )
        return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
      else return res.status(STATUS.BAD_REQUEST).send(error.message);

    } else {
      role.school_id = reqUserDetails.school_id ? reqUserDetails.school_id : 0;
      role = CONST.appendReqUserData(role, reqUserDetails);
      let checkRoleNameExist = await roleService.checkIfExist(role);
      if (checkRoleNameExist > 0)
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ROLE000001", "error":"${ERRORCODE.ERROR.ROLE000001}"}`);

      let data = await roleService.addRole(role);
      let role_id = data[0].role_id;

      async.forEachOfSeries(role.module_json, async function (per, cb2) {
        let access = {
          "role_id": role_id,
          "menu_id": per.menu_id,
          "per_id": per.per_id
        }
        await roleService.addPermissions(access);

      }, async function () {

        return res.status(STATUS.OK).send({ message: "Role added successfully." });
      });
    }

  } catch (err) {
    logger.error(err);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

//Retrieve Role details for Edit Role
router.get("/getRole/:roleID", async (req, res) => {
  try {
    let roleID = req.params.roleID;
    let result = await roleService.getSpecificRoleDetails(roleID);
    res.status(STATUS.OK).send(result[0]);
  } catch (error) {
    logger.error(err);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }

});

// To Update The Role Status
router.post("/updateRoleStatus", async (req, res) => {
  const reqUserDetails = req.plainToken;
  let role_id = req.body.role_id;
  let is_active = (req.body.is_active == '') ? 0 : req.body.is_active;
  let school_id = reqUserDetails.school_id ? reqUserDetails.school_id : 0;
  let updated_by = reqUserDetails.user_id;
  try {
    let activeUsers = await roleService.countActiveUsers(role_id, school_id);
    if (activeUsers) {
      return res.status(STATUS.BAD_REQUEST).send(activeUsers);
    } else {
      await roleService.updateRoleStatus(is_active, updated_by, role_id);
      res.status(STATUS.OK).send({ message: "Role Status has been updated successfully." });
    }
  } catch (err) {
    logger.error(err);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }

});

router.get("/getRoleAccessList/:role_id", async (req, res) => {
  try {
    const role_id = req.params.role_id;
    const data = await roleService.getRoleAccessList(role_id);
    res.status(STATUS.OK).send(data);
  } catch (err) {
    logger.error(err);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

// To Update The Role Details
router.post("/updateRoleDetails", async (req, res) => {
  try {
    const reqUserDetails = req.plainToken;
    const role_id = reqUserDetails.role;

    if (role_id != 3) {
      return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ROLE000010", "error":"${ERRORCODE.ERROR.ROLE000010}"}`);
    }

    let roleDetails = new roles.EditRole(req.body);
    const { error } = roles.validateEditRole(roleDetails);
    let validatePatternError = await roleService.validatePattern(roleDetails.role_name, roleDetails.role_description);
    if (validatePatternError) {
      return res.status(STATUS.BAD_REQUEST).send(validatePatternError);
    }
    if (error) {
      if (
        error.details != null &&
        error.details != "" &&
        error.details != "undefined"
      ) {
        return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
      }
      else {
        return res.status(STATUS.BAD_REQUEST).send(error.message);
      }

    } else {

      let school_id = reqUserDetails.school_id ? reqUserDetails.school_id : 0;
      if (roleDetails.is_active == 0) {
        let activeUsers = await roleService.countActiveUsers(roleDetails.role_id, school_id);
        if (activeUsers) {
          return res.status(STATUS.BAD_REQUEST).send(activeUsers);
        }
      }
      let checkRoleNameExist = await roleService.checkNameExist(roleDetails.role_name, roleDetails.role_id, school_id);
      if (checkRoleNameExist > 0) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ROLE000001", "error":"${ERRORCODE.ERROR.ROLE000001}"}`);
      }

      roleDetails = CONST.appendReqUserData(roleDetails, reqUserDetails, false);
      await roleService.editRole(roleDetails, school_id);
      if (req.body.module_json) {
        await roleService.deletePermissions(roleDetails);
        async.forEachOfSeries(req.body.module_json, async function (per, cb2) {
          let access = {
            "role_id": roleDetails.role_id,
            "menu_id": per.menu_id,
            "per_id": per.per_id
          }
          await roleService.addPermissions(access);

        }, async function () {
        });
      }
      return res.status(STATUS.OK).send({ message: "Role updated successfully." });
    }

  } catch (err) {
    logger.error(err);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.get("/getActiveRoleList", async (req, res) => {
  try {
    const access_list = req.eduPayload.role_access;
    let token = req.plainToken;
    let role_id = token.role;
    let school_id = token.school_id ? token.school_id : 0;
    let role_access = access_list.join("','");
    let data = await roleService.getactiveRoles(role_access, role_id, school_id);
    res.status(STATUS.OK).send(data);
  } catch (err) {
    logger.error(err);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.post('/getRolesByLevel', async (req, res) => {
  try {
    const { school_id } = req.plainToken;
    const level = req.body.level;

    const data = await roleService.getRolesByLevel(level, school_id);
    res.status(STATUS.OK).send(data);


  } catch (error) {
    console.log(error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
})

router.get("/getMenuList/:isActive", async (req, res) => {
  try {
    const level = req.eduPayload.role_access;
    let isActive = req.params.isActive ? parseInt(req.params.isActive) : 0;
    let data = await roleService.getMenuList(isActive);
    data = spliceMenuByLevel(data, level[0]);
    res.status(STATUS.OK).send(data);
  } catch (err) {
    logger.error(err);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});


router.get("/getLevels", async (req, res) => {
  try {
    const role_access = req.eduPayload.role_access;
    res.status(STATUS.OK).send(role_access);
  } catch (err) {
    logger.error(err);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.get("/getCombinedAccessList/:user_id/:role_id", async (req, res) => {
  try {
    let token = req.plainToken;
    let user_id = token.user_id ? token.user_id : req.params.user_id;
    let role_id = token.role ? token.role : req.params.role_id;

    let data = await roleService.getCombinedAccessList(user_id, role_id);
    return res.status(STATUS.OK).send(data);
  } catch (err) {
    console.log("roles :: getCombinedAccessList :: ", err)
    logger.error(err);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.get("/defaultAccessList", async (req, res) => {
  try {
    let data = await roleService.defaultAccessList();
    res.status(STATUS.OK).send(data);
  } catch (err) {
    logger.error(err);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.get("/getRoleListBySchool", async (req, res) => {
  try {
    const reqUserDetails = req.plainToken;

    if (!reqUserDetails.school_id) {
      return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRPRF00001", "error":"${ERRORCODE.USER.USRPRF00001}"}`);
    }
    let data = await roleService.getRoleListBySchool(reqUserDetails.school_id);
    res.status(STATUS.OK).send(data);
  } catch (err) {
    logger.error(err);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

function spliceMenuByLevel(data, level) {
  let result = data;
  if (level == "Trust") {
    result = spliceObjet(data, "Organization");
  } else if (level == "School") {
    result = spliceObjet(data, "Organization");
    result = spliceObjet(data, "School");
  } else if (level == "Faculty" || level == "NonFaculty" || level == "Vendor") {
    result = spliceObjet(data, "Organization");
    result = spliceObjet(data, "School");
    result = spliceObjet(data, "Role Management");
    result = spliceObjet(data, "Staff Management");
    result = spliceObjet(data, "Academic Year");
  }
  return result;
}

function spliceObjet(result, popObject) {
  const indexOfObject = result.findIndex(object => {
    return object.label === popObject;
  });
  result.splice(indexOfObject, 1);
  return result;
}

module.exports = router;