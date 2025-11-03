import { Button, Input, Modal, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const QuickViewFromModal = ({ addRow, open, handleCancel }) => {
  const [category, setCategory] = useState("");
  const [criteria, setCriteria] = useState("");

  const handleAddCriteria = () => {
    addRow({ category, criteria });
    handleCancel();
    setCategory("");
    setCriteria("");
  };

  const handleClose = () => {
    setCategory("");
    setCriteria("");
    handleCancel();
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
          <Form.Item label="Category">
            <Input
              placeholder="Enter Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Criteria">
            <Input
              placeholder="Enter Criteria"
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default QuickViewFromModal;
