import React, { useRef, FormEvent } from "react";
import { toast } from "react-toastify";
import "./Contact.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../Store/Loader";


const ContactUs: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null); 
  const dispatch = useDispatch();
  const apiUrl =
    import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(showLoader());
    try {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const response = await axios.post(apiUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success(response.data.msg);
        formRef.current.reset();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <>
 
      <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
        <h2 className="title-contactus">Contact Us</h2>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Name:
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
            Email:
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
            Message:
          </label>
          <textarea
            name="Message"
            required
            id="message"
            className="form-input"
          ></textarea>
        </div>
        <button type="submit" className="form-submit">
          Send
        </button>
      </form>
    </>
  );
};

export default ContactUs;
