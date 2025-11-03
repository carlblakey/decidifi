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
  const latestDesignRef = useRef(null); // keep latest design JSON

  // helper: get HTML (and design) from editor as a Promise
  const exportFromEditor = () =>
    new Promise((resolve) => {
      emailEditorRef.current?.editor?.exportHtml((data) => {
        // data = { html, design }
        resolve(data || { html: "", design: null });
      });
    });

  // submit
  const handleSubmit = async (values) => {
    try {
      setSaveLoading(true);

      // final export to be safe
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
        body: html, // HTML for sending emails
        // design: design || latestDesignRef.current, // JSON for editing later
        createdBy: user.id,
      };
      console.log(payload);

      let res;
      if (id) {
        res = await updateEmailTemplate({ data: payload, id });
      } else {
        res = await createEmailTemplate(payload);
      }

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
          body: t.body || "", // hidden field (html)
          // design: t.design || "", // hidden field (json string or object)
        });

        // If you saved design JSON before, load it back.
        // t.design may be a JSON string or an object.
        const designObj =
          typeof t.design === "string" && t.design
            ? JSON.parse(t.design)
            : t.design;

        if (designObj) {
          emailEditorRef.current?.editor?.loadDesign(designObj);
          latestDesignRef.current = designObj;
        } else {
          // If you only have HTML, editor cannot "load" pure HTML.
          // You can still store it in hidden field (already set),
          // but the canvas will be empty for editing.
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

  // when the editor is ready we attach an event to keep hidden form fields in sync
  const onReady = () => {
    const unlayer = emailEditorRef.current?.editor;
    if (!unlayer) return;

    // every change -> export current html/design and sync hidden fields
    unlayer.addEventListener("design:updated", () => {
      unlayer.exportHtml((data) => {
        const html = (data && data.html) || "";
        const design = (data && data.design) || null;

        latestDesignRef.current = design;

        form.setFieldsValue({
          body: html,
          // store design as string to avoid circular structure in antd form state
          design: design ? JSON.stringify(design) : "",
        });

        // clear previous body error if user started editing
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
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
              <Input placeholder="Welcome to Decidifi" />
            </Form.Item>

            {/* The visual editor (no rules here; we validate the hidden field instead) */}
            <Form.Item label="Email Body">
              <EmailEditor
                ref={emailEditorRef}
                onReady={onReady}
                options={{
                  minHeight: 520,
                  locale: "en",
                  appearance: { theme: "modern_light" },
                  features: {
                    textEditor: { spellChecker: true },
                  },
                }}
              />
            </Form.Item>

            {/* Hidden fields that the form can validate & submit */}
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

            {/* optional: store design JSON as string to reload later */}
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
