import { Button, Col, Form, Input, Modal, Row } from "antd";

const QuickViewFromModal = ({ addRow, open, handleCancel }) => {
  // Define the form instance to use for validation
  const [form] = Form.useForm();

  const handleAddCriteria = async () => {
    try {
      const values = await form.validateFields();
      if (values) {
        addRow(values);
        handleClose();
      }
    } catch (error) {}
  };

  const handleClose = () => {
    handleCancel();
    form.resetFields();
  };

  return (
    <>
      <Modal open={open} onCancel={handleClose} footer={null} centered>
        <Form form={form} layout="vertical">
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Category is required" }]}
          >
            <Input placeholder="Enter Category" />
          </Form.Item>

          <Form.Item
            label="Criteria"
            name="criteria"
            rules={[{ required: true, message: "Criteria is required" }]}
          >
            <Input placeholder="Enter Criteria" />
          </Form.Item>
          <Row gutter={16} justify="end">
            <Col span={5}>
              <Button onClick={handleClose} block>
                Cancel
              </Button>
            </Col>
            <Col span={5}>
              <Button
                type="primary"
                htmlType="button"
                onClick={handleAddCriteria} // Trigger form validation and row addition
                block
              >
                Confirm
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default QuickViewFromModal;
