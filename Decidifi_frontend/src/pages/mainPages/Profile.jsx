import React from "react";
import { Form, Input, Button, Card } from "antd";
import { DashboardLayout } from "../../components";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";

const Profile = () => {
  const user = getDefaultValUser();
  const [form] = Form.useForm();

  const handleFormSubmit = (values) => {
    console.log("Form values:", values);
    // Perform update logic here (e.g., API call)
  };

  return (
    <DashboardLayout>
      <Card
        title="Update Profile"
        style={{ maxWidth: "70%", margin: "2rem auto" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            name: user.name, // Pre-fill with user data if available
            email: user.email,
          }}
        >
          {/* Name Field */}
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter your name" },
              { max: 50, message: "Name cannot exceed 50 characters" },
            ]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          {/* Email Field */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </DashboardLayout>
  );
};

export default Profile;
