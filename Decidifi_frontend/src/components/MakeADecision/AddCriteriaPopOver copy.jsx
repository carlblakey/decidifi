import { Button, Input, Modal, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const AddCriteriaModal = ({ addRow }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [criteria, setCriteria] = useState("");

  const handleAddCriteria = () => {
    addRow({ category, criteria });
    setIsModalVisible(false);
    setCategory("");
    setCriteria("");
  };

  const handleClose = () => {
    setCategory("");
    setCriteria("");
    setIsModalVisible(false);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginLeft: 8 }}
        onClick={() => setIsModalVisible(true)}
      >
        Add Category
      </Button>

      <Modal
        open={isModalVisible}
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

export default AddCriteriaModal;
