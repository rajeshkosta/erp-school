const { pg, CONST, redis, logger, queryUtility } = require("edu-micro-common");
const QUERY = require('../constants/QUERY');
const ERRORCODE = require('../constants/ERRORCODE');
const fileConfig = require('../constants/config');

//Get version details query
const getRoleDetails = async (school_id, role_access) => {
  try {
    if (school_id) {
      var key = `ROLE|SCHOOL:${school_id}`;
      const cachedData = await redis.GetKeyRedis(key);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    }

    let _query = {
      text: QUERY.ROLE.selectRoleDetails + ` and level in ('${role_access}')`,
      values: [school_id]
    };
    console.log("_query", _query);
    const queryResult = await pg.executeQueryPromise(_query);
    if (queryResult && queryResult.length > 0) {
      if (school_id) {
        redis.SetRedis(key, queryResult, CONST.CACHE_TTL.LONG).then().catch(err => console.log(err));
      }
    }
    return queryResult;
  } catch (error) {
    throw new Error(error.message);
  }
};

const validatePattern = async (name, description) => {
  try {
    let error = '';
    if (!fileConfig.roleNameRegex.test(name)) {
      error = `{"errorCode":"ROLE000004", "error":"${ERRORCODE.ERROR.ROLE000004}"}`;
    } else if (!fileConfig.roledescRegex.test(description)) {
      error = `{"errorCode":"ROLE000005", "error":"${ERRORCODE.ERROR.ROLE000005}"}`;
    }
    return error;
  } catch (err) {
    throw new Error(err.message);
  }
};

const checkIfExist = async (role) => {
  try {
    let _text = QUERY.ROLE.checkRoleExist
    let _query = {
      text: _text,
      values: [role.role_name, role.school_id]
    };
    const queryResult = await pg.executeQueryPromise(_query);
    console.log(queryResult[0].count);
    return queryResult[0].count;

  } catch (error) {
    throw new Error(error.message);
  }
};

