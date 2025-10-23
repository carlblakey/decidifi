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

  // Unlayer refs
  const emailEditorRef = useRef(null);
  const latestDesignRef = useRef(null);
  const pendingDesignRef = useRef(null);
  const editorReadyRef = useRef(false);
  let removeListenerRef = useRef(null);

  // helper: get HTML & design from editor as a Promise
  const exportFromEditor = () =>
    new Promise((resolve) => {
      emailEditorRef.current?.editor?.exportHtml((data) => {
        resolve(data || { html: "", design: null });
      });
    });

  // submit (create / update)
  const handleSubmit = async (values) => {
    try {
      setSaveLoading(true);

      // final export
      const { html, design } = await exportFromEditor();

      if (!html || html.trim() === "") {
        form.setFields([{ name: "body", errors: ["Please enter email body"] }]);
        setSaveLoading(false);
        return;
      }

      const payload = {
        name: values.name,
        subject: values.subject,
        templateType: values.templateType,
        body: html, // HTML for sending
        design: JSON.stringify(design || {}), // JSON string for reloading
        ...(id ? { updatedBy: user.id } : { createdBy: user.id }),
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
          body: t.body || "", // hidden field (html) – for validation
          design: t.design || "",
        });

        // If we have design JSON, load it (now or when editor becomes ready)
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
          if (editorReadyRef.current) {
            emailEditorRef.current?.editor?.loadDesign(designObj);
          } else {
            pendingDesignRef.current = designObj; // load later in onReady
          }
          latestDesignRef.current = designObj;
        } else {
          console.warn("No design JSON found; editor cannot load pure HTML.");
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

  // Attach events when editor is ready
  const onReady = () => {
    const unlayer = emailEditorRef.current?.editor;
    if (!unlayer) return;

    editorReadyRef.current = true;

    // If a design arrived before ready, load it now
    if (pendingDesignRef.current) {
      unlayer.loadDesign(pendingDesignRef.current);
      pendingDesignRef.current = null;
    }

    // Keep form.hidden fields in sync on every design change
    const handler = () => {
      unlayer.exportHtml((data) => {
        const html = (data && data.html) || "";
        const design = (data && data.design) || null;

        latestDesignRef.current = design;

        form.setFieldsValue({
          body: html,
          design: design ? JSON.stringify(design) : "",
        });

        // clear previous body error if user started editing
        form.setFields([{ name: "body", errors: [] }]);
      });
    };

    unlayer.addEventListener("design:updated", handler);
    removeListenerRef.current = () =>
      unlayer.removeEventListener("design:updated", handler);
  };

  // cleanup listener on unmount
  useEffect(() => {
    return () => {
      if (removeListenerRef.current) removeListenerRef.current();
    };
  }, []);

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

            {/* Visual editor (no rules here) */}
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

            {/* Hidden fields for validation / submission */}
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
              <Input placeholder="eg. welcome, unsubscribe, newsletter" />
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
