import React from "react";

import "./AppFeature.css";
import FeatureCards from "../Cards/FeatureCard/FeatureCards";
import { HOME_PAGE, IMAGES } from "../../../../Shared";
import colors from "../../../../assets/Css/color";


const AppFeature = () => {
  return (
    <div> 
       <div className="feature">
        <div className="feature-header" >
        <label style={{ fontSize: "32px", color: colors.whiteColor}}> 
       {HOME_PAGE.APP_FEATURE.LABEL}
          </label>
        <p style={{ fontSize: "18px", color: "#a3a3a3" }}>
          {" "}
         {HOME_PAGE.APP_FEATURE.GREET}
        </p>
      </div>
      <div className="feature-component">
        <img
          id="feature-image"
          src={IMAGES.feature}
          alt="feature"
        />
        <div id="feature-card">

      
          <FeatureCards
            header={HOME_PAGE.APP_FEATURE.FIRST_CARDS.HEADER}
            description= {HOME_PAGE.APP_FEATURE.FIRST_CARDS.DESCRITION}        />
          <FeatureCards
            header={HOME_PAGE.APP_FEATURE.SECOND_CARDS.HEADER}
            description={HOME_PAGE.APP_FEATURE.SECOND_CARDS.DESCRITION}         />
          <FeatureCards
            header={HOME_PAGE.APP_FEATURE.THIRD_CARDS.HEADER}
            description={HOME_PAGE.APP_FEATURE.THIRD_CARDS.DESCRITION}          />
        </div>
      </div>

      </div>
    </div>
  );
};

export default AppFeature;