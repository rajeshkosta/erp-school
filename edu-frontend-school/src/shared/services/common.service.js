import { get, post } from "../../utility/ApiCall";
import ToastUtility from "../../utility/ToastUtility";

const getLoggedInUserDetails = async (addUserDetailsToContext) => {
  try {
    const getLoginUserInfo = await get("/api/v1/user/getLoggedInUserInfo");
    const loggedInUser = getLoginUserInfo.data.loggedInUser
    const menuList = await getCombinedAccessControlList(loggedInUser.user_id,loggedInUser.role_id)
    loggedInUser.menu_permission = menuList
    addUserDetailsToContext(loggedInUser);
    
  } catch (error) {
    console.error("Error :", error);
    throw error;
  }
};

const getCombinedAccessControlList = async (user_id, role_id) => {
  let menuList;
  try {
    const accessControlList = await get(
      `/api/v1/admin/role/getCombinedAccessList/${user_id}/${role_id}`
    );
    if (accessControlList?.data.length > 0) {
      menuList = createModules(accessControlList.data);
    } else {
      ToastUtility.info("Please Wait ...");
    }
    return menuList;
  } catch (error) {
    console.error("Error :", error);
    throw error;
  }
};

function createModules(accessControlList) {
  const result = [];

  accessControlList.forEach((module) => {
    if (module.has_sub_menus) {
      // Module has sub-menus
      const subMenus = module.sub_menus?.map((subMenu) => {
        if (subMenu.display_permission === 1) {
          return {
            link: subMenu.route_url,
            label: subMenu.menu_name,
            icon: subMenu.icon_class,
            initiallyOpened: false,
            permission: getPermission(subMenu),
          };
        }
        return null;
      }).filter(Boolean);

      if (subMenus.length > 0) {
        result.push({
          label: module.module_name,
          icon: module.module_icon,
          submenu: subMenus,
        });
      }
    } else if (module.sub_menus[0].display_permission === 1) {
      // Module without sub-menus and display_permission is 1
      result.push({
        link: module.sub_menus[0].route_url,
        label: module.sub_menus[0].menu_name,
        icon: module.sub_menus[0].icon_class,
        initiallyOpened: false,
        permission: getPermission(module.sub_menus[0]),
      });
    }
  });

  return result;
} 
function getPermission(menuItem) {
  const hasReadAccess = menuItem.read_permission;
  const hasWriteAccess = menuItem.write_permission;
  const permission =
    hasReadAccess == 1 && hasWriteAccess == 1
      ? "Full"
      : hasReadAccess
      ? "Read"
      : "Full";
  return  permission
  
}

function getCurrentScreenPermissin(menuPermission){
  const currentPath = window.location.pathname

  const currentScreenPermission = menuPermission.find(menu =>{
    if(menu.submenu){
      const currentSubmenuPermission = menu.submenu.find(submenu =>
        submenu.link === currentPath
      )
      return currentSubmenuPermission
    }else if( menu.link === currentPath) {
     return menu
    }
    
  })
  return currentScreenPermission
}

export { getLoggedInUserDetails, getCombinedAccessControlList, getCurrentScreenPermissin };
