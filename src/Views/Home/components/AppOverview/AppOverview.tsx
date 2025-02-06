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
              header={HOME_PAGE.APP_OVERVIEW.FIRST_CARDS.HEADER}
              description={HOME_PAGE.APP_OVERVIEW.FIRST_CARDS.DESCRIPTION}
            />
          </div>
          <div>
            {" "}
            <OverviewCards className="overview-innerCards"
             header={HOME_PAGE.APP_OVERVIEW.SECOND_CARDS.HEADER}
             description={HOME_PAGE.APP_OVERVIEW.SECOND_CARDS.DESCRIPTION}
            />
          </div>
          <div>
            {" "}
            <OverviewCards className="overview-innerCards"
            header={HOME_PAGE.APP_OVERVIEW.THIRD_CARDS.HEADER}
            description={HOME_PAGE.APP_OVERVIEW.THIRD_CARDS.DESCRIPTION}
            />
          </div>
          <div>
            {" "}
            <OverviewCards className="overview-innerCards"
             header={HOME_PAGE.APP_OVERVIEW.FOURTH_CARDS.HEADER}
             description={HOME_PAGE.APP_OVERVIEW.FOURTH_CARDS.DESCRIPTION}
            />
          </div>
          <div>
            {" "}
            <OverviewCards className="overview-innerCards"
              header={HOME_PAGE.APP_OVERVIEW.FIFTH_CARDS.HEADER}
              description={HOME_PAGE.APP_OVERVIEW.FIFTH_CARDS.DESCRIPTION}
            />
          </div>
          <div>
            <OverviewCards className="overview-innerCards"
             header={HOME_PAGE.APP_OVERVIEW.SIXTH_CARDS.HEADER}
             description={HOME_PAGE.APP_OVERVIEW.SIXTH_CARDS.DESCRIPTION}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AppOverview;