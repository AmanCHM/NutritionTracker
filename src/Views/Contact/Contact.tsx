import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../Store/Loader";
import { ERROR_MESSAGES, FORM_VALIDATION_MESSAGES, LABEL, VALIDATION_REGEX } from "../../Shared";
import CustomButton from "../../Components/Shared/CustomButton/CustomButton";
import "./Contact.css";

const ContactUs: React.FC = () => {
  const dispatch = useDispatch();
  const Url = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  // Form Validation Schema
  const validationSchema = Yup.object({
    Name: Yup.string().required(FORM_VALIDATION_MESSAGES().REQUIRED)
    .matches(VALIDATION_REGEX.USER_NAME, FORM_VALIDATION_MESSAGES().INVALID_NAME) 
    .min(2, FORM_VALIDATION_MESSAGES().NAME_TOO_SHORT) 
    .max(50, FORM_VALIDATION_MESSAGES().NAME_TOO_LONG) ,
    Email: Yup.string()
      .email(FORM_VALIDATION_MESSAGES().VALID_EMAIL)
      .required(FORM_VALIDATION_MESSAGES().REQUIRED)
      .matches(VALIDATION_REGEX.EMAIL, ERROR_MESSAGES().INVALID_EMAIL) ,
    Message: Yup.string().required(FORM_VALIDATION_MESSAGES().REQUIRED),
  });

  // Handle Submit
  const handleSubmit = async (values: { Name: string; Email: string; Message: string }, { resetForm }: any) => {
    dispatch(showLoader());
    try {
      const formData = new FormData();
      formData.append("Name", values.Name);
      formData.append("Email", values.Email);
      formData.append("Message", values.Message);

      const response = await axios.post(Url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.msg);
      resetForm();
    } catch (error) {
      toast.error(FORM_VALIDATION_MESSAGES().ERROR_OCCURED);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <Formik
      initialValues={{ Name: "", Email: "", Message: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="contact-form">
          <h2 className="title-contactus">{LABEL.CONTACT}</h2>

          {/* Name Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              {LABEL.NAME}
            </label>
            <Field type="text" name="Name" id="name" className="form-input" />
            <ErrorMessage name="Name" component="div" className="error-message" />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              {LABEL.EMAIL_LABEL}
            </label>
            <Field type="email" name="Email" id="email" className="form-input" />
            <ErrorMessage name="Email" component="div" className="error-message" />
          </div>

          {/* Message Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="message">
              {LABEL.MESSAGE}
            </label>
            <Field as="textarea" name="Message" id="message" className="form-input" />
            <ErrorMessage name="Message" component="div" className="error-message" />
          </div>

          {/* Submit Button */}
          <CustomButton type="submit" className="form-submit" label={LABEL.SEND} disabled={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
};

export default ContactUs;
