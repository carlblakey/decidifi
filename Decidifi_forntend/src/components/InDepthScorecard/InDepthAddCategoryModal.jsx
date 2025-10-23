import { Button, Input, Modal, Form, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const InDepthAddCategoryModal = ({
  addRow,
  addCriteriaPopoverVisible,
  setAddCriteriaPopoverVisible,
}) => {
  const [form] = Form.useForm();

  const handleAddCriteria = async () => {
    try {
      const values = await form.validateFields();
      const { category, criteriaList } = values;

      const rows = criteriaList.map((criteria) => ({
        category,
        criteria: criteria.trim(),
      }));

      addRow(rows);
      form.resetFields();
      setAddCriteriaPopoverVisible(false);
    } catch (errorInfo) {
      // AntD shows validation errors inline
    }
  };

  const handleClose = () => {
    form.resetFields();
    setAddCriteriaPopoverVisible(false);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginLeft: 8 }}
        onClick={() => setAddCriteriaPopoverVisible(true)}
      >
        Add Category
      </Button>

      <Modal
        open={addCriteriaPopoverVisible}
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
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
          initialValues={{ criteriaList: [""] }}
        >
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Category required" }]}
          >
            <Input placeholder="Enter Category" />
          </Form.Item>

          <Form.List name="criteriaList">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Form.Item
                    key={key}
                    label={`Criteria ${index + 1}`}
                    name={name}
                    rules={[{ required: true, message: "Criteria required" }]}
                  >
                    <Space align="baseline">
                      <Input
                        placeholder="Enter Criteria"
                        {...restField}
                        style={{ width: "300px" }}
                      />
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ color: "red", cursor: "pointer" }}
                        />
                      )}
                    </Space>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    style={{ width: "100%" }}
                  >
                    Add More Criteria
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
};

export default InDepthAddCategoryModal;
