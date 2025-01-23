import React from "react";
import "./CustomButton.css";

interface CustomButtonProps {
  label: string; 
  onClick: () => void; 
  variant?: "primary" | "secondary" | "danger"; 
  disabled?: boolean; 
  type?: "button" | "submit" | "reset";
  size?: "small" | "medium" | "large"; 
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  variant = "primary", 
  disabled = false,
  type = "button",
  size = "medium", 
}) => {
  return (
    <button
      className={`custom-button ${variant} ${size}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {label}
    </button>
  );
};

export default CustomButton;