const addPermissions = async (access) => {
  try {
    let _query = {
      text: QUERY.ROLE.addPermissions,
      values: [access.role_id, access.menu_id, access.per_id]
    };

    const queryResult = await pg.executeQueryPromise(_query);
    redis.deleteKey(`ACCESS_LIST|ROLE:${access.role_id}`)
    return queryResult;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addRole = async (role) => {
  try {
    let _query = {
      text: QUERY.ROLE.insertRoleQuery,
      values: [role.role_name, role.role_description, role.level, role.is_active, role.school_id, role.created_by, role.updated_by]
    };

    const queryResult = await pg.executeQueryPromise(_query);
    redis.deleteKey(`ROLE|SCHOOL:${role.school_id}`);
    redis.deleteKey(`ROLE|SCHOOL:0`);
    return queryResult;
  } catch (error) {
    throw new Error(error.message);
  }

};

//Retrieve Role details for Edit Role
const getSpecificRoleDetails = async (roleID) => {
  try {
    let _query = {
      text: QUERY.ROLE.selectSpecificRoleDetails,
      values: [roleID]
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
  }

};

const countActiveUsers = async (role_id, school_id) => {

  try {
    let _query = {
      text: QUERY.ROLE.countActiveUsersQuery,
      values: [role_id, school_id]
    };

    const queryResult = await pg.executeQueryPromise(_query);
    if (queryResult[0].activeusers > 0) {
      return `{"errorCode":"ADMROL0002", "error":"${ERRORCODE.ERROR.ADMROL0002}", "count":"${queryResult[0].activeusers}"}`
    } else {
      return 0;
    }
  } catch (error) {
    throw new Error(error.message);
  }

};

const checkNameExist = async (name, role_id, school_id) => {
  try {
    let _text = QUERY.ROLE.checkRoleNameExist;
    let _query = {
      text: _text,
      values: [name, role_id, school_id]
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult[0].count;
  } catch (error) {
    throw new Error(error.message);
  }

};

const deletePermissions = async (role) => {
  try {
    let _query = {
      text: QUERY.ROLE.deletePermissions,
      values: [role.role_id]
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
    throw new Error(error.message);
  }
};

//Get active roles query
const getactiveRoles = async (access, role_id, school_id) => {

  try {
    let queryString = ` and level in ('${access}') and school_id = ${school_id} ORDER BY role_name asc`;

    let _query = {
      text: QUERY.ROLE.getActiveRolesQuery + queryString
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getRoleAccessList = async (role_id) => {
  try {
    let key = `ACCESS_LIST|ROLE:${role_id}`;
    const cachedData = await redis.GetKeyRedis(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    let _query = {
      text: QUERY.ROLE.getRoleAccessList,
      values: [role_id]
    };
    const queryResult = await pg.executeQueryPromise(_query);
    if (queryResult && queryResult.length > 0) {
      redis.SetRedis(key, queryResult, CONST.CACHE_TTL.LONG).then().catch(err => console.log(err));
    }
    return queryResult;
  } catch (error) {
    throw new Error(error.message);
  }

};

// To Update The Role Details
const editRole = async (role, school_id) => {
  try {
    let _query = {
      text: QUERY.ROLE.updateRoleQuery,
      values: [role.role_name, role.role_description, role.is_active, role.level, role.updated_by, role.role_id]
    };
    const queryResult = await pg.executeQueryPromise(_query);
    redis.deleteKey(`ROLE|SCHOOL:${school_id}`);
    redis.deleteKey(`ROLE|SCHOOL:0`);
    return queryResult;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMenuList = async (isActive) => {

  try {
    // let key = `MENU_LIST|IS_ACTIVE:${isActive}`;
    // const cachedData = await redis.GetKeyRedis(key);
    // if (cachedData) {
    //   return JSON.parse(cachedData);
    // }
    let queryString = isActive ? ` AND is_active = 1 ORDER BY menu_order ASC` : ` ORDER BY menu_order ASC`;
    let _query = {
      text: QUERY.ROLE.getMenuList + queryString
    };
    const queryResult = await pg.executeQueryPromise(_query);
    // if (queryResult && queryResult.length > 0) {
    //   redis.SetRedis(key, queryResult, CONST.CACHE_TTL.LONG).then().catch(err => console.log(err));
    // }
    return queryResult;
  } catch (error) {
    throw new Error(error.message);
  }

};

const getLevels = async () => {
  try {

    const result = CONST.APP_CATEGORY_LEVELS;
    return result;

  } catch (error) {
    throw new Error(error.message);
  }
}

const getCombinedAccessList = async (user_id, role_id) => {

  try {
    let key = `COMBINED_ACCESS_LIST|USER:${user_id}`;
    const cachedData = await redis.GetKeyRedis(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    let _query = {
      text: QUERY.ROLE.getCombinedAccessList,
      values: [user_id, role_id]
    };

    const queryResult = await pg.executeQueryPromise(_query);

    const accessData = getFormattedAccessList(queryResult)
    if (accessData && accessData.length > 0) {
      redis.SetRedis(key, accessData, CONST.CACHE_TTL.LONG).then().catch(err => console.log(err));
    }
    return accessData;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }

};


const getFormattedAccessList = (accessList) => {


  const menuObj = accessList.reduce((pv, cv) => {

    const moduleId = pv[cv.module_name];
    if (moduleId) {

      const tempMenuObj = {
        menu_id: cv.menu_id,
        menu_name: cv.menu_name,
        icon_class: cv.icon_class,
        route_url: cv.route_url,
        write_permission: cv.write_permission,
        read_permission: cv.read_permission,
        display_permission: cv.display_permission
      }
      moduleId['sub_menus'].push(tempMenuObj)

    } else {

      const tempMenuObj = {
        menu_id: cv.menu_id,
        menu_name: cv.menu_name,
        icon_class: cv.icon_class,
        route_url: cv.route_url,
        write_permission: cv.write_permission,
        read_permission: cv.read_permission,
        display_permission: cv.display_permission
      }

      const tempModuleObj = {
        module_id: cv.module_id,
        module_name: cv.module_name,
        module_icon: cv.module_icon,
        module_route: cv.module_route,
        sub_menus: [tempMenuObj]
      }

      pv[cv.module_name] = tempModuleObj;

    }
    return pv;
  }, {})

  const menuList = []

  for (const key in menuObj) {

    if (menuObj[key].sub_menus.length == 1) {
      menuObj[key].has_sub_menus = false;
    } else {
      menuObj[key].has_sub_menus = true;
    }

    menuList.push(menuObj[key])

  }

  return menuList;

}

const defaultAccessList = async () => {

  try {
    // let key = `DEFAULT_ACCESS_LIST`;
    // const cachedData = await redis.GetKeyRedis(key);
    // if (cachedData) {
    //   return JSON.parse(cachedData);
    // }
    let _query = {
      text: QUERY.ROLE.defaultAccessList
    };
    const queryResult = await pg.executeQueryPromise(_query);
    // if (queryResult && queryResult.length > 0) {
    //   redis.SetRedis(key, queryResult, CONST.CACHE_TTL.LONG).then().catch(err => console.log(err));
    // }
    return queryResult;
  } catch (error) {
    throw new Error(error.message);
  }

};

const updateRoleStatus = async (status, updated_by, role_id) => {
  try {
    let _query = {
      text: QUERY.ROLE.updateRoleStatusQuery,
      values: [status, updated_by, role_id]
    };
    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getRoleListBySchool = async (school_id) => {

  try {

    let _query = {
      text: QUERY.ROLE.getRoleListBySchool,
      values: [school_id]
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;
  } catch (error) {
    throw new Error(error.message);
  }
};


const getRolesByLevel = async (level, school_id) => {
  try {

    let query = `SELECT role_id, role_name, level FROM m_roles
                where is_active = 1 
                and school_id = ${school_id}`

    query += level ? ` and level ilike '${level}'` : "";
    console.log(query);
    const queryResult = await pg.executeQueryPromise(query);
    return queryResult;

  } catch (error) {
    throw error;
  }
}



module.exports = {
  getRoleDetails,
  validatePattern,
  checkIfExist,
  addPermissions,
  addRole,
  getSpecificRoleDetails,
  countActiveUsers,
  checkNameExist,
  deletePermissions,
  getactiveRoles,
  getRoleAccessList,
  editRole,
  getMenuList,
  getLevels,
  getCombinedAccessList,
  defaultAccessList,
  updateRoleStatus,
  getRoleListBySchool,
  getRolesByLevel
};
