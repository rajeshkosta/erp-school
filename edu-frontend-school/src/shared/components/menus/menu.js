import { Tooltip } from "@mantine/core";
import React, { useEffect, useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  HoverCard,
  NativeSelect,
  TextInput,
} from "@mantine/core";
import * as authService from "../../../screens/auth/auth.service";
import { useDisclosure } from "@mantine/hooks";
import {
  IconUsers,
  IconKey,
  IconArrowsDownUp,
  IconLayoutDashboard,
  IconCalendar,
  IconClockHour4,
  IconUserCircle,
  IconLogout,
  IconChevronRight,
} from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./menu.css";
import { IconChevronDown } from "@tabler/icons-react";
import { useAuth } from "../../../context/AuthContext";
import { getCombinedAccessControlList } from "../../../shared/services/common.service";
import moment from "moment";
import { useForm } from "@mantine/form";
import * as bootstrap from "bootstrap";
import { Popover } from "@mantine/core";
import ToastUtility from "../../../utility/ToastUtility";
import * as updateProfile from "../../../screens/ProfileScreen/Profile.service";

const Menus = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [opened, { close, open }] = useDisclosure(false);
  const [AcademicYear, ShowAcademicYear] = useState(true);
  const [AcademicYearList, setAcademicYearList] = useState([]);
  const [active, setActive] = useState("User Management");
  const [data, setData] = useState([]);
  const [menuLinks, setMenuLinks] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { userDetails, logout, addAcademicYearToContext } = useAuth();
  const date = moment().format("MMM Do YYYY");
  const time = moment().format("h:mma");
  const [currentYear, SetcurrentYear] = useState();
  const [sideMenuOpened, setSideMenuOpened] = useState(false);
  // const [menuexpend, setMenuExpend] = useState(false)
  const [userData, setUserData] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileView = window.innerWidth <= 767;
    setIsMobile(mobileView);
    setSideMenuOpened(mobileView);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userDetails) {
        try {
          const modules = userDetails.menu_permission;
          setData(modules);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      if (
        userDetails?.user_level === "Admin" ||
        userDetails?.user_level === "Trust"
      ) {
        ShowAcademicYear(false);
      } else {
        if (userDetails) {
          AcademicarrayList();
          await AcademicarrayList();
          await getDataByUserID(userDetails.user_id);
        }
      }
    };

    fetchData();
  }, [userDetails]);

  useEffect(() => {
    if (sideMenuOpened) {
      const links = data?.map((menuItem) =>
        menuItem.submenu
          ? renderItemWithSubmenu(menuItem)
          : renderItemWIthoutSubmenu(menuItem)
      );
      setMenuLinks(links);
      // setMenuExpend(current => !current)
    } else {
      const links = data?.map((menuItem) =>
        menuItem.submenu
          ? renderItemWithSubmenuOnCollapse(menuItem)
          : renderItemWIthoutSubmenuOnCollapse(menuItem)
      );
      setMenuLinks(links);
      // setMenuExpend(current => !current)
    }
  }, [sideMenuOpened, data, active]);

  const AcademicarrayList = () => {
    const currentAcademicYear = userDetails?.academic_year_data.find(
      (obj) => obj.current_academic_year == 1
    );
    setAcademicYearList(userDetails?.academic_year_data);
    SetcurrentYear(currentAcademicYear?.academic_year_id);
    if (currentAcademicYear) {
      addAcademicYearToContext(currentAcademicYear.academic_year_id);
    }
  };

  const handleAcademicYearChange = (event) => {
    if (event.target.value != "--Select Academic Year--") {
      SetcurrentYear(event.target.value);
      addAcademicYearToContext(event.target.value);
    }
  };

  const getDataByUserID = async (userID) => {
    const getUserByUserIdResponse = await updateProfile.getUserByUserId(userID);
    if (!getUserByUserIdResponse.error) {
      setUserData(getUserByUserIdResponse.data);
    } else {
      // ToastUtility.error("No data found for this User ID!");
    }
  };

  useEffect(() => {
    if (userDetails) {
      getDataByUserID(userDetails.user_id);
    }
  }, [userDetails]);

  const [openSubmenu, setOpenSubmenu] = useState(null);

  const closeSideMenuForMobile = () => {
    document.querySelector(".mantine-Burger-root").click();
  };

  const renderItemWIthoutSubmenu = (menuItem) => (
    <li key={menuItem.label} className="nav-item">
      <Link
        to={menuItem.link}
        className="link nav-link"
        data-active={menuItem.link === location.pathname || undefined}
        key={menuItem.label}
        onClick={() => {
          closeSideMenuForMobile();
          setActive(menuItem.label);
          closeAllOpenedSubmenus();
        }}
      >
        <img
          src={"/Assets/menu/" + menuItem.icon + ".png"}
          alt={menuItem.icon}
          className="menu-image"
        />
        <span>{menuItem.label}</span>
      </Link>
    </li>
  );

  const renderItemWithSubmenu = (menuItem) => (
    <li
      key={menuItem.label}
      className="nav-item has-submenu"
      style={{ position: "relative" }}
    >
      <Link
        className="link nav-link"
        style={{ position: "relative" }}
        data-active={menuItem.link === location.pathname || undefined}
        key={menuItem.label}
        onClick={() => {
          setActive(menuItem.label);
          toggleSubmenu(menuItem?.label?.split(" ").join() + "_collapse"); // Close submenu when a main menu item is clicked
        }}
      >
        <img
          src={"/Assets/menu/" + menuItem.icon + ".png"}
          alt={menuItem.icon}
          className="menu-image"
        />
        <span>{menuItem.label}</span>
        <IconChevronDown
          style={{
            cursor: "pointer",
            position: "absolute",
            right: "0",
            width: "18px",
            height: "18px",
          }}
        />
      </Link>
      <ul
        className="submenu collapse"
        id={menuItem?.label?.split(" ").join() + "_collapse"}
      >
        {menuItem?.submenu?.map((submenu) => (
          <li key={submenu?.label}>
            <Link
              to={submenu.link}
              className="link nav-link"
              data-active={submenu.link === location.pathname || undefined}
              key={submenu?.label}
              onClick={() => {
                closeSideMenuForMobile();
                setActive(submenu?.label);
                closeAllOpenedSubmenus();
              }}
            >
              <img
                src={"/Assets/menu/" + submenu.icon + ".png"}
                alt={submenu.icon}
                className="menu-image"
              />
              <span>{submenu?.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );

  const renderItemWIthoutSubmenuOnCollapse = (menuItem) => (
    <li key={menuItem?.label} className="nav-item">
      <Link
        to={menuItem.link}
        className="link nav-link"
        data-active={menuItem.link === location.pathname || undefined}
        key={menuItem?.label}
        onClick={() => {
          closeSideMenuForMobile();
          setActive(menuItem?.label);
          closeAllOpenedSubMenusInCollapse();
        }}
      >
        <Tooltip
          label={menuItem?.label}
          color="red"
          arrowPosition="side"
          withArrow
          position="bottom"
        >
          <img
            src={"/Assets/menu/" + menuItem.icon + ".png"}
            alt={menuItem.icon}
            className="menu-image"
          />
        </Tooltip>
        {/* <span>{menuItem.label}</span> */}
      </Link>
    </li>
  );

  const renderItemWithSubmenuOnCollapse = (menuItem) => (
    <li
      key={menuItem?.label}
      className="nav-item has-submenu"
      style={{ position: "relative" }}
    >
      <Popover
        width={300}
        trapFocus
        position="right-start"
        withArrow
        shadow="md"
      >
        <Popover.Target>
          <Link
            className="link nav-link"
            style={{ position: "relative" }}
            data-active={menuItem.link === location.pathname || undefined}
            key={menuItem?.label}
            // data-bs-toggle="dropdown" aria-expanded="false"
            onClick={() => {
              setActive(menuItem?.label);
              // toggleSubmenuCollapse(menuItem.label.split(" ").join() + "_collapse"); // Close submenu when a main menu item is clicked
            }}
          >
            <Tooltip
              label={menuItem?.label}
              color="red"
              arrowPosition="side"
              withArrow
              position="bottom"
            >
              <img
                src={"/Assets/menu/" + menuItem.icon + ".png"}
                alt={menuItem.icon}
                className="menu-image"
                // title={menuItem.label}
              />
            </Tooltip>
            <IconChevronRight
              style={{
                cursor: "pointer",
                position: "absolute",
                right: "0",
                width: "18px",
                height: "18px",
                left: "30px",
              }}
            />
          </Link>
        </Popover.Target>
        <Popover.Dropdown>
          <ul id={menuItem?.label?.split(" ").join() + "_collapse"}>
            {menuItem?.submenu?.map((submenu) => (
              <li key={submenu?.label}>
                <Link
                  to={submenu.link}
                  className="link nav-link"
                  data-active={submenu.link === location.pathname || undefined}
                  key={submenu?.label}
                  onClick={() => {
                    closeSideMenuForMobile();
                    setActive(submenu?.label);
                    closeAllOpenedSubMenusInCollapse();
                  }}
                >
                  <Tooltip
                    label={menuItem?.label}
                    color="red"
                    arrowPosition="side"
                    withArrow
                    position="bottom"
                  >
                    <img
                      src={"/Assets/menu/" + submenu.icon + ".png"}
                      alt={submenu.icon}
                      className="menu-image"
                      // title={menuItem.label}
                    />
                  </Tooltip>
                  <span>{submenu?.label}</span>
                </Link>
              </li>
              // <li key={submenu.label}><button className="dropdown-item" type="button">Action</button></li>
            ))}
          </ul>
        </Popover.Dropdown>
      </Popover>
    </li>
  );

  const logOut = async () => {
    const logoutResponse = await authService.logout();

    if (logoutResponse) {
      logout();
      navigate("/login");
    }
  };

  const profile = async () => {
    navigate("/profile/view");
  };

  const form = useForm({
    initialValues: {
      academic_year: currentYear?.academic_year_id,
    },
  });

  const closeAllOpenedSubMenusInCollapse = () => {
    // const menuUl = document.getElementById("nav_accordion");
    // var opened_submenu = menuUl.querySelector(".dropdown-menu.show");
    // if (opened_submenu) {
    //   new bootstrap.Collapse(opened_submenu);
    // }
    setTimeout(() => {
      close();
    }, 100);
  };

  const toggleSubmenuCollapse = (id) => {
    // const collapseEl = document.getElementById(id);
    // let mycollapse = new bootstrap.Collapse(collapseEl);
    closeAllOpenedSubMenusInCollapse();
  };

  const toggleSubmenu = (id) => {
    document.querySelectorAll(".submenu.collapse[style]").forEach((el) => {
      el.removeAttribute("style");
    });
    const collapseEl = document.getElementById(id);
    let mycollapse = new bootstrap.Collapse(collapseEl);
    closeAllOpenedSubmenus();
  };

  const closeAllOpenedSubmenus = () => {
    const menuUl = document.getElementById("nav_accordion");
    var opened_submenu = menuUl.querySelector(".submenu.show");
    if (opened_submenu) {
      new bootstrap.Collapse(opened_submenu);
    }
  };

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{
        width: sideMenuOpened ? 250 : 70,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group
          h="100%"
          px="md"
          className="d-flex justify-content-between align-items-center"
        >
          <div>
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
            />
            {/* <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
            /> */}
            {/* <img className="burgerLoMenu" opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm" src="./Assets/right-arrow-circle.svg" alt="school-logo" /> */}
            {userDetails?.logo_url_cdn ? (
              <img
                className="menu-image"
                src={userDetails?.logo_url_cdn}
                alt="school-logo"
              />
            ) : (
              <img
                className="menu-image"
                src="/Assets/SchoolLogoNew.png"
                alt="school-logo"
              />
            )}

            {/* <span className="fw-bold mobileView" style={{ marginLeft: "10px" }}>
              EduEZE
            </span> */}
          </div>
          <div className="header-profile-container">
            {AcademicYear ? (
              <div className="d-flex align-items-center">
                {/* <span className="mobileView">Academic session</span> */}
                <NativeSelect
                  {...form.getInputProps("academic_year")}
                  id="academic_year_id"
                  value={currentYear}
                  onChange={handleAcademicYearChange}
                  className="mobilePosition"
                >
                  <option>--Select Academic Year--</option>
                  {AcademicYearList?.map((academicyear) => (
                    <option
                      key={academicyear.academic_year_id}
                      value={academicyear.academic_year_id}
                    >
                      {academicyear.academic_year_name}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            ) : null}
            <div
              className="d-flex align-items-center dateSection"
              style={{
                marginLeft: "20px",
                marginRight: "20px",
                color: "grey",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              <IconCalendar color="grey" size={18} />
              <span style={{ marginLeft: "5px" }}>{date}</span>
            </div>

            <div className="d-flex align-items-center">
              {userDetails?.profile_pic_cdn ? (
                <img
                  src={userDetails?.profile_pic_cdn}
                  alt="profile"
                  className=""
                  style={{ borderRadius: "50%", width: "50px" }}
                />
              ) : (
                <img
                  src="/images/profile.png"
                  alt="profile"
                  className="profilePic"
                />
              )}
              <div className="d-flex flex-column align-items-start">
                <span className="fw-bold profile-name">
                  {userDetails?.display_name}
                  {/* {userDetails?.display_name} */}
                </span>
                <span
                  className="roleName"
                  style={{
                    paddingLeft: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  {userDetails?.role_name}
                  {/* {userDetails?.role_name} */}
                </span>
              </div>
              <HoverCard
                width={320}
                shadow="md"
                withArrow
                openDelay={200}
                closeDelay={400}
              >
                <HoverCard.Target>
                  <IconChevronDown
                    className="removeIcon"
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  />
                </HoverCard.Target>
                <HoverCard.Dropdown position="bottom-end">
                  <Group className="d-flex flex-column align-items-center justify-content-center mt-3">
                    <div
                      className="d-flex align-items-center "
                      style={{ color: "grey" }}
                    >
                      <IconUserCircle size={20} />
                      <span
                        style={{
                          cursor: "pointer",
                          marginLeft: "5px",
                          width: "100px",
                        }}
                        onClick={() => profile()}
                      >
                        Profile
                      </span>
                    </div>
                    <div
                      className="d-flex align-items-center "
                      style={{ color: "grey" }}
                    >
                      <IconLogout size={20} />
                      <span
                        style={{
                          cursor: "pointer",
                          marginLeft: "5px",
                          width: "100px",
                        }}
                        onClick={() => logOut()}
                      >
                        Logout
                      </span>
                    </div>
                  </Group>
                </HoverCard.Dropdown>
              </HoverCard>
            </div>
          </div>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {/* <div className="mt-4"> {links}</div> */}

        <aside className="siebarMenuSection">
          <>
            {!isMobile && (
              <button
                className={` btnburgerLoMenu ${
                  sideMenuOpened ? "menuRotate" : ""
                }`}
                opened={desktopOpened}
                onClick={() => {
                  // toggleDesktop();
                  setSideMenuOpened(!sideMenuOpened);
                }}
                visibleFrom="sm"
              >
                <img src="/Assets/align-left.svg" alt="school-logo" />
              </button>
            )}

            <ul className="nav flex-column" id="nav_accordion">
              {menuLinks}
            </ul>
          </>
        </aside>
      </AppShell.Navbar>
    </AppShell>
  );
};

export default Menus;
