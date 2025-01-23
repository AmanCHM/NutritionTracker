import React from "react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  name: string;
  options: Option[]; 
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLSelectElement, Element>) => void;
  error?: string; 
  className?: string; 
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  onBlur,
  error,
  className,
}) => {
  return (
    <div className={className}>
      <label htmlFor={name}>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        id={name}
        className="custom-select"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
  
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default CustomSelect;
