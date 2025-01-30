import React, { useEffect, useState } from "react";

interface ModelDataItem {
  model_id: string;
  model_name: string;
}

interface DropdownProps {
  modelData: Array<ModelDataItem>;
  onselectedModel: (model: string) => void;
}

const DropdownButton = ({ modelData,onselectedModel }: DropdownProps) => {
  const defaultModel: ModelDataItem = {
    model_id: "44444444-4444-4444-4444-444444444444",
    model_name: "gpt-4o-mini",
  };
  const [selectedModel, setSelectedModel] =
    useState<ModelDataItem>(defaultModel);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDropdown = (): void => setIsOpen((prev) => !prev);
  const handleSelect = (item: ModelDataItem): void => {
    setSelectedModel(item); // Update the selected model
    setIsOpen(false); // Close the dropdown
  };
  useEffect(() => {
    onselectedModel(selectedModel.model_id); // Notify parent of selection
  }, [selectedModel]);
  return (
    <div className="relative inline-block w-full">
      {/* Dropdown Button */}
      <button
        id="dropdownDefaultButton"
        onClick={toggleDropdown}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-2 text-sm text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        type="button"
      >
        {selectedModel ? selectedModel.model_name : "Select Custom Model"}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="dropdown"
          className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            {modelData.map((item) => (
              <li
                key={item.model_id}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
              >
                {item.model_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
