import { DeleteOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteContactUs } from "../../api/contactUs";
import useApi from "../../hooks/useApi";

const ContactUsTable = ({ initialData }) => {
  const [data, setData] = useState(initialData);
  const [deleteID, setDeleteID] = useState();

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
        </>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      minWidth: 200,

      render: (text) => <b>{text}</b>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      minWidth: 200,
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      minWidth: 250,
      render: (text) => <b>{text}</b>,
    },
  ];

  const {
    data: deleteSubUserData,
    isSuccess: deleteSubUserIsSuccess,
    error: deleteSubUserError,
    errorMessage: deleteSubUserErrorMessage,
    loading: deleteSubUserLoading,
    request: deleteSubUserRequest,
    clearError: deleteSubUserClearError,
  } = useApi(deleteContactUs);

  const deleteRow = (key) => {
    setDeleteID(key);
    deleteSubUserRequest(key);
  };

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // delete user
  useEffect(() => {
    // Show error toast only once
    if (deleteSubUserError) {
      toast.error(deleteSubUserErrorMessage.message);
      deleteSubUserClearError();
      setDeleteID();
    }

    if (deleteSubUserIsSuccess) {
      setData((prev) => prev.filter((item) => item._id !== deleteID));
      toast.success("The Contact Us Message has been deleted successfully");
    }
  }, [
    deleteSubUserError,
    deleteSubUserErrorMessage,
    deleteSubUserIsSuccess,
    deleteSubUserData,
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="text-lg text-black font-bold"></div>
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
    </div>
  );
};

export default ContactUsTable;
