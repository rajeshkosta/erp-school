import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CommanGrid from "../../../../shared/components/GridTable/CommanGrid";
import "./UserListComponent.css";
import { useNavigate } from "react-router-dom";
import {
  IconEye,
  IconPencil,
  IconCircle,
  IconKey,
  IconUser,
} from "@tabler/icons-react";
import * as gettingUserManagementService from "../../UserManagement.service";
import { Tooltip } from "@mantine/core";
import { encrypt } from "../../../../utility/EncrytDecrypt";
import ToastUtility from "../../../../utility/ToastUtility";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Group } from "@mantine/core";

const UserListComponent = () => {
  const [grid, setGrid] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userData, setUserData] = useState({});

  const getAllUsersList = async () => {
    const payload = {
      pageSize: 20,
      currentPage: 0,
    };

    const response = await gettingUserManagementService.getAllUsers(payload);
    setGrid(response?.data?.data);
  };

  useEffect(() => {
    getAllUsersList();
  }, []);

  const gridData = [...grid];

  const gridColumns = [
    { field: "display_name", header: "Name", width: "30%", sortable: true },
    { field: "role_name", header: "Role", width: "20%", sortable: true },
    {
      field: "mobile_number",
      header: "Mobile Number",
      width: "18%",
      sortable: true,
    },
    { field: "email_id", header: "Email id", width: "23%", sortable: true },
  ];

  const handleAction = (rowData) => {
    console.log(rowData);

    navigate("/usermanagement/edit", {
      state: {
        rowData: rowData,
      },
    });
  };

  const handleIconClick = async (user_id) => {
    // const hashedUserId = await encrypt(user_id);
    const payload = {
      user_id: user_id.user_id,
    };
    console.log(payload);

    const defaultPasswordResponse =
      await gettingUserManagementService.defaultPassword(payload);
    if (!defaultPasswordResponse.error) {
      ToastUtility.success("Password reset successfully");

      // navigate("/login");
    } else {
      // ToastUtility.error(defaultPasswordResponse?.errorMessage.response.data.error);
    }
  };

  const handleUserClick = async (rowData) => {
    setOpened(true);
    setUserData(rowData);
  };

  const closeModal = () => {
    setOpened(false);
  };

  const handleNo = () => {
    setOpened(false);
  };

  const handleYes = async (userData) => {
    // setIsDialogOpen(false);
    const payload = {
      user_id: userData.user_id,
    };
    console.log(payload);

    const updateUserStatusResponse =
      await gettingUserManagementService.updateUserStatus(payload);

    if (!updateUserStatusResponse.error) {
      setOpened(false);
      // console.log(updateUserStatusResponse.data.message);
      const message =
        userData.is_active === 1
          ? "User Deactivated  Successfully"
          : "User Activated  Successfully";

      ToastUtility.success(message);
      getAllUsersList();
    } else
      ToastUtility.error(updateUserStatusResponse?.errorMessage.response.error);
  };

  const actionButton = (rowData) => {
    return (
      <div className="d-flex justify-content-between align-items-center w-75">
        <Tooltip
          label="Edit"
          color="#DB3525"
          arrowSize={6}
          withArrow
          position="top"
        >
          <IconPencil
            onClick={() => handleAction(rowData)}
            color="grey"
            size={20}
            style={{ cursor: "pointer", width: "60px" }}
          />
        </Tooltip>
        <Tooltip
          label="Default Password"
          color="#DB3525"
          arrowSize={6}
          withArrow
          position="top"
        >
          <IconKey
            onClick={() => handleIconClick(rowData)}
            color="grey"
            size={23}
            style={{ cursor: "pointer", marginRight: "3px", width: "60px" }}
          />
        </Tooltip>

        <Tooltip
          label={` ${rowData.is_active === 1 ? "Active" : "Inactive"}`}
          color="#DB3525"
          arrowSize={6}
          withArrow
          position="top"
        >
          <IconUser
            onClick={() => handleUserClick(rowData)}
            color={rowData.is_active === 1 ? "green" : "red"}
            size={23}
            style={{ cursor: "pointer", marginRight: "30px", width: "60px" }}
          />
        </Tooltip>
      </div>
    );
  };

  return (
    <div>
      <div>
        <Modal
          opened={opened}
          onClose={closeModal}
          title=" " centered
        >
          <div>
          <h1 className="heading-status"> {`Are you sure you want to ${
            userData.is_active === 1 ? "deactivate" : "activate"
          } this user?`}  </h1>

            {/* <Button
              onClick={() => handleYes(userData)}
              style={{ margin: "20px auto", display: "inline-block" }}
            >
              Yes
            </Button>
            <Button
              onClick={() => handleNo()}
              style={{ margin: "20px auto", display: "inline-block" }}
            >
              No
            </Button> */}

<Group mt="xl" 
style={{justifyContent:"center"}}>
          <Button  onClick={() => handleYes(userData)}
           style={{ margin: "0px", display: "block" , backgroundColor:"#db3525", border:"1px solid #db3525 " }}>Yes</Button>
          <Button  onClick={() => handleNo()}
           style={{ margin: "0px", display: "inline-block", backgroundColor:"transparent", color: "#db3525", border:"1px solid #db3525" }}>No</Button>
        </Group>
          </div>
        </Modal>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 userManagementSection">
        <span className="fw-bold" style={{ fontSize: "20px" }}>
          Staff Management
        </span>
        <button
          className="btn add-button"
          onClick={() => navigate("/usermanagement/add")}
          style={{ color: "#fff" }}
        >
          Add Staff
          {/* <Link
            to="/usermanagement/add"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            Add Staff
          </Link> */}
        </button>
      </div>
      <CommanGrid
        columns={gridColumns}
        data={gridData}
        paginator
        actionButton={actionButton}
        rows={10}
        rowsPerPageOptions={[10, 20, 30]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} "
      />
    </div>
  );
};

export default UserListComponent;
