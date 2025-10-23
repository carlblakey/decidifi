import React, { useEffect, useState } from "react";
import { AdminDashboardLayout } from "../../../components";
import {
  deleteEmailTemplate,
  getEmailTemplate,
} from "../../../api/admin/emailTemplates";
import { setAuthToken } from "../../../api/client";
import { getToken } from "../../../utilities/localStorageMethods";
import toast from "react-hot-toast";
import { Table, Button, Space, Spin, Modal, Popconfirm } from "antd";
import { ROUTES } from "../../../constants";
import { Link, useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

const EmailTemplates = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [id, setId] = useState("");
  // get all email templates
  const getEmailTemplates = async () => {
    try {
      setLoading(true);
      const res = await getEmailTemplate();

      if (res?.data?.status === 200) {
        setEmails(res.data.data);
      }
    } catch (error) {
      toast.error("Error while loading email templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAuthToken(getToken());
    getEmailTemplates();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Type",
      dataIndex: "templateType",
      key: "templateType",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setPreviewContent(record.body); // HTML body from backend
              setPreviewVisible(true);
            }}
          >
            Preview
          </Button>
          <Link
            to={`${ROUTES.EMAIL_TEMPLATES_EDIT}/${record._id}`}
            style={{ color: "#1890ff" }} // Ant Design blue
          >
            Edit
          </Link>

          <Button
            type="link"
            danger
            onClick={() => handleDelete(record._id)}
            disabled={deleteLoading && record._id === id}
            loading={deleteLoading}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id) => {
    toast.dismiss();
    try {
      setId(id);
      setDeleteLoading(true);

      const res = await deleteEmailTemplate(id);
      toast.success(res.data.message);
      setEmails((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      setId("");
      toast.error(
        "There was an issue deleting the email templates please try again"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminDashboardLayout>
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <div className="p-6">
          {/* <div className="flex items-center justify-between"> */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold mb-4">Email Templates</h2>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginLeft: 8 }}
                onClick={() => navigate(ROUTES.EMAIL_TEMPLATES_ADD)}
              >
                Create
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={emails}
              rowKey="_id"
              pagination={{ pageSize: 15 }}
            />{" "}
          </div>{" "}
          {/* </div>{" "} */}
        </div>
      )}
      <Modal
        title="Email Preview"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={660}
      >
        <div
          dangerouslySetInnerHTML={{ __html: previewContent }}
          style={
            {
              // border: "1px solid #ddd",
              //padding: "15px",
              // minHeight: "400px",
              // background: "#fff",
            }
          }
        />
      </Modal>
    </AdminDashboardLayout>
  );
};

export default EmailTemplates;
