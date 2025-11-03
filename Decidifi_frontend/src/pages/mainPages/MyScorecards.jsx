import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../../components";
import { FolderOutlined, EyeOutlined } from "@ant-design/icons"; // Generic icons
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Skeleton,
  Space,
  Tag,
  Spin,
  Divider,
} from "antd";
import { getAllPreviousDecisions } from "../../api/previousDecisions";
import useApi from "../../hooks/useApi";
import { setAuthToken } from "../../api/client";
import { getItem, getToken } from "../../utilities/localStorageMethods";
import toast from "react-hot-toast";
import { ROUTES } from "../../constants";
import { useNavigate } from "react-router-dom";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";
import { SCORECARDS_ID_TYPE } from "../../utilities/localStorageKeys";

const { Title, Text } = Typography;
const MyScorecards = () => {
  const user = getDefaultValUser();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState([]);
  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(getAllPreviousDecisions);

  useEffect(() => {
    const idType = getItem(SCORECARDS_ID_TYPE);
    if (idType && idType.id && idType.type) {
      handleViewScorecard(idType.id, idType.type);
    }
  }, []);

  const handleViewScorecard = (id, type) => {
    type === "quick-view"
      ? navigate(
          `${ROUTES.SIMPLIFIED_SCORECARD}?isblank=false&scorecardId=${id}`
        )
      : navigate(
          `${ROUTES.DETAILED_SCORECARD}?isblank=false&scorecardId=${id}`
        );
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
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {user?.parentUserId ? "My Contributions" : "My Scorecards"}
          </h2>

          <Text
            type="secondary"
            style={{ textAlign: "left", display: "block" }}
          >
            View and manage all your project scorecards in one place.
          </Text>

          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            {initialData.length > 0 ? (
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
                        onClick={() =>
                          handleViewScorecard(
                            curElem._id,
                            curElem.scorecardType
                          )
                        }
                      >
                        View
                      </Button>
                    }
                    type="link"
                    onClick={() =>
                      handleViewScorecard(curElem._id, curElem.scorecardType)
                    }
                  >
                    <Space direction="vertical">
                      {curElem?.decision?.title && (
                        <>
                          <Text>{curElem?.decision?.title}</Text>
                          <Divider style={{ margin: "8px 0" }} />
                        </>
                      )}
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
      )}
    </DashboardLayout>
  );
};

export default MyScorecards;
