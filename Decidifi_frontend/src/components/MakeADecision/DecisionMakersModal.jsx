import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, InputNumber, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Tour from "reactour";
import { setAuthToken } from "../../api/client";
import { createSubUser, getAllSubUsers } from "../../api/subUsers";
import { TOURS } from "../../config/dummyData";
import useApi from "../../hooks/useApi";
import { getToken } from "../../utilities/localStorageMethods";
import AddUserModel from "./AddUserModel";

const DEFAULT_FORM_DATA = {
  name: "",
  email: "",
  phoneNo: "",
  password: "",
};

const DecisionMakersModal = ({
  form,
  defaultUser, // Assumes this contains { name: string, entityId: string }
  handleClose,
  isAdd = true,
  handleModalOk,
  isModalVisible,
  handleAddDecisionMaker,
  handleRemoveDecisionMaker,
  saveLoading,
  form2,
}) => {
  const [errorShown, setErrorShown] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [initialData, setInitialData] = useState([]);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(getAllSubUsers);

  // Set user token and fetch data
  useEffect(() => {
    setAuthToken(getToken());
    request();
  }, []);

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(errorMessage.message);
      clearError();
    }

    if (isSuccess && data?.data?.length) {
      const modifiedData = data.data.map((item) => ({
        value: item._id, // Use `_id` as the value
        label: item.name, // Use `name` as the label
      }));
      setInitialData(modifiedData);
    }
  }, [error, errorMessage, isSuccess, data]);

  const handleAdd = async () => {
    try {
      // Validate all form fields before proceeding
      await form.validateFields();
      const values = form.getFieldsValue();
      if (values.decisionMakers.length > 1) {
        handleModalOk(values.decisionMakers);
      } else {
        toast.dismiss();
        toast.error("Add a decision maker to proceed");
      }
    } catch (errorInfo) {
      // console.log("Validation failed:", errorInfo);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    form.setFieldsValue({ decisionMakers: defaultUser });
    handleClose();
  };

  // add decision maker
  const handleAddUser = async () => {
    // Validate fields before proceeding

    const values = await form2.validateFields();
    try {
      setAddLoading(true);
      const res = await createSubUser(values); // Assuming you want to send the validated form data

      if (res.data.status === 201) {
        toast.dismiss();
        toast.success(
          "Decision maker has been added to the system successfully"
        );
        request();
        setIsAddUserModalVisible(false);
        form2.resetFields();
      }

      if (res.data.status === 400) {
        toast.dismiss();
        toast.error("Email already exists");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error occurred while adding decision maker");
    } finally {
      setAddLoading(false);
    }
  };

  const handleUserModelCancel = () => {
    setIsAddUserModalVisible(false);
    form2.resetFields();
    form2.setFieldsValue(DEFAULT_FORM_DATA);
  };

  return (
    <>
      <Modal
        title="Specify Decision Makers"
        open={isModalVisible}
        onOk={handleAdd}
        onCancel={handleCancel}
        width={600}
        footer={[
          <div className="flex justify-end gap-3">
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>

            <Button
              key="proceed"
              type="primary"
              onClick={handleAdd}
              loading={saveLoading}
              disabled={saveLoading}
            >
              Ok
            </Button>
            <Button
              type="dashed"
              onClick={() => setIsAddUserModalVisible(true)}
              icon={<PlusOutlined />}
            >
              Add Decision Maker
            </Button>
          </div>,
        ]}
      >
        <Form form={form} layout="vertical" name="decision_makers">
          <Form.List name="decisionMakers" initialValue={[defaultUser]}>
            {(fields, { add, remove }) => (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h3 style={{ margin: 0 }}>Decision Makers</h3>
                  {isAdd && (
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        add({
                          name: "",
                          entityId: "", // Set default value for entityId
                          entityType: "subUser", // Set default value for entityType
                          contribution: 0,
                        });
                        handleAddDecisionMaker();
                      }}
                    >
                      Invite Decision Maker
                    </Button>
                  )}
                </div>
                <Divider />
                <div
                  style={{
                    maxHeight: "50vh",
                    overflowY: "auto",
                    paddingRight: 16,
                  }}
                >
                  {fields.map((field, index) => (
                    <>
                      <div
                        key={field.key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <Form.Item
                          {...field}
                          name={[field.name, "name"]}
                          label={`Decision Maker ${index + 1}`}
                          rules={[
                            {
                              required: true,
                              message: "Name required",
                            },
                          ]}
                          style={{ flex: 1, marginRight: 8 }}
                        >
                          {index === 0 ? (
                            <Input
                              placeholder="Name"
                              value={defaultUser?.name}
                              disabled // Disable the field for the default user
                            />
                          ) : (
                            <Select
                              style={{
                                width: "100%",
                              }}
                              loading={loading}
                              showSearch
                              placeholder="Search to Select"
                              optionFilterProp="label"
                              filterSort={(optionA, optionB) =>
                                (optionA?.label ?? "")
                                  .toLowerCase()
                                  .localeCompare(
                                    (optionB?.label ?? "").toLowerCase()
                                  )
                              }
                              options={initialData.filter(
                                (option) =>
                                  !form
                                    .getFieldsValue()
                                    .decisionMakers.some(
                                      (maker) => maker.entityId === option.value
                                    )
                              )} // Filter selected users
                              onChange={(value, option) => {
                                // Dynamically update form fields
                                form.setFieldsValue({
                                  decisionMakers: form
                                    .getFieldsValue()
                                    .decisionMakers.map((maker, idx) =>
                                      idx === index
                                        ? {
                                            ...maker,
                                            entityId: value,
                                            name: option.label,
                                          }
                                        : maker
                                    ),
                                });
                              }}
                            />
                          )}
                        </Form.Item>

                        <Form.Item
                          {...field}
                          name={[field.name, "entityId"]}
                          hidden // Hide the entityId field but include it in the form
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "entityType"]}
                          hidden // Hide the entityType field but include it in the form
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "contribution"]}
                          label="Contribution %"
                          rules={[
                            {
                              required: true,
                              message: "Please input contribution",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (value === 0) {
                                  return Promise.reject(
                                    new Error("Contribution cannot be 0")
                                  );
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                          style={{ width: "30%", marginRight: 8 }}
                        >
                          <InputNumber min={0} max={100} />
                        </Form.Item>

                        {index > 0 && (
                          <Button
                            type="text"
                            icon={<MinusCircleOutlined />}
                            onClick={() => {
                              remove(field.name);
                              handleRemoveDecisionMaker(index);
                            }}
                            style={{ color: "#ff4d4f" }}
                          />
                        )}
                      </div>
                    </>
                  ))}
                </div>
              </>
            )}
          </Form.List>
        </Form>

        <Tour
          steps={TOURS.DECISION_MAKERS}
          isOpen={isTourOpen}
          onRequestClose={() => setIsTourOpen(false)}
        />
      </Modal>

      {isAddUserModalVisible && (
        <AddUserModel
          handleClose={handleUserModelCancel}
          isModalVisible={isAddUserModalVisible}
          handleModalOk={handleAddUser}
          form={form2}
          sigleData={null}
          DEFAULT_FORM_DATA={DEFAULT_FORM_DATA}
          loading={addLoading}
        />
      )}
    </>
  );
};

export default DecisionMakersModal;
