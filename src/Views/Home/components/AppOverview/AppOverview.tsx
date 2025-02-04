import React from "react";
import "./AppOverview.css";
import OverviewCards from "../Cards/OverviewCard/OverviewCards";
import { HOME_PAGE } from "../../../../Shared";

interface OverviewCardsProps {
    header: string;
    description: string;
    image: string;
  }


const AppOverview = () => {
  return (
    <>
      <div className="overview">
        <span id="header">
          <h2 style={{fontSize:"2.5rem", color:"#737373"}}>{HOME_PAGE.APP_OVERVIEW.LABEL}</h2>
          <p style={{fontSize:"1.5rem" ,color:"#a3a3a3"}}>
           {HOME_PAGE.APP_OVERVIEW.DESCRIPTION}
          </p>
        </span>


        <div className="overview-cards">

          <div>
            <OverviewCards  className ="overview-innerCards"
              header="Track up to 82 micronutrients"
              description="Log your meals and track all your macro and micronutrients."
            />
          </div>
          <div>
            {" "}
            <OverviewCards className="overview-innerCards"
              header="Valuable reports and charts "
              description="Learn how nutrients and biometrics correlate over time."
            />
          </div>
          <div>
            {" "}
            <OverviewCards className="overview-innerCards"
              header="Log meals, exercise and biometrics"
              description="Plus, you can create custom foods, recipes, exercises and biometrics!"
            />
          </div>
          <div>
            {" "}
            <OverviewCards className="overview-innerCards"
              header="Track up to 82 micronutrients"
              description="Log your meals and track all your macro and micronutrients."
            />
          </div>
          <div>
            {" "}
            <OverviewCards className="overview-innerCards"
              header="AI enabled Image-search "
              description="Search meals via image & track all your macro and micronutrients."
            />
          </div>
          <div>
            <OverviewCards className="overview-innerCards"
              header="Track up to 82 micronutrients"
              description="Log your meals and track all your macro and micronutrients."
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AppOverview;