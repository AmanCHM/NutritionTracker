import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// Import RootState type
import { Link, useNavigate } from "react-router-dom";
;
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RootState } from "../../../Store";
import { updateGoal } from "../../../Store/Nutrition";
import CustomSelect from "../../../Components/Shared/CustomSelect/CustomSelect";
import { GOAL_OPTIONS, ROUTES_CONFIG, WEIGHT, WEIGHT_VALIDATION } from "../../../Shared/Constants";
import CustomButton from "../../../Components/Shared/CustomButton/CustomButton";
import { ERROR_MESSAGES, FORM_VALIDATION_MESSAGES, GREETINGS, LABEL, USER } from "../../../Shared";


// Define form values type
interface WeightFormValues {
  goal: string;
  currentWeight: number;
  targetWeight: number;
}

const WeightInput: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get values from Redux store with type safety
  const currentWeight = useSelector(
    (state: RootState) => state.Nutrition.currentWeight
  );
  const targetWeightRedux = useSelector(
    (state: RootState) => state.Nutrition.targetWeight
  );
  const goalOption = useSelector(
    (state: RootState) => state.Nutrition.goal
  );

  // Goal options
  const goalOptions = [
GOAL_OPTIONS.LOOSE_WEIGHT,
GOAL_OPTIONS.GAIN_WEIGHT,
GOAL_OPTIONS.MAINTAIN_WEIGHT
  ];

  // Formik setup
  const formik = useFormik<WeightFormValues>({
    initialValues: {
      goal: goalOption || "",
      currentWeight: currentWeight ,
      targetWeight: targetWeightRedux ,
    },
    validationSchema: Yup.object({
      goal: Yup.string().required(FORM_VALIDATION_MESSAGES().REQUIRED),
      currentWeight: Yup.number()
      .typeError(WEIGHT_VALIDATION.CURRENT_WEIGHT.TYPE_ERROR)
      .min(1, WEIGHT_VALIDATION.CURRENT_WEIGHT.MIN)
      .required(WEIGHT_VALIDATION.CURRENT_WEIGHT.REQUIRED),
  
    targetWeight: Yup.number()
      .typeError(WEIGHT_VALIDATION.TARGET_WEIGHT.TYPE_ERROR)
      .min(1, WEIGHT_VALIDATION.TARGET_WEIGHT.MIN)
      .required(WEIGHT_VALIDATION.TARGET_WEIGHT.REQUIRED),
    }),
    onSubmit: (values) => {
      const weightDifference = Number(values.targetWeight) - Number(values.currentWeight);

      if (values.goal === WEIGHT.LOOSE_WEIGHT && weightDifference > 0) {
        toast.error(ERROR_MESSAGES().TARGET_LESS_THAN_CURRENT);
        return;
      }
      if (values.goal === WEIGHT.GAIN_WEIGHT && weightDifference < 0) {
        toast.error(ERROR_MESSAGES().TARGET_MORE_THAN_CURRENT);
        return;
      }
      if (values.goal === WEIGHT.MAINTAIN_WEIGHT && weightDifference !== 0) {
        toast.error(ERROR_MESSAGES().TARGET_EQUAL);
        return;
      }

      dispatch(
        updateGoal({
          goal: values.goal,
          currentWeight: values.currentWeight,
          targetWeight: values.targetWeight,
          weightDifference,
        })
      );

      navigate(ROUTES_CONFIG.INPUT_WORKOUT.path);
    },
  });

  // Auto-set target weight if maintaining weight
  useEffect(() => {
    if (formik.values.goal === "Maintain Weight") {
      formik.setFieldValue("targetWeight", formik.values.currentWeight);
    }
  }, [formik.values.goal, formik.values.currentWeight]);

  return (
    <>
      <h3
        style={{
          fontSize: "2.3rem",
          color: "#737373",
          textAlign: "center",
          marginTop: "3%",
        }}
      >
       {GREETINGS.GOAl_GREET}
      </h3>
      <h3 style={{ textAlign: "center", color: "#627373" }}>
        {LABEL.SELECT_GOAL_HEAD}
      </h3>
      <div className="calorie-container">
        <form onSubmit={formik.handleSubmit}>
          {/* Goal Selection */}
          <div className="input-group">
            <label htmlFor="goal">{LABEL.SELECT_GOAL}</label>
            <CustomSelect
              options={goalOptions}
              value={goalOptions.find((option) => option.value === formik.values.goal)|| null}
              onChange={(selectedOption) =>
                formik.setFieldValue("goal", selectedOption?.value)
              }
              onBlur={() => formik.setFieldTouched("goal", true)}
            />
            {formik.touched.goal && formik.errors.goal && (
              <p className="error-message">{formik.errors.goal}</p>
            )}
          </div>

          {/* Current Weight */}
          <div className="input-group">
            <label htmlFor="currentWeight">{USER.CURR_WEIGHT}</label>
            <input
              type="number"
              id="currentWeight"
              min="1"
              value={formik.values.currentWeight || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your current weight"
            />
            {formik.touched.currentWeight && formik.errors.currentWeight && (
              <p className="error-message">{formik.errors.currentWeight}</p>
            )}
          </div>

          {/* Target Weight */}
          <div className="input-group">
            <label htmlFor="targetWeight">{USER.TARGET_WEIGHT}</label>
            <input
              type="number"
              id="targetWeight"
              min="1"
              value={formik.values.targetWeight || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your target weight"
              disabled={formik.values.goal === "Maintain Weight"}
            />
            {formik.touched.targetWeight && formik.errors.targetWeight && (
              <p className="error-message">{formik.errors.targetWeight}</p>
            )}
          </div>

          {/* Buttons */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
            >
           

            <CustomButton
            type="submit"
            size={"medium"}
            onClick={() =>  navigate(ROUTES_CONFIG.USER_INFO.path)}
            label={"Back"}
             >
            </CustomButton>
           
            <CustomButton
            type="submit"
            style={{ marginLeft: "60%" }}
            size={"medium"}
          
            label={"Next"}
             >
            
             </CustomButton>
          </div>
        </form>
      </div>
    </>
  );
};

export default WeightInput;
