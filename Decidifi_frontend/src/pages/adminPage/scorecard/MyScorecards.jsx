import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons"; // Generic icons
import { Button, Card, Col, Row, Space, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../../api/client";
import { deleteScoreCard, getAllScoreCard } from "../../../api/scorecard";
import { AdminDashboardLayout } from "../../../components";
import { ROUTES } from "../../../constants";
import useApi from "../../../hooks/useApi";
import { getToken } from "../../../utilities/localStorageMethods";

const { Title, Text } = Typography;
const MyScorecards = () => {
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteScorecardId, setDeleteScorecardId] = useState("");
  const [initialData, setInitialData] = useState([]);
  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(getAllScoreCard);

  const handleViewScorecard = (id = null) => {
    id
      ? navigate(`${ROUTES.SCORECARD_CREATE}?scorecardId=${id}`)
      : navigate(ROUTES.SCORECARD_CREATE);
  };

  const handleDeleteScorecard = async (id) => {
    try {
      setDeleteScorecardId(id);
      setDeleteLoading(true);

      const res = await deleteScoreCard(id);
      toast.success(res.data.message);
      setInitialData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      setDeleteScorecardId("");
      toast.error("There was an issue deleting the scorecard please try again");
    } finally {
      setDeleteLoading(false);
    }
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
    <AdminDashboardLayout>
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-4">My Scorecards</h2>

              <Text
                type="secondary"
                style={{ textAlign: "left", display: "block" }}
              >
                View and manage all your project scorecards in one place.
              </Text>
            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginLeft: 8 }}
              onClick={() => handleViewScorecard()}
            >
              Create
            </Button>
          </div>

          <Row gutter={[16, 16]} style={{ marginTop: 30 }}>
            {initialData.length > 0 ? (
              initialData.map((curElem, index) => (
                <Col key={index} xs={24} sm={12} md={8}>
                  <Card
                    className="card-hover admin-scorecard"
                    style={{
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                    title={
                      <Space>
                        {/* <FolderOutlined /> */}
                        <Text>{curElem.title}</Text>
                      </Space>
                    }
                    type="link"
                    onClick={() => handleViewScorecard(curElem._id)}
                  >
                    <div className="text-end">
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewScorecard(curElem._id)}
                      >
                        View
                      </Button>
                      <Button
                        danger
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteScorecard(curElem._id)}
                        disabled={
                          deleteLoading && curElem._id === deleteScorecardId
                        }
                        loading={deleteLoading}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24} style={{ textAlign: "center" }}>
                <Text>No previous scorecards found.</Text>
              </Col>
            )}
          </Row>
        </div>
      )}
    </AdminDashboardLayout>
  );
};

export default MyScorecards;
