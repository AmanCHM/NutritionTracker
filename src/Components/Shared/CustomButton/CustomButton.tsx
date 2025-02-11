import React from "react";
import "./CustomButton.css";

interface CustomButtonProps {
  label: string;


    onClick?: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => void;

  // onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  size?: "small" | "medium" | "large";
  style?: React.CSSProperties;
  className?:string
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  size = "medium",
  style = {}, 
  className
}) => {
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={style} 
    >
      {label}
    </button>
  );
};

export default CustomButton;
