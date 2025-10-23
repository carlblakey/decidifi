import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

const AddUserModel = ({
  handleClose,
  isModalVisible,
  handleModalOk,
  form,
  sigleData,
  loading,
}) => {
  useEffect(() => {
    // for update
    if (sigleData && sigleData?._id) {
      form.setFieldsValue(sigleData);
    }
  }, [form, sigleData]);

  return (
    <Modal
      title={
        sigleData?._id ? "Update Decision Maker" : "Add Other Decision Maker"
      }
      open={isModalVisible}
      onOk={handleModalOk}
      onCancel={handleClose}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical" name="users">
        {sigleData?._id && (
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>
        )}

        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "This field is required" },
            {
              pattern: /^[A-Za-z\s]+$/, // Only alphabetic characters and spaces
              message: "Name can only contain letters and spaces",
            },
          ]}
          // validateTrigger={["onBlur", "onSubmit"]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "This field is required" },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email validation pattern
              message: "Invalid email address",
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item
          label="Phone Number"
          name="phoneNo"
          rules={[
            { required: true, message: "This field is required" },
            {
              pattern: /^\+?[1-9]\d{9,14}$/, // Matches phone numbers
              message: "Please enter a valid phone number.",
            },
          ]}
        >
          <Input />
        </Form.Item> */}
        {!sigleData?._id && (
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input type="password" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default AddUserModel;
