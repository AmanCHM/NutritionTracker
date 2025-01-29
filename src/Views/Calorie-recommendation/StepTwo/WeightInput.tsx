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
import { ROUTES_CONFIG } from "../../../Shared/Constants";


// Define form values type
interface WeightFormValues {
  goal: string;
  currentWeight: number;
  targetWeight: number;
}

const WeightTracker: React.FC = () => {
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
    { value: "Loose Weight", label: "Loose Weight" },
    { value: "Gain Weight", label: "Gain Weight" },
    { value: "Maintain Weight", label: "Maintain Weight" },
  ];

  // Formik setup
  const formik = useFormik<WeightFormValues>({
    initialValues: {
      goal: goalOption || "",
      currentWeight: currentWeight || 0,
      targetWeight: targetWeightRedux || 0,
    },
    validationSchema: Yup.object({
      goal: Yup.string().required("Please select a goal."),
      currentWeight: Yup.number()
        .typeError("Must be a number")
        .min(1, "Current weight must be at least 1 kg.")
        .required("Please enter your current weight."),
      targetWeight: Yup.number()
        .typeError("Must be a number")
        .min(1, "Target weight must be at least 1 kg.")
        .required("Please enter your target weight."),
    }),
    onSubmit: (values) => {
      const weightDifference = Number(values.targetWeight) - Number(values.currentWeight);

      if (values.goal === "Loose Weight" && weightDifference > 0) {
        toast.error("Target weight must be less than current weight for weight loss.");
        return;
      }
      if (values.goal === "Gain Weight" && weightDifference < 0) {
        toast.error("Target weight must be greater than current weight for weight gain.");
        return;
      }
      if (values.goal === "Maintain Weight" && weightDifference !== 0) {
        toast.error("Target weight must equal current weight for maintenance.");
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
      {/* <Navbar /> */}
      <h3 className="text-center mt-3 text-gray-600 text-2xl">
        Thanks! Now for your goals.
      </h3>
      <h3 className="text-center text-gray-500">
        Select your goal and provide your target weights.
      </h3>
      
      <div className="calorie-container">
        <form onSubmit={formik.handleSubmit}>
          {/* Goal Selection */}
          <div className="input-group">
            <label htmlFor="goal">Select Goal:</label>
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
            <label htmlFor="currentWeight">Current Weight (kg)</label>
            <input
              type="number"
              id="currentWeight"
              min="1"
              value={formik.values.currentWeight}
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
            <label htmlFor="targetWeight">Target Weight (kg)</label>
            <input
              type="number"
              id="targetWeight"
              min="1"
              value={formik.values.targetWeight}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your target weight"
              disabled={formik.values.goal === "Maintain Weight"} // Disable if maintaining
            />
            {formik.touched.targetWeight && formik.errors.targetWeight && (
              <p className="error-message">{formik.errors.targetWeight}</p>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="form-buttons">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/userinfo")}
            >
              Back
            </button>
            <button type="submit" className="btn-primary">
              Next
            </button>
          </div>
        </form>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default WeightTracker;
