import React from 'react';

export interface OptionType {
  value: string ; 
  label: string;
  key?: string;
}

interface CustomSelectProps {
  options: OptionType[];
  value: OptionType | null; 
  onChange: (selected: OptionType | null) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  label?: string;
  name ?: string;
  placeholder?: string; 
  error ?:string;
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
        value={value?.value || ""} 
        onChange={(e) => {
          const selectedValue = e.target.value;
          const selectedOption = options.find((opt) => opt.value === selectedValue);
          onChange(selectedOption || null); 
        }}
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
