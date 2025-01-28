import React from 'react';
import { Progress } from 'rsuite';
 // Replace with the actual import

type DrinkProgressProps = {
  totalWater: number ;
  requiredWater: number;
  totalAlcohol: number;
  requiredAlcohol: number;
  totalCaffeine: number;
  requiredCaffeine: number;
};

const DrinkProgress: React.FC<DrinkProgressProps> = ({
  totalWater,
  requiredWater,
  totalAlcohol,
  requiredAlcohol,
  totalCaffeine,
  requiredCaffeine,
}) => {
  return (
    <div className="progress-line" style={{ height: "auto", width: "50vw", marginLeft: "25%" }}>
      <h2 style={{ marginTop: "2%", color: "darkgrey", fontSize: "2.0rem" }}>
        Today's Drink Progress Report
      </h2>

      <div style={{ margin: "20px 20px" }}>
        <label htmlFor="">
          <strong> Water : </strong>
          {totalWater}/{requiredWater} ml
        </label>
        <Progress.Line
          percent={totalWater > 0 ? Math.floor((totalWater / requiredWater) * 100) : 0}
          status="active"
          strokeColor="#e15f41"
        />
      </div>
      <div style={{ margin: "20px 20px" }}>
        <label htmlFor="">
          <strong> Alcohol: </strong>
          {totalAlcohol}/{requiredAlcohol} ml
        </label>
        <Progress.Line
          percent={totalAlcohol > 0 ? Math.floor((totalAlcohol / requiredAlcohol) * 100) : 0}
          status="active"
          strokeColor="#55a630"
        />
      </div>
      <div style={{ margin: "20px 20px" }}>
        <label htmlFor="">
          <strong> Caffeine: </strong>
          {totalCaffeine}/{requiredCaffeine} ml
        </label>
        <Progress.Line
          percent={totalCaffeine > 0 ? Math.floor((totalCaffeine / requiredCaffeine) * 100) : 0}
          status="active"
          strokeColor="#007bff"
        />
      </div>
    </div>
  );
};

export default DrinkProgress;