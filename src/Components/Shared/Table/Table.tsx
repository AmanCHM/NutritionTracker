import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  FoodDetail,
  LogData,
  MealItem,
} from "../../../Views/Dashboard/Dashboard";
import { COLSPAN_VALUE, MEALTYPE, NUTRIENT } from "../../../Shared/Constants";
import { LABEL } from "../../../Shared";
import colors from "../../../assets/Css/color";

interface TableProps {
  logData: LogData | undefined;
  handleNutritionModal: (foodDetail: FoodDetail) => void;

  handleEditLog: (
    meal: keyof LogData,
    name: string,
    id: number | string
  ) => void;

  handleDeleteLog: (meal: string, id: string) => void;
  showFeature: boolean;
}

const Table: React.FC<TableProps> = ({
  logData,
  handleNutritionModal,
  handleEditLog,
  handleDeleteLog,
  showFeature,
}) => {

  return (
    <>
      <section className="view-data">
        <div className="meal-log">
          <h2
            style={{
              marginTop: "2%",
              color: colors.greyColor3,
              fontSize: "2.5rem",
            }}
          >
            {" "}
            {LABEL.FOOD_DIARY}
          </h2>

          <div className="meal-section">
            <div>
              <label className="table-label">
                <strong>{MEALTYPE.BREAKFAST} </strong>
                {/* {breakfastCalorie} kcal */}
              </label>
            </div>

            <div>
              <table className="meal-table">
                <thead>
                  <tr>
                    <th>{LABEL.FOOD_NAME}</th>
                    <th>{NUTRIENT.PROTEIN_GM}</th>
                    <th>{NUTRIENT.CARBS_GM}</th>
                    <th>{NUTRIENT.FATS_GM}</th>
                    <th>{NUTRIENT.CALORIE_KCAL}</th>
                    {showFeature && <th>{LABEL.ACTION}</th>}
                  </tr>
                </thead>
                <tbody>
                  {logData?.Breakfast && logData.Breakfast.length > 0 ? (
                    logData.Breakfast.map((item, index) => (
                      <tr key={`breakfast-${index}`}>
                        <td>
                          <span onClick={() => handleNutritionModal(item)}>
                            <strong>
                              {" "}
                              {item.name?.charAt(0).toUpperCase() +
                                item.name?.slice(1)}
                            </strong>
                          </span>
                        </td>
                        <td>{item.proteins}</td>
                        <td>{item.carbs}</td>
                        <td>{item.fats}</td>
                        <td>{item.calories}</td>
                        {showFeature && (
                          <td>
                            <div style={{ display: "flex" }}>
                              <span
                                onClick={() =>
                                  handleDeleteLog("Breakfast", item.id)
                                }
                                className="icon-button delete"
                              >
                                <FaTrashAlt style={{ color: "#e15f41" }} />
                              </span>
                              <span
                                onClick={() =>
                                  handleEditLog("Breakfast", item.name, item.id)
                                }
                                className="icon-button edit"
                              >
                                <FaEdit />
                              </span>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={COLSPAN_VALUE}>{LABEL.NO_BREAKFAST}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="meal-section">
            <label className="table-label">
              <strong>{MEALTYPE.LUNCH} </strong>
              {/* {lunchCalorie} kcal */}
            </label>
            <table className="meal-table">
              <thead>
                <tr>
                  <th>{LABEL.FOOD_NAME}</th>
                  <th>{NUTRIENT.PROTEIN_GM}</th>
                  <th>{NUTRIENT.CARBS_GM}</th>
                  <th>{NUTRIENT.FATS_GM}</th>
                  <th>{NUTRIENT.CALORIE_KCAL}</th>
                  {showFeature && <th>{LABEL.ACTION}</th>}
                </tr>
              </thead>
              <tbody>
                {logData?.Lunch && logData?.Lunch?.length > 0 ? (
                  logData.Lunch.map((item, index) => (
                    <tr key={`lunch-${index}`}>
                      <td>
                        <span
                          // style={{ backgroundColor: "#0077b6" }}
                          onClick={() => handleNutritionModal(item)}
                        >
                          <strong>
                            {" "}
                            {item.name?.charAt(0).toUpperCase() +
                              item.name?.slice(1)}
                          </strong>
                        </span>
                      </td>
                      <td>{item.proteins}</td>
                      <td>{item.carbs}</td>
                      <td>{item.fats}</td>
                      <td>{item.calories}</td>

                      {showFeature && (
                        <td>
                          <div style={{ display: "flex" }}>
                            <span
                              onClick={() => handleDeleteLog("Lunch", item.id)}
                              className="icon-button delete"
                            >
                              <FaTrashAlt style={{ color: "#e15f41" }} />
                            </span>
                            <span
                              onClick={() =>
                                handleEditLog("Lunch", item.name, item.id)
                              }
                              className="icon-button edit"
                            >
                              <FaEdit />
                            </span>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={COLSPAN_VALUE}>{LABEL.NO_LUNCH}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="meal-section">
            <label className="table-label">
              <strong>{MEALTYPE.SNACK} </strong>
              {/* {snackCalorie} kcal */}
            </label>
            <table className="meal-table">
              <thead>
                <tr id="header-color">
                  <th>{LABEL.FOOD_NAME}</th>
                  <th>{NUTRIENT.PROTEIN_GM}</th>
                  <th>{NUTRIENT.CARBS_GM}</th>
                  <th>{NUTRIENT.FATS_GM}</th>
                  <th>{NUTRIENT.CALORIE_KCAL}</th>
                  {showFeature && <th>{LABEL.ACTION}</th>}
                </tr>
              </thead>
              <tbody>
                {logData?.Snack && logData?.Snack?.length > 0 ? (
                  logData.Snack.map((item, index) => (
                    <tr key={`snack-${index}`}>
                      <td>
                        <span
                          // style={{ backgroundColor: "#0077b6" }}
                          onClick={() => handleNutritionModal(item)}
                        >
                          <strong>
                            {" "}
                            {item.name?.charAt(0).toUpperCase() +
                              item.name?.slice(1)}
                          </strong>
                        </span>
                      </td>
                      <td>{item.proteins}</td>
                      <td>{item.carbs}</td>
                      <td>{item.fats}</td>
                      <td>{item.calories}</td>
                      {showFeature && (
                        <td>
                          <div style={{ display: "flex" }}>
                            <span
                              onClick={() => handleDeleteLog("Snack", item.id)}
                              className="icon-button delete"
                            >
                              <FaTrashAlt style={{ color: "#e15f41" }} />
                            </span>
                            <span
                              onClick={() =>
                                handleEditLog("Snack", item.name, item.id)
                              }
                              className="icon-button edit"
                            >
                              <FaEdit />
                            </span>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={COLSPAN_VALUE}>{LABEL.NO_SNACKS}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="meal-section">
            <label className="table-label">
              {" "}
              <strong>{MEALTYPE.DINNER}</strong>
              {/* {dinnerCalorie} kcal */}
            </label>
            <table className="meal-table">
              <thead>
                <tr>
                  <th>{LABEL.FOOD_NAME}</th>
                  <th>{NUTRIENT.PROTEIN_GM}</th>
                  <th>{NUTRIENT.CARBS_GM}</th>
                  <th>{NUTRIENT.FATS_GM}</th>
                  <th>{NUTRIENT.CALORIE_KCAL}</th>
                  {showFeature && <th>{LABEL.ACTION}</th>}
                </tr>
              </thead>
              <tbody>
                {logData?.Dinner && logData?.Dinner?.length > 0 ? (
                  logData.Dinner.map((item, index) => (
                    <tr key={`dinner-${index}`}>
                      <td>
                        <span
                          // style={{ backgroundColor: "#0077b6" }}/
                          onClick={() => handleNutritionModal(item)}
                        >
                          <strong>
                            {" "}
                            {item.name?.charAt(0).toUpperCase() +
                              item.name?.slice(1)}
                          </strong>
                        </span>
                      </td>
                      <td>{item.proteins}</td>
                      <td>{item.carbs}</td>
                      <td>{item.fats}</td>
                      <td>{item.calories}</td>
                      {showFeature && (
                        <td>
                          <div style={{ display: "flex" }}>
                            <span
                              onClick={() => handleDeleteLog("Dinner", item.id)}
                              className="icon-button delete"
                            >
                              <FaTrashAlt style={{ color: "#e15f41" }} />
                            </span>
                            <span
                              onClick={() =>
                                handleEditLog("Dinner", item.name, item.id)
                              }
                              className="icon-button edit"
                            >
                              <FaEdit />
                            </span>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={COLSPAN_VALUE}>{LABEL.NO_DINNER}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default Table;
