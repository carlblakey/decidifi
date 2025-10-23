import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input, Table } from "antd";
import React, { useState } from "react";

const InDepthScorecard = ({ initialData, setInDepthData }) => {
  const initialColumns = [
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      minWidth: 90,
      render: (_, record) => {
        const rowSpan = record.rowSpan || 0;
        return rowSpan ? (
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => deleteRow(record.category)}
            danger
          />
        ) : null;
      },
      onCell: (record) => ({
        rowSpan: record.rowSpan || 0, // Set rowSpan for each row
      }),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text, record, index) => {
        // Get the rowSpan value for the current row
        const rowSpan = record.rowSpan || 0;
        return rowSpan ? <b>{text}</b> : null; // Render text only for rows with rowSpan > 0
      },
      onCell: (record) => ({
        rowSpan: record.rowSpan || 0, // Set rowSpan for each row
      }),
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
      render: (text, record, index) => {
        const rowSpan = record.rowSpan || 0;
        return rowSpan ? <b>{text}</b> : null; // Render input only for rows with rowSpan > 0
      },
      onCell: (record) => ({
        rowSpan: record.rowSpan || 0, // Set rowSpan for each row
      }),
    },
  ];

  const [columns, setColumns] = useState([...initialColumns]);

  function deleteRow(category) {
    setInDepthData((prevDataSource) =>
      prevDataSource.filter((item) => item.category !== category)
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
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

export default InDepthScorecard;
