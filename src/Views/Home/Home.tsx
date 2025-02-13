import React, { useCallback, useState } from "react";
import "./Home.css";

import { Link, NavLink, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { resetGoal } from "../../Store/Nutrition";
import { ROUTES_CONFIG } from "../../Shared/Constants";
import { RootState } from "../../Store";
import { GREETINGS, IMAGES } from "../../Shared";
import Feature from "./components/AppFeature/AppFeature";
import AppFeature from "./components/AppFeature/AppFeature";
import AppOverview from "./components/AppOverview/AppOverview";
import AIFeature from "./components/AIFeature/AIFeature";
import Footer from "../../Components/Layouts/Public/Footer";
import CustomButton from "../../Components/Shared/CustomButton/CustomButton";
import colors from "../../assets/Css/color";

const Home = () => {
  const islogged = useSelector((state: RootState) => state.Auth.logged);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    dispatch(resetGoal());
    navigate(ROUTES_CONFIG.USER_INFO.path);
  }, []);

  return (
    <>
      <div className="landing-page">
        <section className="hero">
          <div className="content">
            <b style={{ color: colors.greyColor3 }}>
              {GREETINGS.WELCOME_NUTRITRACK}
            </b>
            <p>{GREETINGS.TRACK_MEALS}</p>
          </div>
        </section>

        <section className="signup">
          <div className="description">
            <h1 style={{ color: colors.blackColor9 }}>
              {GREETINGS.EAT_SMARTER} <br />
              {GREETINGS.LIVE_BETTER}
            </h1>

            <h4 style={{ color: colors.greyColor3, paddingLeft: "10px" }}>
              {GREETINGS.TRACK_CALORIE}
              <br />
              {GREETINGS.BIOMETRIC_DATA}
            </h4>
            {islogged ? (
              ""
            ) : (
              <CustomButton
                type="submit"
                style={{
                  width: "200px",
                }}
                size={"large"}
                onClick={handleClick}
                label={"Let's Start"}
              ></CustomButton>
            )}
          </div>
          <div>
            <img id="front-image" src={IMAGES.mobile} alt="" />
          </div>
        </section>
      </div>

      <AppFeature />
      <AppOverview />
      <AIFeature />
    </>
  );
};

export default Home;
