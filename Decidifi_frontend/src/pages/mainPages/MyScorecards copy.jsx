import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components";
import {
  FolderOutlined,
  EyeOutlined,
  DeleteFilled,
  EditOutlined,
} from "@ant-design/icons"; // Generic icons
import { Card, Button, Typography, Row, Col, Skeleton, Space, Tag } from "antd";
import { setAuthToken } from "../../api/client";
import { getToken } from "../../utilities/localStorageMethods";
import {
  deleteBlankScoreCard,
  getAllBlankScoreCard,
} from "../../api/scorecard";
import useApi from "../../hooks/useApi";
import { useEffect } from "react";
import toast from "react-hot-toast";
import NameScorecardModal from "../../components/InDepthScorecard/NameScorecardModal";

const { Title, Text } = Typography;

const MyScorecards = () => {
  const navigate = useNavigate();
  const [isBlankScoreCardModal, setIsBlankScoreCardModal] = useState(false);
  const [deleteID, setDeleteID] = useState();
  const [singleData, setSingleData] = useState();

  const [scorecards, setScorecards] = useState([]);
  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(getAllBlankScoreCard);

  const {
    data: deleteBlankScoreCardData,
    isSuccess: deleteBlankScoreCardIsSuccess,
    error: deleteBlankScoreCardError,
    errorMessage: deleteBlankScoreCardErrorMessage,
    loading: deleteBlankScoreCardLoading,
    request: deleteBlankScoreCardRequest,
    clearError: deleteBlankScoreCardClearError,
  } = useApi(deleteBlankScoreCard);

  // set user token
  useEffect(() => {
    setAuthToken(getToken());
    request();
  }, []);

  // set all data in state
  useEffect(() => {
    // Show error toast only once
    if (error) {
      toast.error(errorMessage.message);
      clearError();
    }

    if (isSuccess && data?.data?.length) {
      setScorecards(data.data); // Update state with modified data
    }
  }, [error, errorMessage, isSuccess, data]);

  // delete user
  useEffect(() => {
    // Show error toast only once
    if (deleteBlankScoreCardError) {
      toast.error(deleteBlankScoreCardErrorMessage.message);
      deleteBlankScoreCardClearError();
    }

    if (deleteBlankScoreCardIsSuccess) {
      setScorecards((prev) => prev.filter((item) => item._id !== deleteID));
      toast.success(deleteBlankScoreCardData.message);
    }
  }, [
    deleteBlankScoreCardError,
    deleteBlankScoreCardErrorMessage,
    deleteBlankScoreCardIsSuccess,
    deleteBlankScoreCardData,
  ]);

  const handleDeleteScorecard = (id) => {
    setDeleteID(id);
    deleteBlankScoreCardRequest(id);
  };

  const handleEditScorecard = (record) => {
    setIsBlankScoreCardModal(true);
    setSingleData(record);
  };

  const handleCreateBlankScorecard = () => {
    setIsBlankScoreCardModal(true);
  };

  const handleCancelBlank = () => {
    setIsBlankScoreCardModal(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4"> My Scorecards</h2>

        <Text type="secondary" style={{ textAlign: "left", display: "block" }}>
          View and manage all your project scorecards in one place.
        </Text>

        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <Col key={idx} xs={24} sm={12} md={8}>
                <Skeleton active />
              </Col>
            ))
          ) : scorecards.length > 0 ? (
            scorecards.map((scorecard) => (
              <Col key={scorecard._id} xs={24} sm={12} md={8}>
                <Card
                  className="card-hover"
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                  title={
                    <Space>
                      <FolderOutlined />
                      <Text>{scorecard.title}</Text>
                    </Space>
                  }
                  extra={
                    <>
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        // onClick={() => handleViewScorecard(scorecard._id)}
                      >
                        View
                      </Button>
                      <Button
                        type="link"
                        icon={<DeleteFilled />}
                        onClick={() => handleDeleteScorecard(scorecard._id)}
                        style={{ color: "#d70808" }}
                        disabled={scorecard._id === deleteID}
                      ></Button>
                      {/* <Button
                        type="link"
                        icon={<EditOutlined />}
                        // onClick={() => handleEditScorecard(scorecard)}
                        style={{ color: "green" }}
                      ></Button> */}
                    </>
                  }
                >
                  {/* <Space direction="vertical">
                    <Text>
                      <strong>Type:</strong>{" "}
                      <Tag
                        color={
                          scorecard.scorecardType === "quick-view"
                            ? "blue"
                            : "green"
                        }
                      >
                        {scorecard.scorecardType}
                      </Tag>
                    </Text>
                  </Space> */}
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24} style={{ textAlign: "center" }}>
              <Text>No scorecards found.</Text>
            </Col>
          )}
        </Row>
      </div>

      <NameScorecardModal
        isVisible={isBlankScoreCardModal}
        onCancel={handleCancelBlank}
        singleData={singleData}
      />
    </DashboardLayout>
  );
};

export default MyScorecards;
