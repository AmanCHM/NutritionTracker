import React from 'react'
import { Progress } from 'rsuite';


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

  // console.log("total Calorires",dailyCalorie)
  return (
   <>
   <div
        className="progress-line"
        style={{ height: "auto", width: "50vw", marginLeft: "25%" }}
       >
        <h2 style={{ marginTop: "2%", color: "darkgrey", fontSize: "2.0rem" }}>
          Today Meal Progress Report
        </h2>
        <div style={{ margin: "20px 20px" }}>
          <label htmlFor="">
            <strong> Energy : </strong>
            {totalCalories}/{dailyCalorie} kcal
          </label>

          <Progress.Line
            percent={progressPercent}
            status="active"
            strokeColor="#e15f41"
          />
        </div>
        <div style={{ margin: "20px 20px" }}>
          <label htmlFor="">
            <strong> Protein: </strong>
            {totalProtein}/{proteinGrams}g
          </label>
          <Progress.Line
            percent={proteinPercentage}
            status="active"
            strokeColor="#55a630"
          />
        </div>
        <div style={{ margin: "20px 20px" }}>
          <label htmlFor="">
            {" "}
            <strong> Carbs </strong>
            {totalCarbs}/{carbsGrams} g
          </label>
          <Progress.Line
            percent={carbsPercentage}
            status="active"
            strokeColor="355070"
          />
        </div>
        <div style={{ margin: "20px 20px" }}>
          <label htmlFor="">
            {" "}
            <strong> Fat: </strong>
            {totalFats}/{fatsGrams} g
          </label>
          <Progress.Line
            percent={fatsPercentage}
            status="active"
            strokeColor="#52b788"
          />
        </div>
      </div>
   </>
  )
}

export default MealProgress;