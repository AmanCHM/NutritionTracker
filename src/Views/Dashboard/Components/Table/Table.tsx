import React from "react";
import { FoodDetail, LogData } from "../../../Views/Dashboard/Dashboard";
import { LABEL, MEALTYPE } from "../../../Shared";
import CustomTable from "../../../../Components/Shared/Table/Table";


interface TableProps {
  logData?: LogData;
  handleNutritionModal?: (foodDetail: FoodDetail) => void;
  handleEditLog?: (meal: keyof LogData, name: string, id: number | string) => void;
  handleDeleteLog?: (meal: keyof LogData, id: string) => void;
  showFeature?: boolean;
}

const Table: React.FC<TableProps> = ({
  logData,
  handleNutritionModal,
  handleEditLog,
  handleDeleteLog,
  showFeature = false,
}) => {
  return (
    <section className="view-data">
      <div className="meal-log">
        <h2 style={{ marginTop: "2%", color: "darkgrey", fontSize: "2.5rem" }}>
          {LABEL.FOOD_DIARY}
        </h2>

        {/* Reusing CustomTable for each meal type */}
        {Object.values(MEALTYPE).map((meal) => (
          <CustomTable
            key={meal}
            mealType={meal as keyof LogData}
            logData={logData}
            handleNutritionModal={handleNutritionModal}
            handleEditLog={handleEditLog}
            handleDeleteLog={handleDeleteLog}
            showFeature={showFeature}
          />
        ))}
      </div>
    </section>
  );
};

export default Table;
