import React from 'react'

import "./Header.scss";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const scrollToSection = (target) => {
    if (target !== "") {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });

      }
    }
  };

  const navigate = useNavigate();

  const navigateToRegisteration = () => {
    navigate("/registration");

  };

  const handleNavLinkClick = (target) => {
    const isHomePage = window.location.pathname === "/";
    if (isHomePage) {
      scrollToSection(target);
    } else {
      navigate("/", {state: {scroll_section: target}});
    }
  };

  const navigateToHomepage = () => {
    navigate("/"); 
  }
  const redirectToLogin = () => {
    window.location.href = process.env.REACT_APP_ADMIN_APPLICATION_BASE_URL || 'http://localhost:3000'
  };
  return (
    <div>

      <nav class="navbar navbar-expand-sm navbar-dark headerSection">
        <div class="container-fluid">
          <div class="navbar-brand nav-logo d-flex align-items-center">
            <img src="./Assets/SchoolLogo1.png" alt=""  onClick={navigateToHomepage}/>
            <p className="pt-2" onClick={navigateToHomepage}>S.S.D. Convent School</p>
          </div>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="collapsibleNavbar">
            <ul class="navbar-nav nav-menu d-flex align-items-center pt-1">
              <li class="nav-item">
                <a onClick={() => handleNavLinkClick("about_us")}>About us</a>
              </li>
              <li class="nav-item">
                <a onClick={() => handleNavLinkClick("feature_section")}>Features</a>
              </li>
              <li class="nav-item">
                <a onClick={() => handleNavLinkClick("gallery_section")}>Gallery</a>
              </li>
              <li class="nav-item">
                <a onClick={() => handleNavLinkClick("contact_us")}>Contact us</a>
              </li>
            </ul>
            <div className="d-flex align-items-center mobileView">
            <button className="registerationBtn" onClick={navigateToRegisteration}>Registration</button>
            <button className="btn btn-danger loginBtn" onClick={redirectToLogin}>Login</button>
          </div>
          </div>
          <div className="school-login d-flex align-items-center desktopView">
            <button className="registerationBtn" onClick={navigateToRegisteration}>Registration</button>
            <button className="btn btn-danger loginBtn" onClick={redirectToLogin}>Login</button>
          </div>
        </div>
      </nav>


      {/* <div className="navbar d-flex justify-content-space-around">
        <div className="nav-logo d-flex align-items-center">
          <img src="./Assets/SchoolLogo1.png" alt="" />
          <p className="pt-2">S.S.D. Convent school</p>
        </div>
        <ul className="nav-menu d-flex align-items-center pt-1">
          <li>
            <NavLink onClick={() => scrollToSection("about_us")}>About us</NavLink>
          </li>
          <li>
            <NavLink onClick={() => scrollToSection("feature_section")}>Features</NavLink>
          </li>
          <li>
            <NavLink onClick={() => scrollToSection("gallery_section")}>Gallery</NavLink>
          </li>
          <li>
            <NavLink onClick={() => scrollToSection("contact_us")}>Contact us</NavLink>
          </li>
        </ul>
        <div className="school-login d-flex align-items-center">
          <button className="registerationBtn" onClick={navigateToRegisteration}>Registration</button>
          <button className="btn btn-danger loginBtn">Login</button>
        </div>
      </div> */}
    </div>
  )
}

export default Header;