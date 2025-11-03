import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Typography, Tag } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import { a } from "framer-motion/client";

const { Title } = Typography;

const ResultsModal = ({
  resultsData,
  setIsModalVisible,
  isModalVisible,
  loading,
}) => {
  // Define columns with styling
  const columns = [
    {
      title: "Option",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>, // Bold option names for emphasis
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score) => (
        <Tag color={score > 90 ? "gold" : score > 80 ? "blue" : "gray"}>
          {score.toFixed(2)}
        </Tag>
      ),
    },
  ];

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const dataWithKeys = resultsData.map((item, index) => ({
    ...item,
    key: index + 1, // Use 'id' if available; fallback to array index
  }));

  return (
    <>
      <Modal
        title={
          <Title
            level={4}
            style={{ color: "#1890ff", display: "flex", alignItems: "center" }}
          >
            {/* <TrophyOutlined style={{ marginRight: 8 }} /> */}
            Results Summary
          </Title>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        width={800}
        centered
        styles={{
          body: {
            padding: "24px",
            backgroundColor: "#f0f2f5", // Light background color for contrast
          },
        }}
        footer={<></>}
      >
        <Table
          columns={columns}
          dataSource={dataWithKeys.sort((a, b) => b.score - a.score)}
          pagination={false}
          loading={loading}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          style={{
            border: "1px solid #e8e8e8",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        />
      </Modal>
    </>
  );
};

export default ResultsModal;
