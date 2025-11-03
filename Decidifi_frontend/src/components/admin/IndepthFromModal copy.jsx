import { Button, Input, Modal, Form } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

const IndepthFromModal = ({ addRow, open, handleCancel }) => {
  const [category, setCategory] = useState("");
  const [criteriaList, setCriteriaList] = useState([""]);

  const handleAddCriteria = () => {
    if (!category.trim()) {
      alert("Category is required!");
      return;
    }

    // Add rows for each criterion
    const rows = criteriaList
      .filter((criteria) => criteria.trim() !== "") // Exclude empty criteria
      .map((criteria) => ({ category, criteria }));

    addRow(rows);

    // Reset modal state
    handleCancel();
    setCategory("");
    setCriteriaList([""]);
  };

  const handleClose = () => {
    setCategory("");
    setCriteriaList([""]);
    handleCancel();
  };

  const handleAddMoreCriteria = () => {
    setCriteriaList([...criteriaList, ""]);
  };

  const handleCriteriaChange = (value, index) => {
    const updatedList = [...criteriaList];
    updatedList[index] = value;
    setCriteriaList(updatedList);
  };

  const handleRemoveCriteria = (index) => {
    const updatedList = [...criteriaList];
    updatedList.splice(index, 1);
    setCriteriaList(updatedList);
  };

  return (
    <>
      <Modal
        open={open}
        onOk={handleAddCriteria}
        onCancel={handleClose}
        footer={[
          <Button key="cancel" onClick={handleClose}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" onClick={handleAddCriteria}>
            Confirm
          </Button>,
        ]}
        centered
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Category" required>
            <Input
              placeholder="Enter Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Item>

          {criteriaList.map((criteria, index) => (
            <Form.Item
              label={`Criteria ${index + 1}`}
              key={index}
              required
              style={{ display: "flex", alignItems: "center" }}
            >
              <Input
                placeholder="Enter Criteria"
                value={criteria}
                onChange={(e) => handleCriteriaChange(e.target.value, index)}
                style={{ width: "90%" }}
              />
              {criteriaList.length > 1 && (
                <MinusCircleOutlined
                  style={{ marginLeft: 8, cursor: "pointer" }}
                  onClick={() => handleRemoveCriteria(index)}
                />
              )}
            </Form.Item>
          ))}

          <Button
            type="dashed"
            onClick={handleAddMoreCriteria}
            style={{ width: "100%" }}
            icon={<PlusOutlined />}
          >
            Add More Criteria
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default IndepthFromModal;
