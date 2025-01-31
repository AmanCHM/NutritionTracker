import React from "react";
import Select from "react-select";

export interface OptionType {
  value: string |number ;
  label: string;
}

interface CustomSelectProps {
  options: OptionType[];
  value: OptionType | null;
  onChange: (selected: OptionType | null) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  label?: string;
  name?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  id?: string
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  onBlur,
  placeholder = "Select an option",
  error,
  className,
}) => {
  return (
    <div className={className}>
      {label && <label htmlFor={name} className="block font-semibold">{label}</label>}
      <Select
        id={name}
        name={name}
        options={options}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className="mt-1"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default CustomSelect;
