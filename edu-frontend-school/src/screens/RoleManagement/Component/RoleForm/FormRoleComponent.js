import React, { useState, useEffect } from "react";
import { IconChevronLeft, IconCloudUpload } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FormRoleComponent.css";
import { Checkbox, NativeSelect, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import * as addRoleService from "../../Role.service";
import ToastUtility from "../../../../utility/ToastUtility";

const FormRoleManagement = () => {
  const [menuList, setMenuList] = useState([]);
  const [levelsList, setLevelsList] = useState([]);
  const [checkedMenus, setCheckedMenus] = useState({});
  const [roleData, setRoleData] = useState({});
  const [roleAccessList, setRoleAccessList] = useState({});

  const { state } = useLocation();

  const navigate = useNavigate();
  const goBackToRoleManagementPage = () => {
    navigate("/rolemanagement");
  };

  const form = useForm({
    initialValues: {
      level: "",
      role_name: "",
      role_description: "",
    },

    validate: {
      level: (value) =>
        value === "" || value === "Select" ? "Please select role type" : null,
      role_name: (value) =>
        value.length < 3 ? "Role naame is too short" : null,
      role_description: (value) =>
        value.length < 3 ? "Role description is too short" : null,
    },
  });

  const handleCheckboxChange = (menuId, checkboxType) => {
    setCheckedMenus((prevCheckedMenus) => {
      const menuKey = menuId;
      const updatedMenu = {
        ...prevCheckedMenus[menuKey],
        [checkboxType]: !prevCheckedMenus[menuKey]?.[checkboxType],
      };

      // if (checkboxType === "write") {
      //   updatedMenu.read = !prevCheckedMenus[menuKey]?.read;
      // }

      //new changes

      // if (updatedMenu?.read) {
      //   updatedMenu.read = true;
      // } else if (updatedMenu?.write) {
      //   updatedMenu.read = !prevCheckedMenus[menuKey]?.read;
      // }

      if (checkboxType === "write") {
        if (updatedMenu.write) {
          updatedMenu.read = true;
        } else {
          updatedMenu.read = false;
        }
      } else {
        if (updatedMenu?.read) {
          updatedMenu.read = true;
        } else {
          updatedMenu.write = false;
        }
      }

      //new changes

      return {
        ...prevCheckedMenus,
        [menuKey]: updatedMenu,
      };
    });
  };

  const transformCheckedMenus = () => {
    const transformedMenus = [];

    for (const menuId in checkedMenus) {
      const menu = checkedMenus[menuId];
      const foundMenu = menuList.find((m) => m.menu_id == menuId);

      if (foundMenu) {
        if (menu.read) {
          transformedMenus.push({
            menu_id: foundMenu.menu_id,
            per_id: 2,
          });
        }
        if (menu.write) {
          transformedMenus.push({
            menu_id: foundMenu.menu_id,
            per_id: 1,
          });
        }
      }
    }

    return transformedMenus;
  };

  const getMenuList = async () => {
    const getMenuListResponse = await addRoleService.getMenuList();
    if (!getMenuListResponse.error) {
      setMenuList(getMenuListResponse.data);
    } else {
      console.error("Failed to fetch menu list");
    }
  };

  const getLevels = async () => {
    const getLevelsResponse = await addRoleService.getLevelsList();
    if (!getLevelsResponse.error) {
      setLevelsList(getLevelsResponse.data);
    } else {
      console.log("Failed to fetch levels list");
    }
  };

  useEffect(() => {
    getMenuList();
    getLevels();
  }, []);

  const onSubmit = async () => {
    if (state?.rowData.role_id) {
      const { role_name, role_description, level } = form.values;

      const payload = {
        role_id: state?.rowData.role_id,
        role_name: role_name,
        role_description: role_description,
        level: level,
        is_active: state?.rowData.is_active,
        module_json: transformCheckedMenus(),
      };

      const upDateRoleResponse = await addRoleService.upDateRole(payload);
      if (!upDateRoleResponse.error) {
        ToastUtility.success("Role updated successfully");
        if (upDateRoleResponse.data.message !== "") {
          navigate("/rolemanagement");
        }
      } else {
        ToastUtility.info("Please try again with proper details");
      }
    } else {
      const { role_name, role_description, level } = form.values;

      const payload = {
        role_name: role_name,
        role_description: role_description,
        level: level,
        is_active: 1,
        module_json: transformCheckedMenus(),
      };

      const addRoleResponse = await addRoleService.AddRole(payload);
      if (!addRoleResponse.error) {
        ToastUtility.success("Role added successfully");
        if (addRoleResponse.data.message === "Role added successfully.") {
          navigate("/rolemanagement");
        }
      } else {
        ToastUtility.info("Please try again with proper details");
      }
    }
  };

  const getDataByRoleId = async (roleId) => {
    const getRoleByRoleIdResponse = await addRoleService.getRoleByRoleId(
      roleId
    );
    if (!getRoleByRoleIdResponse.error) {
      setRoleData(getRoleByRoleIdResponse.data);
    } else {
      console.log("No data found for this Role ID!");
    }
  };

  const getRoleAccessList = async (roleId) => {
    const getRoleAccessResponse = await addRoleService.getRoleAccess(roleId);
    if (!getRoleAccessResponse.error) {
      setRoleAccessList(getRoleAccessResponse.data);
      let tempCheckedMenus = {};
      getRoleAccessResponse.data.forEach((access) => {
        tempCheckedMenus[access.menu_id] = {
          read: access.read_permission === "1",
          write: access.write_permission === "1",
        };
      });
      setCheckedMenus(tempCheckedMenus);
    } else {
      console.log("No data found for this Role ID!");
    }
  };

  useEffect(() => {
    if (state?.rowData.role_id) {
      getDataByRoleId(state?.rowData.role_id);
      getRoleAccessList(state?.rowData.role_id);
    }
  }, []);

  useEffect(() => {
    form.setValues(roleData);
  }, [roleData]);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <IconChevronLeft
          size={30}
          onClick={goBackToRoleManagementPage}
          style={{ cursor: "pointer" }}
          color="black"
        />
        <span
          className="fw-bold"
          style={{ fontSize: "20px", marginLeft: "10px" }}
        >
          {state?.rowData.role_id ? "Update Role" : "Add Role"}
        </span>
      </div>
      <div className="add-organization-container mx-2 pt-2">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="row mt-2">
            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary mb-1"
                htmlFor="role-type"
              >
                Role Type *
              </label>
              <NativeSelect
                size="lg"
                placeholder="Select"
                {...form.getInputProps("level")}
                required
                data={["Select", ...levelsList]}
              />
            </div>
            <div className="form-group text-start mb-3 col-lg-4">
              <label className="fw-bold text-secondary" htmlFor="role-name">
                Role Name *
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("role_name")}
                required
                className="text-danger mt-1"
                id="role-name"
              />
            </div>
            <div className="form-group text-start mb-3 col-lg-4">
              <label
                className="fw-bold text-secondary"
                htmlFor="role-description"
              >
                Description *
              </label>
              <TextInput
                size="lg"
                placeholder="Enter here"
                {...form.getInputProps("role_description")}
                required
                className="text-danger mt-1"
                id="role-description"
              />
            </div>
          </div>
          <div className=" mt-3 py-2 position-relative">
            <span className="menu-label">Menu</span>
            <div className="row menus-list-container">
              {menuList?.map((eachMenu) => (
                <div key={eachMenu.menu_id} className="col-md-6 col-lg-4 mb-4">
                  <div className=" rounded px-4 meunu-list-div">
                    <label
                      className="fw-bold text-dark my-3"
                      htmlFor="checkbox"
                    >
                      {eachMenu.label}
                    </label>
                    <Checkbox
                      iconColor="#de5631"
                      size="md"
                      className="mb-3"
                      label="Read"
                      checked={checkedMenus[eachMenu.menu_id]?.read || false}
                      onChange={() =>
                        handleCheckboxChange(eachMenu.menu_id, "read")
                      }
                    />
                    <Checkbox
                      iconColor="#de5631"
                      size="md"
                      className="mb-3"
                      label="Write"
                      checked={checkedMenus[eachMenu.menu_id]?.write || false}
                      onChange={() =>
                        handleCheckboxChange(eachMenu.menu_id, "write")
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {state?.rowData.role_id ? (
            <button
              className="btn add-button mt-3 mb-2"
              type="submit"
              style={{ color: "#fff" }}
            >
              Update
            </button>
          ) : (
            <button
              className="btn add-button mt-3 mb-2"
              type="submit"
              style={{ color: "#fff" }}
            >
              Add
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormRoleManagement;
