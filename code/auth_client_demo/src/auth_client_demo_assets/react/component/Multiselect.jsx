import React, { useState } from "react";

const MultiSelect = ({ options, selectedOptions, setSelectedOptions }) => {
  const handleSelectChange = (event) => {
    const value = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(value);
  };

  return (
    <div>
      <select
        multiple={true}
        value={selectedOptions}
        onChange={handleSelectChange}
        className="userlist"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MultiSelect;
