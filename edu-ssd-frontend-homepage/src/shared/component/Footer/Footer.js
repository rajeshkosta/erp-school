import React from "react";
import "./Footer.scss";
import moment from 'moment';

const Footer = () => {
  console.log(moment())
  const currentYear = moment().format('YYYY');

  return (
    <footer>
    <div className="footer">
      <div className="footer-content">
        <img
          src="./Assets/footer-logo.svg"
          alt="School Logo"
          className="footer-img"
        />
        <div className="footer-title">S.S.D. Convent school</div>
        <div className="footer-address">Tulsi Nagar Dankaur (U.P.) India</div>
        <div className="footer-email">ssdconvent616@gmail.com</div>
        <div className="footer-phone">9012303041, 7017817055</div>
      </div>
    </div>
    <div className="container-fluid subFooter">
      <div className="container mt-0">
        <div className="row">
          <div className="col-md-8">
            <p>Copyright © {currentYear}. All right reserved</p>
          </div>
          {/* <div className="col-md-2">
            <p>Privacy Policy</p>
          </div>
          <div className="col-md-2">
            <p>Terms and conditions</p>
            </div> */}
        </div>
      </div>

    </div>
    </footer>
  );
};

export default Footer;
