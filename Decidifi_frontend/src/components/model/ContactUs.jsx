import { Modal } from "antd";
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Spinner } from "..";
import { createContactUs } from "../../api/contactUs";
import toast from "react-hot-toast";

const ContactUs = ({ isModalOpen, handleCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    adminEmail: "ian@decidifi.com",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [errors, setErrors] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prev) => ({
      ...prev,
      [name]: !value ? true : false,
    }));
  };

  const validateFields = () => {
    const newErrors = Object.keys(formData).reduce((errors, field) => {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && !formData[field].trim())
      ) {
        errors[field] = true;
      }
      return errors;
    }, {});

    if (!captchaValue) {
      newErrors.CAPTCHA = "Please complete the CAPTCHA";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length !== 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    if (validateFields()) return;
    try {
      setLoading(true);
      const res = await createContactUs(formData);

      if (res.data.status === 201) {
        toast.success(
          "Thank you for your inquiry. We've received your message and will endeavor to respond within 24 hours"
        );
        // Reset form
        setFormData({ name: "", email: "", message: "" });
        setCaptchaValue(null);
        handleCancel();
      }

      if (res.data.status === 400) {
        toast.error("Error occurred while sending inquiry");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error occurred while sending inquiry");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title="Contact Us"
      open={isModalOpen}
      onOk={handleCancel}
      onCancel={handleCancel}
      width={"40%"}
      footer={false}
      maskClosable={false}
      //   style={{ top: 20 }} // Position the modal closer to the top
      styles={{
        body: {
          maxHeight: "640px", // Set a max height for the modal content
          overflowY: "auto", // Enable vertical scrolling
        },
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-5">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
            errors.name
              ? "bg-red-50 border border-red-500"
              : "border border-gray-400"
          }`}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
            errors.email
              ? "bg-red-50 border border-red-500"
              : "border border-gray-400"
          }`}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
            errors.message
              ? "bg-red-50 border border-red-500"
              : "border border-gray-400"
          }`}
        />
        <ReCAPTCHA
          sitekey="6Le3ntMrAAAAAJOnbBdygsOkIh3PpgXEKAiTs47L"
          onChange={(value) => setCaptchaValue(value)}
        />
        {errors.CAPTCHA && <p className="text-red-500">{errors.CAPTCHA}</p>}

        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-6 flex justify-center bg-primary hover:bg-gray-700 text-secondary py-3 px-5 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
            disabled={loading}
          >
            {loading ? <Spinner /> : " Send Message"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ContactUs;
