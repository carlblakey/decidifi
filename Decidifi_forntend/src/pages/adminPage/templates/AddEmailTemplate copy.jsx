import React, { useEffect, useState } from "react";
import { AdminDashboardLayout } from "../../../components";
import { Button, Card, Form, Image, Input, Select, Spin, Upload } from "antd";
import toast from "react-hot-toast";
import {
  createEmailTemplate,
  getEmailTemplateById,
  updateEmailTemplate,
} from "../../../api/admin/emailTemplates";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { setAuthToken } from "../../../api/client";
import { getToken } from "../../../utilities/localStorageMethods";
import { getDefaultValUser } from "../../../utilities/getStatesDefaultValues";
import { ROUTES } from "../../../constants";
import { PlusOutlined } from "@ant-design/icons";

// Toolbar & formats
const quillModules = {
  toolbar: [
    [{ font: [] }, { size: [] }], // Font family & size
    ["bold", "italic", "underline", "strike"], // Text styles
    [{ color: [] }, { background: [] }], // Text & background color
    [{ script: "sub" }, { script: "super" }], // Subscript / Superscript
    [{ header: "1" }, { header: "2" }, "blockquote", "code-block"], // Headers, blockquote, code
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ], // Lists & indent
    [{ direction: "rtl" }, { align: [] }], // RTL & alignment
    ["link", "image", "video", "formula"], // Media + formula
    ["clean"], // Clear formatting
  ],
};

// Allow all formats supported by Quill
const quillFormats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "header",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "indent",
  "direction",
  "align",
  "link",
  "image",
  "video",
  "formula",
];

const AddEmailTemplate = () => {
  const user = getDefaultValUser();
  const navigate = useNavigate();
  const { id } = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const [editorValue, setEditorValue] = useState("");

  const handleSubmit = async (values) => {
    try {
      setSaveLoading(true);
      // Merge editor value into form values
      values.body = editorValue;
      values.createdBy = user.id;

      let res;
      id
        ? (res = await updateEmailTemplate({ data: values, id }))
        : (res = await createEmailTemplate(values));

      if (res.data.status === 200 || res.data.status === 201) {
        toast.success(res.data.message);
        form.resetFields();
        navigate(ROUTES.EMAIL_TEMPLATES);
      }
    } catch (error) {
      toast.error(
        "There was an error in sending the scorecards. Please check the details and try again"
      );
    } finally {
      setSaveLoading(false);
    }
  };

  // get all email template by id
  const getEmailTemplate = async () => {
    try {
      setLoading(true);
      const res = await getEmailTemplateById(id);

      if (res?.data?.status === 200) {
        const template = res.data.data;
        // Populate form fields
        form.setFieldsValue({
          name: template.name,
          subject: template.subject,
          templateType: template.templateType,
          body: template.body, // still required for form validation
        });

        // Populate the editor
        setEditorValue(template.body);
      }
    } catch (error) {
      toast.error("Error while loading email template");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAuthToken(getToken());
    if (id) {
      getEmailTemplate();
    }
  }, [id]);

  return (
    <AdminDashboardLayout>
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <Card
          title="Email Templates Manager"
          style={{ maxWidth: "70%", margin: "2rem auto" }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6"
          >
            <Form.Item
              name="name"
              label="Enter Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input placeholder="eg. Unsubscribe Subscription" />
            </Form.Item>

            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: "Please enter subject" }]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>

            {/* Rich Text Editor for Email Body */}
            <Form.Item
              name="body"
              label="Email Body"
              rules={[
                {
                  required: true,
                  validator: (_, value) =>
                    value && value.trim() !== "" && value !== "<p><br></p>"
                      ? Promise.resolve()
                      : Promise.reject(new Error("Please enter email body")),
                },
              ]}
            >
              <ReactQuill
                theme="snow"
                value={editorValue}
                onChange={(val) => {
                  setEditorValue(val);
                  form.setFieldsValue({ body: val }); // Sync with AntD form
                }}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write your email content here..."
                className="custom-quill"
                style={{ minHeight: "200px" }} // min height here
              />
            </Form.Item>

            <Form.Item
              name="templateType"
              label="Template Type"
              rules={[
                { required: true, message: "Please enter template type" },
              ]}
            >
              <Input placeholder="eg. unsubscribesubscription" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={saveLoading}
              >
                {id ? "Update" : "Create"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </AdminDashboardLayout>
  );
};

export default AddEmailTemplate;
