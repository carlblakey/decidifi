import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input, Select, Spin, Upload } from "antd";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createDecision, updateDecision } from "../../../api/admin/decisions";
import { setAuthToken } from "../../../api/client";
import { allDecisionLibrary } from "../../../api/decisionLibrary";
import { getAllScoreCard } from "../../../api/scorecard";
import { AdminDashboardLayout } from "../../../components";
import { ROUTES } from "../../../constants";
import useApi from "../../../hooks/useApi";
import { getToken } from "../../../utilities/localStorageMethods";

const { Option } = Select;

const CreateDecision = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [scoreCards, setScoreCards] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [searchParams] = useSearchParams();
  const decisionId = searchParams.get("decisionId");

  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(getAllScoreCard);

  // for update single data // get all categories
  const getDecision = async () => {
    try {
      setGetLoading(true);
      const res = await allDecisionLibrary();
      const singleData = (res?.data?.data || []).find(
        (decision) => decision._id === decisionId
      );

      const decision = {
        ...singleData,
        decisions: singleData.decisions.map((item) => item._id),
      };

      form.setFieldsValue(decision);
      setPreview(decision?.image || "");

      if (res.data.status === 401) {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error while loading decision");
    } finally {
      setGetLoading(false);
    }
  };

  // Handle file change
  const handleFileChange = ({ fileList }) => {
    if (fileList.length > 0) {
      setFile(fileList[0].originFileObj);
      // Generate image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result); // Set preview URL
      };
      reader.readAsDataURL(fileList[0].originFileObj);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSaveLoading(true);
      // Create FormData object
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("parentCategory", values.parentCategory);
      formData.append("description", values.description);

      // Append decisions as an array
      values.decisions.forEach((decision, index) => {
        formData.append(`decisions[${index}]`, decision);
      });

      // Append image file if available
      if (file) {
        formData.append("image", file, file.name);
      }

      let res;
      if (decisionId) {
        res = await updateDecision({ id: decisionId, data: formData });
      } else {
        res = await createDecision(formData);
      }

      if (res.data.status === 201 || res.data.status === 200) {
        toast.success(res.data.message);
        form.resetFields();
        navigate(ROUTES.DECISIONS);
      }
      if (res.data.status === 401) {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error creating decision");
    } finally {
      setSaveLoading(false);
    }
  };

  // set user token
  useEffect(() => {
    setAuthToken(getToken());
    request();
    if (decisionId) {
      getDecision();
    }
  }, []);

  useEffect(() => {
    // Show error toast only once
    if (error) {
      toast.error(errorMessage.message);
      clearError();
    }

    if (isSuccess && data?.data?.length) {
      setScoreCards(data.data); // Update state with modified data
    }
  }, [error, errorMessage, isSuccess, data]);

  return (
    <AdminDashboardLayout>
      {getLoading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spin size="large" />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto p-10 bg-white shadow-lg rounded-xl">
          <h2 className="text-4xl font-bold mb-6 text-gray-800 text-center">
            {decisionId ? "Update Decision" : "Create Decision"}
          </h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6"
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[
                { required: true, message: "Please enter decision title" },
              ]}
            >
              <Input placeholder="Enter decision title" />
            </Form.Item>

            <Form.Item
              name="parentCategory"
              label="Parent Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select Category">
                <Option value="Life Decisions">Life Decisions</Option>
                <Option value="Personal Decisions">Personal Decisions</Option>
                <Option value="Professional Decisions">
                  Professional Decisions
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter a description" },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter decision description"
              />
            </Form.Item>

            <Form.Item
              name="decisions"
              label="Scorecards"
              rules={[
                {
                  required: true,
                  message: "Please select at least one scorecard",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select Scorecards"
                loading={loading}
              >
                {scoreCards.map((curElem) => (
                  <Option value={curElem._id} key={curElem._id}>
                    {curElem.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="image"
              label="Upload Image"
              rules={[
                {
                  required: true,
                  message: "Please upload an image",
                },
              ]}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*"
                onChange={handleFileChange}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            {preview && (
              <div className="mt-4">
                <Image
                  width={200}
                  src={preview}
                  alt="Preview"
                  style={{
                    marginTop: 10,
                    borderRadius: 10,
                  }}
                />
              </div>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={saveLoading}
              >
                {decisionId ? "Update Decision" : "Create Decision"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </AdminDashboardLayout>
  );
};

export default CreateDecision;
