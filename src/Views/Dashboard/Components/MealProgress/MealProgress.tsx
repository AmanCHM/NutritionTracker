import React from 'react'
import { Progress } from 'rsuite';
import { progressMargin } from '../../../../assets/Css/customStyle';
import colors from '../../../../assets/Css/color';
import { FORM, LABEL, MEAL_TERMS } from '../../../../Shared';
import { MEALTYPE, NUTRIENT } from '../../../../Shared/Constants';


type MealProgressProps= {
    totalCalories: number;
    dailyCalorie: number |null;
    progressPercent: number;
    totalProtein: number;
    proteinGrams: number;
    proteinPercentage: number;
    totalCarbs: number;
    carbsGrams: number;
    carbsPercentage: number;
    totalFats: number;
    fatsGrams: number;
    fatsPercentage: number;
    
}


const MealProgress: React.FC<MealProgressProps> = ( {totalCalories,dailyCalorie, progressPercent,totalProtein,proteinGrams,proteinPercentage,totalCarbs,carbsGrams,carbsPercentage,totalFats,fatsGrams,fatsPercentage}) => {

  
  return (
   <>
   <div
        className="progress-line"
        style={{ height: "auto", width: "50vw", marginLeft: "25%" }}
       >
        <h2 style={{ marginTop: "2%", color: "darkgrey", fontSize: "2.0rem" }}>
          {LABEL.MEAL_PROGRESS}
        </h2>
        <div style={progressMargin}>
          <label htmlFor="">
            <strong> Energy : </strong>
            {totalCalories}/{dailyCalorie} {FORM.KCAL}
          </label>

          <Progress.Line
            percent={progressPercent}
            status="active"
            strokeColor={colors.strokeColor_first}
          />
        </div>
        <div style={progressMargin}>
          <label htmlFor="">
            <strong> {NUTRIENT.PROTEIN} </strong>
            {totalProtein}/{proteinGrams}{FORM.GM}
          </label>
          <Progress.Line
            percent={proteinPercentage}
            status="active"
            strokeColor={colors.strokeColor_second}
          />
        </div>
        <div style={progressMargin}>
          <label htmlFor="">
            {" "}
            <strong> {NUTRIENT.CARBS} </strong>
            {totalCarbs}/{carbsGrams} {FORM.GM}
          </label>
          <Progress.Line
            percent={carbsPercentage}
            status="active"
            strokeColor={colors.strokeColor_third}
          />
        </div>
        <div style={progressMargin}>
          <label htmlFor="">
            {" "}
            <strong> {NUTRIENT.FATS} </strong>
            {totalFats}/{fatsGrams} {FORM.GM}
          </label>
          <Progress.Line
            percent={fatsPercentage}
            status="active"
            strokeColor={colors.strokeColor_fourth}
          />
        </div>
      </div>
   </>
  )
}

export default MealProgress;