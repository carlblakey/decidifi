import React, { useState } from "react";
import { Modal, Select, Button } from "antd"; // Import Select and Button from Ant Design
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

const CategoryModal = ({ isVisible, onClose, route }) => {
  const [decision, setDecision] = useState(null);
  const [selectedCategory2, setSelectedCategory2] = useState(null);

  const navigate = useNavigate();

  // Options for the dropdowns
  const categories1 = ["Education"];
  const categories2 = [
    "Decide whether to send your children to school or home school them",
    "Decide which pre-school to attend",
    "Decide which elementary school to attend",
  ];

  // Handle selection changes
  const handleCategory1Change = (value) => {
    setDecision(value);
  };

  const handleCategory2Change = (value) => {
    setSelectedCategory2(value);
  };

  const handleClose = () => {
    // Reset the dropdown selections
    setDecision(null);
    setSelectedCategory2(null);
    onClose(); // Call the onClose prop to close the modal
  };

  const handleClickOnProceed = () => {
    navigate(route);
  };

  return (
    <Modal
      title="Decision Category List"
      open={isVisible} // 'visible' is now 'open' in Ant Design v4+
      onCancel={handleClose}
      footer={null} // Custom footer with Proceed and Cancel buttons
      centered
    >
      {/* First Dropdown */}
      <div className="mb-4 mt-3">
        <h5 className="text-lg font-semibold">Decision</h5>
        <Select
          style={{ width: "100%" }}
          placeholder="Please select a category"
          onChange={handleCategory1Change}
          value={decision}
        >
          {categories1.map((category) => (
            <Select.Option key={category} value={category}>
              {category}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Second Dropdown */}
      <div className="mb-4">
        <h5 className="text-lg font-semibold">Decision Types</h5>
        <Select
          style={{ width: "100%" }}
          placeholder="Please select sub-category"
          onChange={handleCategory2Change}
          value={selectedCategory2}
        >
          {categories2.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Footer with Proceed and Cancel buttons */}
      <div className="flex justify-end mt-7">
        <Button type="primary" onClick={handleClickOnProceed}>
          Proceed
        </Button>
      </div>
    </Modal>
  );
};

export default CategoryModal;