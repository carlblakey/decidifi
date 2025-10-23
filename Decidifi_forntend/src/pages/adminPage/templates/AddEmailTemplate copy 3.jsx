import React, { useEffect, useState, useRef } from "react";
import { AdminDashboardLayout } from "../../../components";
import { Button, Card, Form, Input, Spin } from "antd";
import toast from "react-hot-toast";
import {
  createEmailTemplate,
  getEmailTemplateById,
  updateEmailTemplate,
} from "../../../api/admin/emailTemplates";
import { useNavigate, useParams } from "react-router-dom";
import { setAuthToken } from "../../../api/client";
import { getToken } from "../../../utilities/localStorageMethods";
import { getDefaultValUser } from "../../../utilities/getStatesDefaultValues";
import { ROUTES } from "../../../constants";
import EmailEditor, { EditorRef } from "react-email-editor";

const toolbarOptions = [
  "undo redo | bold italic underline strikethrough | font size",
  "alignleft aligncenter alignright alignjustify | outdent indent",
  "link image video table | font color backcolor",
  "columns button divider heading text image | insertimage insertbutton",
  "removeformat | inserthtml | save",
  "insertdatetime | emoticons | fullscreen | social menu",
];

const AddEmailTemplate = () => {
  const user = getDefaultValUser();
  const navigate = useNavigate();
  const { id } = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const emailEditorRef = useRef(null);

  const getHtmlFromEditor = () =>
    new Promise((resolve) => {
      emailEditorRef.current?.editor?.exportHtml((data) => {
        resolve(data && data.html ? data.html : "");
      });
    });

  const handleSubmit = async (values) => {
    try {
      setSaveLoading(true);

      const html = await getHtmlFromEditor();
      if (!html || html.trim() === "") {
        // AntD ko error dikhane ke liye
        form.setFields([{ name: "body", errors: ["Please enter email body"] }]);
        setSaveLoading(false);
        return;
      }

      // backend ko bhejne ke liye values banayein
      const payload = {
        ...values,
        body: html, // HTML
        createdBy: user.id,
      };
      console.log(html);
      return;

      let res;
      if (id) res = await updateEmailTemplate({ data: payload, id });
      else res = await createEmailTemplate(payload);

      if (res.data.status === 200 || res.data.status === 201) {
        toast.success(res.data.message);
        form.resetFields();
        navigate(ROUTES.EMAIL_TEMPLATES);
      }
    } catch (err) {
      console.error(err);
      toast.error(
        "There was an error while saving the email template. Please try again."
      );
    } finally {
      setSaveLoading(false);
    }
  };

  // Get email template by ID for editing
  const getEmailTemplate = async () => {
    try {
      setLoading(true);
      const res = await getEmailTemplateById(id);
      if (res?.data?.status === 200) {
        const template = res.data.data;
        form.setFieldsValue({
          name: template.name,
          subject: template.subject,
          templateType: template.templateType,
        });
        // Load the template body into the editor
        emailEditorRef.current?.loadDesign(template.body);
      }
    } catch (error) {
      toast.error("Error loading email template");
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

  const onReady = () => {
    const unlayer = emailEditorRef.current?.editor;
    if (!unlayer) return;

    // jab bhi editor me change ho
    unlayer.addEventListener("design:updated", () => {
      unlayer.exportHtml((data) => {
        const html = (data && data.html) || "";
        form.setFieldsValue({ body: html }); // hidden field update
        // agar pehle error laga tha to clear kara do:
        form.setFields([{ name: "body", errors: [] }]);
      });
    });
  };

  return (
    <AdminDashboardLayout>
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <Card
          title="Email Templates Manager"
          style={{ maxWidth: "90%", margin: "2rem auto" }}
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
              <EmailEditor
                ref={emailEditorRef}
                onReady={onReady}
                options={{
                  minHeight: 500,
                  maxWidth: "100%",
                  modules: {
                    toolbar: toolbarOptions,
                    image: {
                      uploader: {
                        formats: ["image/jpeg", "image/png", "image/gif"],
                      },
                    },
                  },
                }}
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
