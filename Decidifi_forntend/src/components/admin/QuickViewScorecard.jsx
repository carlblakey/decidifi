import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input, Table } from "antd";
import React, { useState } from "react";

const QuickViewScorecard = ({ initialData, setQuickViewData }) => {
  const initialColumns = [
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      minWidth: 90,
      render: (_, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => deleteRow(record.key)}
          danger
        />
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Criteria",
      dataIndex: "criteria",
      key: "criteria",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Weighting %",
      dataIndex: "weighting",
      key: "weighting",
      minWidth: 120,
      align: "center",
      render: (text) => <b>{text}</b>,
    },
  ];

  const [columns, setColumns] = useState([...initialColumns]);

  function deleteRow(key) {
    setQuickViewData((prevDataSource) =>
      prevDataSource.filter((item) => item.key !== key)
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Table
          className="shadow-sm dynamic-table"
          tableLayout="auto"
          columns={columns}
          dataSource={initialData}
          scroll={{ x: columns.length * 150, y: "auto" }}
          pagination={false}
          bordered
          rowClassName={() => "custom-row-height"}
        />
      </div>
    </>
  );
};

export default QuickViewScorecard;
