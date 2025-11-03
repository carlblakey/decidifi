import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row } from "antd";

const QuickViewFromModal = ({ addRow, open, handleCancel }) => {
  const [form] = Form.useForm();

  const handleAddCriteria = async () => {
    try {
      const values = await form.validateFields();
      if (values) {
        const { category, criteria } = values;

        // Make sure criteria is an array of objects with a 'value' field
        const rows = criteria
          .filter(
            (criterion) =>
              typeof criterion.value === "string" &&
              criterion.value.trim() !== ""
          )
          .map((criterion) => ({ category, criteria: criterion.value }));

        addRow(rows);
        handleCancel();
        form.resetFields();
      }
    } catch (error) {}
  };

  const handleClose = () => {
    form.resetFields();
    handleCancel();
  };

  return (
    <Modal
      open={open}
      onOk={handleAddCriteria}
      onCancel={handleClose}
      footer={[
        <>
          <Button key="cancel" onClick={handleClose}>
            Cancel
          </Button>
          <Button key="confirm" type="primary" onClick={handleAddCriteria}>
            Confirm
          </Button>
        </>,
      ]}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Category is required!" }]}
        >
          <Input placeholder="Enter Category" />
        </Form.Item>

        <Form.List
          name="criteria"
          initialValue={[""]}
          // rules={[
          //   {
          //     validator: async (_, criteria) => {
          //       if (!criteria || criteria.length < 1) {
          //         return Promise.reject(
          //           new Error("At least one criterion is required")
          //         );
          //       }
          //     },
          //   },
          // ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ name, ...restField }) => (
                <Form.Item
                  {...restField}
                  label={`Criteria ${name + 1}`}
                  key={name}
                  required
                >
                  <Row gutter={8} align="middle">
                    <Col span={20}>
                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        rules={[
                          {
                            required: true,
                            message: `Criteria ${name + 1} is required!`,
                          },
                        ]}
                        style={{ width: "100%", marginBottom: "0" }}
                      >
                        <Input placeholder="Enter Criteria" />
                      </Form.Item>
                    </Col>

                    <Col
                      span={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          style={{ cursor: "pointer" }}
                          onClick={() => remove(name)}
                        />
                      )}
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: "100%" }}
                icon={<PlusOutlined />}
              >
                Add More Criteria
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default QuickViewFromModal;
