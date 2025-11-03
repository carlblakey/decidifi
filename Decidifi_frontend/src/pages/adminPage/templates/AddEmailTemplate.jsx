// src/pages/admin/email-templates/AddEmailTemplate.jsx
import React, { useEffect, useRef, useState } from "react";
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
import EmailEditor from "react-email-editor";

const AddEmailTemplate = () => {
  const user = getDefaultValUser();
  const navigate = useNavigate();
  const { id } = useParams();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const emailEditorRef = useRef(null);

  // design/ready helpers
  const latestDesignRef = useRef(null); // last exported design JSON (object)
  const pendingDesignRef = useRef(null); // design to load once editor ready
  const editorReadyRef = useRef(false);
  const removeListenerRef = useRef(null);

  // export helper
  const exportFromEditor = () =>
    new Promise((resolve) => {
      emailEditorRef.current?.editor?.exportHtml((data) => {
        resolve(data || { html: "", design: null });
      });
    });

  // submit
  const handleSubmit = async (values) => {
    try {
      setSaveLoading(true);

      const { html, design } = await exportFromEditor();

      if (!html || html.trim() === "") {
        form.setFields([{ name: "body", errors: ["Please enter email body"] }]);
        setSaveLoading(false);
        return;
      }

      // ensure we always send a STRING for design (schema: String, required)
      const designToSave = design || latestDesignRef.current || {}; // object
      const payload = {
        name: values.name,
        subject: values.subject,
        templateType: values.templateType,
        body: html, // HTML to send emails
        design: JSON.stringify(designToSave), // JSON string for editor
        createdBy: user.id,
      };

      let res;
      if (id) res = await updateEmailTemplate({ data: payload, id });
      else res = await createEmailTemplate(payload);

      if (res?.data?.status === 200 || res?.data?.status === 201) {
        toast.success(res.data.message || "Saved");
        form.resetFields();
        navigate(ROUTES.EMAIL_TEMPLATES);
      } else {
        toast.error("Save failed");
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

  // load one template for edit
  const getEmailTemplate = async () => {
    try {
      setLoading(true);
      const res = await getEmailTemplateById(id);
      if (res?.data?.status === 200) {
        const t = res.data.data;

        form.setFieldsValue({
          name: t.name || "",
          subject: t.subject || "",
          templateType: t.templateType || "",
          body: t.body || "",
          design: t.design || "",
        });

        // design may be string or object; normalize to object
        let designObj = null;
        if (t.design) {
          try {
            designObj =
              typeof t.design === "string" ? JSON.parse(t.design) : t.design;
          } catch {
            designObj = null;
          }
        }

        if (designObj) {
          latestDesignRef.current = designObj;
          // load now or after editor is ready
          if (editorReadyRef.current) {
            emailEditorRef.current?.editor?.loadDesign(designObj);
          } else {
            pendingDesignRef.current = designObj;
          }
        } else {
          console.warn("No design JSON found; cannot load into editor.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading email template");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAuthToken(getToken());
    if (id) getEmailTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // keep hidden fields synced; handle late-ready load
  const onReady = () => {
    const unlayer = emailEditorRef.current?.editor;
    if (!unlayer) return;

    editorReadyRef.current = true;

    // if we fetched a design before editor was ready
    if (pendingDesignRef.current) {
      unlayer.loadDesign(pendingDesignRef.current);
      pendingDesignRef.current = null;
    }

    const handler = () => {
      unlayer.exportHtml((data) => {
        const html = (data && data.html) || "";
        const design = (data && data.design) || null;

        latestDesignRef.current = design;

        form.setFieldsValue({
          body: html,
          design: design ? JSON.stringify(design) : "",
        });

        // clear previous validation error after any change
        form.setFields([{ name: "body", errors: [] }]);
      });
    };

    unlayer.addEventListener("design:updated", handler);
    removeListenerRef.current = () =>
      unlayer.removeEventListener("design:updated", handler);
  };

  // cleanup listener
  useEffect(() => {
    return () => {
      if (removeListenerRef.current) removeListenerRef.current();
    };
  }, []);

  return (
    <AdminDashboardLayout>
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <Card
          title="Email Templates Manager"
          style={{ maxWidth: "90%", margin: "2rem auto" }}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Enter Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input placeholder="eg. Welcome Email" />
            </Form.Item>

            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: "Please enter subject" }]}
            >
              <Input placeholder="Welcome to Decidifi" />
            </Form.Item>

            {/* Visual editor; image upload already working in your setup */}
            <Form.Item label="Email Body">
              <EmailEditor
                ref={emailEditorRef}
                onReady={onReady}
                options={{
                  minHeight: 520,
                  locale: "en",
                  appearance: { theme: "modern_light" },
                  features: { textEditor: { spellChecker: true } },
                }}
              />
            </Form.Item>

            {/* Hidden fields AntD validates/submits */}
            <Form.Item
              name="body"
              noStyle
              rules={[
                {
                  required: true,
                  validator: (_, v) =>
                    v && v.trim() !== ""
                      ? Promise.resolve()
                      : Promise.reject(new Error("Please enter email body")),
                },
              ]}
            >
              <Input type="hidden" />
            </Form.Item>

            <Form.Item name="design" noStyle>
              <Input type="hidden" />
            </Form.Item>

            <Form.Item
              name="templateType"
              label="Template Type"
              rules={[
                { required: true, message: "Please enter template type" },
              ]}
            >
              <Input
                placeholder="eg. welcome, unsubscribe, newsletter"
                readOnly={!!id}
              />
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
