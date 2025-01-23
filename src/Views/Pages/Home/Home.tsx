import React, { useState } from "react";
import "./LandingPage.css";

import { Link, NavLink, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { resetGoal } from "../../../Store/Nutrition";
import { ROUTES_CONFIG } from "../../../Shared/Constants";


interface RootState {
    loaderReducer: {
      loading: boolean;
    };
  }

const Home = () => {
  const islogged =  useSelector((state: RootState) => state.loaderReducer.loading);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = () => {
    dispatch(resetGoal());
    navigate(ROUTES_CONFIG.USER_INFO.path);
  };

  return (  
    <>
      <div className="landing-page">
        <section className="hero">
          <div className="content">
            <b style={{ color: "grey" }}>Welcome to Nutrition Tracker</b>
            <p>Track your meals and stay healthy!</p>
          </div>
        </section>

        <section className="signup">
          <div className="description">
            <h1 style={{ color: "grey" }}>
              {" "}
              Eat smarter, <br />
              Live better.
            </h1>

            <h4 style={{ color: "grey" }}>
              Track your calories, exercise,
              <br />
              biometrics and health data.
            </h4>
            {islogged ? (
              ""
            ) : (
              <button id="button" onClick={handleClick}>
                Let's Start
              </button>
            )}
          </div>
          {/* <div>
            <img
              id="front-image"
            
              src={
               Image.mobile
              }
              alt=""
            />
          </div> */}
        </section>
      </div>

      {/* <Feature />
      <Overview />
      <AIFeature />
      <Footer /> */}
    </>
  );
};

export default Home;
