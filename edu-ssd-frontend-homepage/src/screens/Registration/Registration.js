import React from "react";
import Header from "../../shared/component/Header/Header";
import BasicDetails from "./components/BasicDetails/BasicDetails";
import Footer from "../../shared/component/Footer/Footer";
import RegistrationHomepage from "./components/RegistrationHomepage/RegistrationHomepage";

const Registration = () => {
  return (
    <div>
     
      <RegistrationHomepage />
      <BasicDetails />
      <Footer />
    </div>
  );
};

export default Registration;
