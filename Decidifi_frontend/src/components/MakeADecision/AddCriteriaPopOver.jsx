import { Button, Input, Modal, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const AddCriteriaModal = ({ addRow }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm(); // use Ant Design form instance

  const handleAddCriteria = async () => {
    try {
      const values = await form.validateFields(); // validate all fields
      addRow(values); // values = { category, criteria }
      setIsModalVisible(false);
      form.resetFields();
    } catch (errorInfo) {
      // validation failed
      // console.log("Validation Failed:", errorInfo);
    }
  };

  const handleClose = () => {
    form.resetFields(); // clear form fields
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
        <Form layout="vertical" form={form} className="mt-4">
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Category required" }]}
          >
            <Input placeholder="Enter Category" />
          </Form.Item>
          <Form.Item
            label="Criteria"
            name="criteria"
            rules={[{ required: true, message: "Criteria required" }]}
          >
            <Input placeholder="Enter Criteria" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddCriteriaModal;
