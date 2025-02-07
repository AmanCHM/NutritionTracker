import React from "react";
import "./Footer.css";

import { CONTACT_DETAILS, LABEL } from "../../../../Shared";
import colors from "../../../../assets/Css/color";

const Footer: React.FC = () => {

const white = { color: colors.whiteColor }


  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo-section">
          <h3>{LABEL.APP_TITLE}</h3>
          <p style={white}>
           {LABEL.FOOTER_APP_DESCRIPTION}
          </p>
        </div>

        <div className="footer-section">
          <h4>{LABEL.QUICK_LABEL}</h4>  
        
        </div>

        <div className="footer-section">
          <h4>{CONTACT_DETAILS.TITLE}</h4>
          <div>
            {CONTACT_DETAILS.ADDRESS.map((line, index) => (
              <p key={index} style={white}>
                {line}
              </p>
            ))}
            <p style={white}>
              <i className={CONTACT_DETAILS.PHONE.ICON}></i>{" "}
              {CONTACT_DETAILS.PHONE.NUMBER}
            </p>
            <p style={white}>
              <i className={CONTACT_DETAILS.EMAIL.ICON}></i>{" "}
              {CONTACT_DETAILS.EMAIL.ADDRESS}
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p style={white}>&copy; {LABEL.COPY_RIGHT}</p>
      </div>
    </footer>
  );
};

export default Footer;
