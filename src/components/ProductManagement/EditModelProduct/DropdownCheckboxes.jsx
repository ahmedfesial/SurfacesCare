import React, { useState, useEffect, useRef } from "react";

export default function DropdownCheckboxes({
  options = [],
  placeholder = "Select Options",
  onChange,
  value = [], // Array of IDs (Numbers)
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const allSelected = value.length === options.length;

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  const toggleOption = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const toggleAll = () => {
    const all = options.map((opt) => opt.value);
    onChange(allSelected ? [] : all);
  };

  const getLabel = () => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      const opt = options.find((o) => o.value === value[0]);
      return opt?.label || placeholder;
    }
    if (allSelected) return "All Selected";
    return `${value.length} Selected`;
  };

  return (
    <div className="relative text-sm text-gray-800 w-50" ref={dropdownRef}>
      <button
        type="button"
        className="flex justify-between items-center h-8 border border-gray-300 bg-white px-3 cursor-pointer select-none w-full text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        {getLabel()}
        <span className="ml-2">{open ? "▲" : "▼"}</span>
      </button>

      <div
        className={`absolute left-0 right-0 mt-1 bg-white shadow-md max-h-[66vh] overflow-y-auto origin-top transform transition-transform duration-150 ${
          open ? "scale-y-100" : "scale-y-0"
        }`}
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toggleAll();
          }}
          className="block px-3 py-2 text-green-600 hover:bg-gray-50"
        >
          {allSelected ? "Uncheck All" : "Check All"}
        </a>

        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center px-3 py-2 opacity-100 hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              className="mr-2"
              checked={value.includes(option.value)}   // مفيش state داخلي
              onChange={() => toggleOption(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}
