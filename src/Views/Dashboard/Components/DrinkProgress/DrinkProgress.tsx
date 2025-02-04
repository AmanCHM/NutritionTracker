import React from 'react';
import { Progress } from 'rsuite';
import { FORM, LABEL } from '../../../../Shared';
import { DRINK_TYPE } from '../../../../Shared/Constants';
import colors from '../../../../assets/Css/color';
import { progressMargin } from '../../../../assets/Css/customStyle';
 // Replace with the actual import

type DrinkProgressProps = {
  totalWater: number ;
  requiredWater: number ;
  totalAlcohol: number;
  requiredAlcohol: number ;
  totalCaffeine: number;
  requiredCaffeine: number ;
};

const DrinkProgress: React.FC<DrinkProgressProps> = ({
  totalWater,
  requiredWater,
  totalAlcohol,
  requiredAlcohol,
  totalCaffeine,
  requiredCaffeine,
}) => {

  console.log("requiredwater",requiredWater);
  return (
    <div className="progress-line" style={{ height: "auto", width: "50vw", marginLeft: "25%" }}>
      <h2 style={{ marginTop: "2%", color: "darkgrey", fontSize: "2.0rem" }}>
       {LABEL.DRINK_PROGRESS}
      </h2>

      <div style={progressMargin}>
        <label htmlFor="">
          <strong> {DRINK_TYPE.WATER} </strong>
          {totalWater}/{requiredWater}{FORM.ML}
        </label>
        <Progress.Line
          percent={totalWater > 0 ? Math.floor((totalWater / (requiredWater )) * 100) : 0}
          status="active"
          strokeColor={colors.strokeColor_first}
        />
      </div>
      <div style={progressMargin}>
        <label htmlFor="">
          <strong> {DRINK_TYPE.ALCOHOL}</strong>
          {totalAlcohol}/{requiredAlcohol} {FORM.ML}
        </label>
        <Progress.Line
          percent={totalAlcohol > 0 ? Math.floor((totalAlcohol / (requiredAlcohol ) ) * 100) : 0}
          status="active"
          strokeColor={colors.strokeColor_second}
        />
      </div>
      <div style={progressMargin}>
        <label htmlFor="">
          <strong> {DRINK_TYPE.CAFFEINE} </strong>
          {totalCaffeine}/{requiredCaffeine}  {FORM.ML}
        </label>
        <Progress.Line
          percent={totalCaffeine > 0 ? Math.floor((totalCaffeine / (requiredCaffeine ))  * 100) : 0}
          status="active"
          strokeColor={colors.strokeColor_third}
        />
      </div>
    </div>
  );
};

export default DrinkProgress;