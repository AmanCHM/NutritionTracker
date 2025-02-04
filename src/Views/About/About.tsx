import React from "react";
import "./About.css";
import { ABOUT } from "../../Shared";
import colors from "../../assets/Css/color";

const About: React.FC = () => {
  const values = ABOUT.VALUE
  return (
    <div className="about-us">
      <header className="about-header">
        <h1>{ABOUT.HEADER}</h1>
      </header>

      <section className="about-section">
        <div className="about-content">
          <h2>{ABOUT.FIRST_PARA_HEADER}</h2>
          <p>{ABOUT.FIRST_PARA}</p>
          <h2>{ABOUT.SECOND_PARA_HEADER}</h2>
          <p>{ABOUT.SECOND_PARA}</p>

          <h2>{ABOUT.OUR_STORY_TITLE}</h2>
          <p>
           {ABOUT.OUR_STORY_PARA}
          </p>

          <h2 className="values-title">{ABOUT.LIST_TITLE}</h2>
          <ul className="values-list">
            {values.map((value, index) => (
              <li key={index} className="value-item">
                {value}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-team">
        <h2 style={{ color: colors.blackColor8 }}>{ABOUT.THIRD_PARA_HEADER}</h2>
        <p style={{ color: colors.blackColor9 }} >
          {ABOUT.THIRD_PARA}
        </p>
      </section>
    </div>
  );
};

export default About;
