import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../../components";
import { FolderOutlined, EyeOutlined } from "@ant-design/icons"; // Generic icons
import { Card, Button, Typography, Row, Col, Skeleton, Space, Tag } from "antd";
import { getAllPreviousDecisions } from "../../api/previousDecisions";
import useApi from "../../hooks/useApi";
import { setAuthToken } from "../../api/client";
import { getToken } from "../../utilities/localStorageMethods";
import toast from "react-hot-toast";
import { ROUTES } from "../../constants";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const PreviousDecisions = () => {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState([]);
  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(getAllPreviousDecisions);

  const handleViewScorecard = (id) => {
    navigate(`${ROUTES.SIMPLIFIED_SCORECARD}?isblank=false&scorecardId=${id}`);
  };

  // set user token
  useEffect(() => {
    setAuthToken(getToken());
    request();
  }, []);

  useEffect(() => {
    // Show error toast only once
    if (error) {
      toast.error(errorMessage.message);
      clearError();
    }

    if (isSuccess && data?.data?.length) {
      setInitialData(data.data); // Update state with modified data
    }
  }, [error, errorMessage, isSuccess, data]);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Previous Decisions</h2>

        <Text type="secondary" style={{ textAlign: "left", display: "block" }}>
          View and manage all your previous decisions in one place.
        </Text>

        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <Col key={idx} xs={24} sm={12} md={8}>
                <Skeleton active />
              </Col>
            ))
          ) : initialData.length > 0 ? (
            initialData.map((curElem, index) => (
              <Col key={index} xs={24} sm={12} md={8}>
                <Card
                  className="card-hover"
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                  title={
                    <Space>
                      <FolderOutlined />
                      <Text>{curElem.title}</Text>
                    </Space>
                  }
                  extra={
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewScorecard(curElem._id)}
                    >
                      View
                    </Button>
                  }
                >
                  <Space direction="vertical">
                    <Text>{curElem.description}</Text>

                    <Text>
                      <strong>Type:</strong>{" "}
                      <Tag
                        color={
                          curElem.scorecardType === "quick-view"
                            ? "blue"
                            : "green"
                        }
                      >
                        {curElem.scorecardType}
                      </Tag>
                    </Text>
                  </Space>
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24} style={{ textAlign: "center" }}>
              <Text>No previous decisions found.</Text>
            </Col>
          )}
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default PreviousDecisions;
