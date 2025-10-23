import { Card } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Spinner } from "..";
import { setAuthToken } from "../../api/client";
import { getToken } from "../../utilities/localStorageMethods";
import { changePassword } from "./../../api/auth";

const DEFAULT_FORM_DATA = {
  previousPassword: "",
  newPassword: "",
};

const ChangePasswordArea = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: !value ? true : false,
    }));
  };

  const validateFields = () => {
    const newErrors = Object.keys(formData).reduce((errors, field) => {
      // Ensure `formData[field]` exists before trying to validate
      if (
        field === "newPassword" &&
        formData.newPassword &&
        formData.newPassword.length < 8
      ) {
        errors.newPassword = "New Password must be at least 8 characters long";
      }

      // Check if field is missing or empty
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && !formData[field].trim())
      ) {
        errors[field] = true;
      }

      return errors;
    }, {});

    setErrors(newErrors);
    return Object.keys(newErrors).length !== 0;
  };

  const handlePasswordUpdate = async () => {
    if (validateFields()) return;
    setAuthToken(getToken());
    toast.dismiss();
    try {
      setLoading(true);
      const res = await changePassword(formData);

      if (res.data.status === 201 || res.data.status === 200) {
        toast.success("Password changed successfully");
        setFormData(DEFAULT_FORM_DATA);
      }

      if (res.data.status === 401 || res.data.status === 400) {
        toast.error("Error occurred while changing password");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error occurred while changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        title="Update Password"
        style={{ maxWidth: "70%", margin: "2rem auto" }}
      >
        {/* <Form form={form} layout="vertical" onFinish={handlePasswordUpdate}>
          <Form.Item
            label="Previous Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your previous password!",
              },
            ]}
          >
            <Input.Password placeholder="Enter your previous password" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please enter a new password!" },
              {
                min: 8,
                message: "Password must be at least 8 characters long.",
              },
            ]}
          >
            <Input.Password placeholder="Enter your new password" />
          </Form.Item>

          {otpSent && (
            <Form.Item
              label="OTP"
              name="otp"
              rules={[
                {
                  required: true,
                  message: "Please enter the OTP sent to your email!",
                },
              ]}
            >
              <Input placeholder="Enter the OTP" />
            </Form.Item>
          )}

          {!otpSent && (
            <Form.Item>
              <Button
                type="primary"
                onClick={handleSendOtp}
                block
                disabled={loading}
              >
                {loading ? <Spinner /> : "Send OTP"}
              </Button>
            </Form.Item>
          )}

          {otpSent && (
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                disabled={loadingresetpassword}
              >
                {loadingresetpassword ? <Spinner /> : "Update Password"}
              </Button>
            </Form.Item>
          )}
        </Form> */}

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 tracking-wide">
              Previous Password
            </label>
            <input
              className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
                errors.previousPassword
                  ? "bg-red-50 border border-red-500"
                  : "border border-gray-300"
              }`}
              type="password"
              name="previousPassword"
              placeholder="Previous Password"
              value={formData.previousPassword}
              onChange={handleChange}
            />
            {errors.previousPassword && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.previousPassword}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 tracking-wide">
              New Password
            </label>
            <input
              className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
                errors.newPassword
                  ? "bg-red-50 border border-red-500"
                  : "border border-gray-300"
              }`}
              type="password"
              name="newPassword"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleChange}
            />
            {errors.newPassword && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.newPassword}
              </p>
            )}
          </div>

          <div>
            <button
              onClick={handlePasswordUpdate}
              type="button"
              className="w-full flex justify-center bg-primary hover:bg-gray-700 text-secondary p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Update Password"}
            </button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ChangePasswordArea;
