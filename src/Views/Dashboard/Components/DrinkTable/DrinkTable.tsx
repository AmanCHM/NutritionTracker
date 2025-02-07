import React from "react";
import { FaEdit } from "react-icons/fa";
import { FORM, IMAGES, LABEL } from "../../../../Shared";
import { DRINK_TYPE } from "../../../../Shared/Constants";
import { DRINK_TABLE_STYLE } from "../../../../assets/Css/customStyle";
import { Drink } from "../../Dashboard";


interface DrinkTableProps {
  totalWater: number |undefined;
  totalAlcohol: number | undefined;
  totalCaffeine: number | undefined;
  handleUpdateDrink: (drink: Drink) => void;
}

const drinkType = {
    water: { drinklabel: DRINK_TYPE.WATER },
    caffeine: { drinklabel: DRINK_TYPE.CAFFEINE },
    alcohol: { drinklabel: DRINK_TYPE.ALCOHOL },
  };

  const style= {padding: "12px", border: "1px solid #ddd" }
const DrinkTable: React.FC<DrinkTableProps> = ({
  totalWater,
  totalAlcohol,
  totalCaffeine,
  handleUpdateDrink,
}) => {
  return (
   
      <div style={{ width: "100%", margin: "20px auto" }}>
          <table
            style={{
                width: "40%",
                borderCollapse: "collapse",
                textAlign: "center",
                fontSize: "1rem",
                color: "#2c3e50",
                marginTop: "10px",
                marginLeft: "30%",
                borderRadius: "2px",
              }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f4f6f7" }}>
                <th
                  style={DRINK_TABLE_STYLE}
                >
                  {LABEL.DRINK}
                </th>
                <th
                  style={DRINK_TABLE_STYLE}
                >
                 {LABEL.DRINK_QUANTITY}
                </th>
                <th
                  style={DRINK_TABLE_STYLE}
                >
                {LABEL.ACTION}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={style}>
                  <img
                    src={IMAGES.water}
                    alt="Water"
                    style={{ height: "60px" }}
                  />
                  <p style={{ margin: "2px 0", fontWeight: "bold" }}>{DRINK_TYPE.WATER}</p>
                </td>
                <td style={style}>
                  {totalWater} {FORM.ML}
                </td>
                <td>
                  <div style={{ display: "flex" }}>
                    <span
                      onClick={() => handleUpdateDrink( drinkType.water )}
                      className="icon-button edit"
                    >
                      <FaEdit />
                    </span>
                  </div>
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f9f9f9" }}>
                <td style={style}>
                  <img
                    src={IMAGES.beer}
                    alt="Alcohol"
                    style={{ height: "60px" }}
                  />
                  <p style={{ margin: "2px 0", fontWeight: "bold" }}>{DRINK_TYPE.ALCOHOL}</p>
                </td>
                <td style={style}>
                  {totalAlcohol} {FORM.ML}
                </td>
                <td>
                  <div style={{ display: "flex" }}>
                    <span
                      onClick={() => handleUpdateDrink(drinkType.alcohol)}
                      className="icon-button edit"
                    >
                      <FaEdit />
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={style}>
                  <img
                    src={IMAGES.coffee}
                    alt="Caffeine"
                    style={{ height: "60px" }}
                  />
                  <p style={{ margin: "2px 0", fontWeight: "bold" }}>
                    {DRINK_TYPE.CAFFEINE}
                  </p>
                </td>
                <td style={style}>
                  {totalCaffeine} {FORM.ML}
                </td>
                <td>
                  <div style={{ display: "flex" }}>
                    <span
                      onClick={() => handleUpdateDrink(drinkType.caffeine)}
                      className="icon-button edit"
                    >
                      <FaEdit />
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
    </div>
  );
};

export default DrinkTable;
