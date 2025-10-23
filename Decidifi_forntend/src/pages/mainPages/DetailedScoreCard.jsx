import { EditOutlined } from "@ant-design/icons";
import { Table, Alert, Button, Form, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../../components";
import useContextHook from "../../hooks/useContextHook";
import {
  INITIAL_DATA_COMPLEX,
  INITIAL_DATA_SIMPLE,
} from "../../config/dummyData";
import DecisionMakersModal from "../../components/MakeADecision/DecisionMakersModal";
import MultiDynamicEditableTable from "../../components/MakeADecision/MultiDynamicEditTable";
import InDepthSimpleScoreCard from "../../components/InDepthScorecard/InDepthSimpleScorecard";
import InDepthMultipleContributors from "../../components/InDepthScorecard/InDepthMultipleContributors";
import { useSearchParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { getPreviousDecisionById } from "../../api/previousDecisions";
import { setAuthToken } from "../../api/client";
import {
  getItem,
  getToken,
  removeItem,
} from "../../utilities/localStorageMethods";
import { SCORECARDS_ID_TYPE } from "../../utilities/localStorageKeys";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";
import toast from "react-hot-toast";

const InfoMessage = ({ onClose }) => (
  <Alert
    message="Note"
    description="The sum of all weightings must equal 100%"
    type="info"
    closable
    onClose={onClose}
    showIcon
    style={{ marginBottom: 16 }} // Margin for spacing
  />
);

const DetailedScoreCard = () => {
  const decision = getItem("decision");
  const user = getDefaultValUser();
  const { decisionMakers, setDecisionMakers, scorecardName } = useContextHook();
  const [searchParams] = useSearchParams();

  const isBlank = searchParams.get("isblank");
  const scorecardId = searchParams.get("scorecardId");
  const [dataSource, setDataSource] = useState(null);
  const [scorecardColumns, setScorecardColumns] = useState(null);
  const [isScordcardMdel, setIsScordcardMdel] = useState(false);
  const [decisionInfo, setdecisionInfo] = useState({
    title: "",
    description: "",
    decision: { id: "", title: "" },
  });

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 100,
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Contribution",
      dataIndex: "contribution",
      key: "contribution",
      width: 10,
      render: (text) => <span className="text-center block">{text}</span>,
    },
  ];

  const [loading, setLoading] = useState(true); // Add a loading state
  const {
    data: scoreData,
    isSuccess: isScoreSuccess,
    error: errorScoreData,
    errorMessage: errorMessageScoreData,
    request: fetchScoreData,
    clearError: clearErrorScoreData,
    // loading,
  } = useApi(getPreviousDecisionById);

  useEffect(() => {
    setAuthToken(getToken());
    fetchScoreData(scorecardId).finally(() => setLoading(false)); // Update loading state
  }, []);

  const [isDecisionMakersModalVisible, setIsDecisionMakersModalVisible] =
    React.useState(false);

  const [decisionMakersLocal, setDecisionMakersLocal] =
    useState(decisionMakers);

  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  useEffect(() => {
    if (decision) {
      setdecisionInfo((prev) => ({ ...prev, decision }));
    }
    if (isBlank && scorecardName) {
      setdecisionInfo((prev) => ({
        ...prev,
        title: scorecardName.title,
        description: scorecardName.description,
      }));
    }
  }, []);

  useEffect(() => {
    if (errorScoreData) {
      if (errorMessageScoreData.status === 404) {
        setIsScordcardMdel(true);
      }

      setTimeout(() => {
        clearErrorScoreData();
      }, 1000);
    }
    if (isScoreSuccess) {
      setdecisionInfo((prev) => ({
        ...prev,
        title: scoreData.data.title,
        description: scoreData?.data?.description || "",
        decision: {
          ...prev.decision,
          id: scoreData?.data?.decision || "",
        },
      }));
      setScorecardColumns(scoreData.data.columns);
      setDataSource(scoreData.data.dataSource);
      setDecisionMakers(scoreData.data.contributors);
    }
  }, [errorScoreData, errorMessageScoreData, isScoreSuccess]);

  useEffect(() => {
    form.setFieldsValue({ decisionMakers });
  }, []);

  const handleClose = () => {
    setIsDecisionMakersModalVisible(false);
    form.setFieldsValue({ decisionMakers });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const totalContribution = values.decisionMakers.reduce(
        (acc, curr) => acc + curr.contribution,
        0
      );
      setDecisionMakersLocal(values.decisionMakers);

      if (totalContribution === 100) {
        setDecisionMakers(values.decisionMakers);
        setIsDecisionMakersModalVisible(false);
      } else {
        toast.error("Total contribution must add up to 100%");
      }
    });
  };

  const handleAddDecisionMaker = () => {
    setDecisionMakersLocal([
      ...decisionMakersLocal,
      { name: "", contribution: 0 },
    ]);
  };

  const handleRemoveDecisionMaker = (index) => {
    setDecisionMakersLocal(decisionMakersLocal.filter((_, i) => i !== index));
  };

  const handleClickOnEdit = () => {
    setIsDecisionMakersModalVisible(true);
  };

  const handleOpenDecisionModel = () => {
    setIsScordcardMdel(true);
  };

  const handleCancel = () => {
    setIsScordcardMdel(false);
  };

  useEffect(() => {
    removeItem(SCORECARDS_ID_TYPE);
  }, []);

  return (
    <DashboardLayout>
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <main className="flex-1 p-6">
          {decisionMakers.length > 1 && (
            <div className="text-lg text-black font-bold">
              In-Depth Scorecard
            </div>
          )}

          {/* Decision Makers Table */}
          <div className="mt-4 flex justify-start">
            <div className="min-w-[40%]">
              {decisionMakers.length > 1 ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-semibold">Decision Makers</h2>
                    {!user?.parentUserId && (
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={handleClickOnEdit}
                      >
                        Edit Contributors
                      </Button>
                    )}
                  </div>

                  <div className="w-[50%] 2xl:w-[30%]">
                    <Table
                      dataSource={decisionMakers}
                      columns={columns}
                      rowKey="name" // or another unique key
                      pagination={false} // Disable pagination if you want all displayed at once
                      bordered
                      tableLayout="auto"
                      rowClassName={() => "custom-row-height"}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Decision Makers Modal */}
          {isDecisionMakersModalVisible && (
            <DecisionMakersModal
              form={form}
              isAdd={false}
              handleClose={handleClose}
              handleModalOk={handleModalOk}
              isModalVisible={isDecisionMakersModalVisible}
              handleAddDecisionMaker={handleAddDecisionMaker}
              handleRemoveDecisionMaker={handleRemoveDecisionMaker}
              defaultUser={decisionMakers}
              form2={form2}
            />
          )}

          {/* Dynamic Editable Table */}
          {decisionMakers.length > 1 ? (
            <InDepthMultipleContributors
              decisionMakers={decisionMakers}
              initialData={isBlank == "true" ? [] : INITIAL_DATA_COMPLEX}
              id={scorecardId}
              scorecardColumns={scorecardColumns}
              scorecardDataSource={dataSource}
              isBlank={isBlank}
              isScordcardMdel={isScordcardMdel}
              handleCancel={handleCancel}
              handleOpenDecisionModel={handleOpenDecisionModel}
              decisionName={decisionInfo}
            />
          ) : (
            <InDepthSimpleScoreCard
              initialData={isBlank == "true" ? [] : INITIAL_DATA_COMPLEX}
              scoredCardTitle={"In-Depth Scorecard"}
              id={scorecardId}
              scorecardDataSource={dataSource}
              scorecardColumns={scorecardColumns}
              isBlank={isBlank}
              isScordcardMdel={isScordcardMdel}
              handleCancel={handleCancel}
              handleOpenDecisionModel={handleOpenDecisionModel}
              decisionName={decisionInfo}
            />
          )}
        </main>
      )}
    </DashboardLayout>
  );
};

export default DetailedScoreCard;
