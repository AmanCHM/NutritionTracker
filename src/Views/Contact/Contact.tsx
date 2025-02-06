import React, { useRef, FormEvent } from "react";
import { toast } from "react-toastify";
import "./Contact.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../Store/Loader";
import { FORM_VALIDATION_MESSAGES, LABEL } from "../../Shared";
import CustomButton from "../../Components/Shared/CustomButton/CustomButton";


const ContactUs: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null); 
  const dispatch = useDispatch();
  const Url =
    import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(showLoader());
    try {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const response = await axios.post(Url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success(response.data.msg);
        formRef.current.reset();
      }
    } catch (error) {
      
      toast.error(FORM_VALIDATION_MESSAGES().ERROR_OCCURED);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <>
 
      <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
        <h2 className="title-contactus">{LABEL.CONTACT}</h2>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
           {LABEL.NAME}
          </label>
          <input
            type="text"
            name="Name"
            required
            id="name"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            {LABEL.EMAIL_LABEL}
          </label>
          <input
            type="email"
            name="Email"
            required
            id="email"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="message">
           {LABEL.MESSAGE}
          </label>
          <textarea
            name="Message"
            required
            id="message"
            className="form-input"
          ></textarea>
        </div>
        <CustomButton type="submit" className="form-submit" label= {LABEL.SEND}>
         
        </CustomButton>
      </form>
    </>
  );
};

export default ContactUs;
