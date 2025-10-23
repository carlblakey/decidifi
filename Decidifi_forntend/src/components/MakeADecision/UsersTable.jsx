import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Form, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  cancelSingleSubscription,
  cancelSubscription,
} from "../../api/payment";
import {
  createSubUser,
  deleteSubUser,
  updateSubUser,
} from "../../api/subUsers";
import { deleteUser, updateUsers } from "../../api/user";
import useApi from "../../hooks/useApi";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";
import AddUserModel from "./AddUserModel";

const DEFAULT_FORM_DATA = {
  name: "",
  email: "",
  phoneNo: "",
  password: "",
};
const UsersTable = ({ initialData, title, role }) => {
  const user = getDefaultValUser();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState(initialData);
  const [sigleData, setsigleData] = useState({});
  const [deleteID, setDeleteID] = useState();
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const subscriptionPlans = [
    {
      id: "SINGLE_SCORECARD",
      name: "Single Scorecard Access",
      description:
        "Access to a single quick-view and in-depth scorecard for one year.",
      price: "9.99",
    },
    {
      id: "UNLIMITED",
      name: "Unlimited Scorecard Access",
      description:
        "Access to over 250 quick-view and 250 in-depth scorecards for one year.",
      price: "49.99",
      badge: "Popular",
    },
    {
      id: "DEFAULT",
      name: "Free Trial Access",
      description: "Access to all scorecards for 48 hours.",
      price: "Free",
    },
  ];

  const initialColumns = [
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      minWidth: 90,
      render: (_, record) => (
        <>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            disabled={record._id === deleteID}
            onClick={() => deleteRow(record._id)}
            danger
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => updateRow(record)}
            // success
          />
        </>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <b>{text}</b>,
    },
    ...(role === "admin"
      ? [
          {
            title: "Subscription",
            dataIndex: "subscription",
            key: "subscription",
            render: (_, record) => {
              const planId = record.subscription?.planId?.toUpperCase(); // Prevent errors if planId is undefined
              const subscription = subscriptionPlans.find(
                (item) => item.id === planId
              );

              return <b>{subscription?.name || "-"}</b>;
            },
          },
          {
            title: "Status",
            dataIndex: "subscription",
            key: "subscription_status",
            render: (_, record) => {
              const isActive = record.subscription?.currentStatus === "active";
              const plan = record?.subscription?.planId;

              return (
                <Tag
                  color={isActive ? "success" : "error"}
                  className={
                    isActive &&
                    plan &&
                    plan?.toUpperCase() !== "DEFAULT" &&
                    "cursor-pointer"
                  }
                  onClick={
                    isActive && plan && plan?.toUpperCase() !== "DEFAULT"
                      ? () => handleSubscription(record)
                      : undefined
                  }
                  icon={
                    record._id === sigleData._id &&
                    loading && <SyncOutlined spin />
                  }
                >
                  {record.subscription?.currentStatus}
                </Tag>
              );
            },
          },
        ]
      : []),
  ];

  const {
    data: updateData,
    isSuccess: updateIsSuccess,
    error: updateError,
    errorMessage: updateErrorMessage,
    loading: updateLoading,
    request: updateRequest,
    clearError: updateClearError,
  } = useApi(role === "admin" ? updateUsers : updateSubUser);

  const {
    data: deleteSubUserData,
    isSuccess: deleteSubUserIsSuccess,
    error: deleteSubUserError,
    errorMessage: deleteSubUserErrorMessage,
    loading: deleteSubUserLoading,
    request: deleteSubUserRequest,
    clearError: deleteSubUserClearError,
  } = useApi(role === "admin" ? deleteUser : deleteSubUser);

  const deleteRow = (key) => {
    setDeleteID(key);
    deleteSubUserRequest(key);
  };
  const updateRow = (data) => {
    setsigleData(data);
    setIsModalVisible(true);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (values._id) {
        role === "admin"
          ? updateRequest({
              id: values._id,
              data: { ...values, type: "Client" },
            })
          : updateRequest({ ...values, subUserId: values._id });
      } else {
        addUsers(values);
      }
    });
  };

  // add decision maker
  const addUsers = async (values) => {
    toast.dismiss();
    try {
      setAddLoading(true);
      const res = await createSubUser(values); // Assuming you want to send the validated form data

      if (res.data.status === 201) {
        setData((prev) => [
          ...prev,
          { ...res.data.data, key: res.data.data._id },
        ]);
        // toast.success("The decision maker has been added to collaborates");
        toast.success(
          "Decision maker has been added to the system successfully"
        );
        setIsModalVisible(false);
        form.resetFields();
      }

      if (res.data.status === 400) {
        toast.error("Email already exists");
      }
    } catch (error) {
      toast.error("Error occurred while adding decision maker");
    } finally {
      setAddLoading(false);
    }
  };

  const handleSubscription = async (record) => {
    setLoading(true);
    setsigleData(record);
    toast.dismiss();
    const status =
      record.subscription.currentStatus === "active" ? "cancelled" : "active";

    try {
      let res;
      if (record.subscription.planId.toUpperCase() === "UNLIMITED") {
        res = await cancelSubscription({ email: record.email });
      } else if (
        record.subscription.planId.toUpperCase() === "SINGLE_SCORECARD"
      ) {
        const ids = record.purchasedScorecards.map((p) => p.scorecardId);
        res = await cancelSingleSubscription({
          email: record.email,
          subscriptions: ids,
        });
      }

      if (res.data.status === 200) {
        toast.success(res.data.message);
        setData((prev) => {
          if (!prev || !prev.length) return prev;
          const updateUser = prev.map((user) => {
            if (user._id === record._id) {
              return {
                ...user,
                subscription: { ...user.subscription, currentStatus: status },
              };
            }
            return user;
          });
          return updateUser;
        });
      }
      if (res.data.status === 401) {
        toast.error(res.data.message);
      }
      if (res.data.status === 404) {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error updating subscription");
    } finally {
      setsigleData({});
      setLoading(false);
    }
  };

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // update user
  useEffect(() => {
    toast.dismiss();
    // Show error toast only once
    if (updateError) {
      toast.error("Error occurred while updating decision maker");
      updateClearError();
    }

    if (updateIsSuccess) {
      setData((prev) =>
        prev.map((curElem) => {
          if (curElem._id === updateData.data._id) {
            return updateData.data;
          }
          return curElem;
        })
      );
      toast.success("Decision maker updated successfully");
      setIsModalVisible(false);
      setsigleData({});
      form.resetFields();
    }
  }, [updateError, updateErrorMessage, updateIsSuccess, updateData]);

  // delete user
  useEffect(() => {
    toast.dismiss();
    // Show error toast only once
    if (deleteSubUserError) {
      toast.error("Decision maker not found");
      deleteSubUserClearError();
      setDeleteID();
    }

    if (deleteSubUserIsSuccess) {
      setData((prev) => prev.filter((item) => item._id !== deleteID));
      toast.success("Decision maker deleted successfully");
      setIsModalVisible(false);
      form.resetFields();
    }
  }, [
    deleteSubUserError,
    deleteSubUserErrorMessage,
    deleteSubUserIsSuccess,
    deleteSubUserData,
  ]);

  const handleCancel = () => {
    setIsModalVisible(false);
    setsigleData({});
    form.resetFields();
    form.setFieldsValue(DEFAULT_FORM_DATA);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="text-lg text-black font-bold"></div>
        {role === "client" && (
          <div>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              {title}
            </Button>
          </div>
        )}
      </div>

      <Table
        className="shadow-sm overflow-auto dynamic-table"
        tableLayout="auto"
        columns={initialColumns}
        dataSource={data}
        scroll={{ x: initialColumns.length * 150, y: "auto" }}
        pagination={false}
        bordered
        rowClassName={() => "custom-row-height"}
      />

      {isModalVisible && (
        <AddUserModel
          handleClose={handleCancel}
          isModalVisible={isModalVisible}
          handleModalOk={handleModalOk}
          form={form}
          sigleData={sigleData}
          DEFAULT_FORM_DATA={DEFAULT_FORM_DATA}
          loading={addLoading || updateLoading}
        />
      )}
    </div>
  );
};

export default UsersTable;
