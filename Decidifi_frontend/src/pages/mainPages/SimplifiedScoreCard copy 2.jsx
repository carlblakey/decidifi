import { EditOutlined } from "@ant-design/icons";
import { Table, Alert, Button, Form, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../../components";
import useContextHook from "../../hooks/useContextHook";
import { INITIAL_DATA_SIMPLE } from "../../config/dummyData";
import DecisionMakersModal from "../../components/MakeADecision/DecisionMakersModal";
import DynamicEditableTable from "../../components/MakeADecision/DynamicEditableTable";
import MultiDynamicEditableTable from "../../components/MakeADecision/MultiDynamicEditTable";
import { useSearchParams } from "react-router-dom";
import { getScoreById } from "../../api/scorecard";
import useApi from "../../hooks/useApi";
import { setAuthToken } from "../../api/client";
import { getToken, removeItem } from "../../utilities/localStorageMethods";
import toast from "react-hot-toast";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";
import { getPreviousDecisionById } from "../../api/previousDecisions";
import { SCORECARDS_ID_TYPE } from "../../utilities/localStorageKeys";

const SimplifiedScoreCard = () => {
  const user = getDefaultValUser();
  const [defaultUser, setdefaultUser] = useState({});
  const [dataSource, setDataSource] = useState(null);
  const [scorecardColumns, setScorecardColumns] = useState(null);
  const { decisionMakers, setDecisionMakers } = useContextHook();

  const [loading, setLoading] = useState(true); // Add a loading state
  const {
    data: scoreData,
    isSuccess: isScoreSuccess,
    error: errorScoreData,
    errorMessage: errorMessageScoreData,
    request: fetchScoreData,
    clearError: clearErrorScoreData,
  } = useApi(getPreviousDecisionById);

  useEffect(() => {
    setAuthToken(getToken());
    fetchScoreData(scorecardId).finally(() => setLoading(false)); // Update loading state
  }, []);

  const [searchParams] = useSearchParams();
  const isBlank = searchParams.get("isblank");
  const id = searchParams.get("id");
  const scorecardId = searchParams.get("scorecardId");
  const scorecardType = searchParams.get("scorecardType");
  const [isScordcardMdel, setIsScordcardMdel] = useState(false);
  const [decisionInfo, setdecisionInfo] = useState(null);

  const [initialData, setInitialData] = useState([]);
  const {
    data,
    isSuccess,
    error,
    errorMessage,
    loading: apiLoading,
    request,
    clearError,
  } = useApi(getScoreById);

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

  const [isDecisionMakersModalVisible, setIsDecisionMakersModalVisible] =
    React.useState(false);
  const [decisionMakersLocal, setDecisionMakersLocal] =
    useState(decisionMakers);
  const [form] = Form.useForm();

  useEffect(() => {
    if (errorScoreData) {
      if (errorMessageScoreData.status === 404 && isBlank === "false") {
        setIsScordcardMdel(true);
      }

      setTimeout(() => {
        clearErrorScoreData();
      }, 1000);
    }
    if (isScoreSuccess) {
      setdecisionInfo({
        title: scoreData.data.title,
        description: scoreData?.data?.description || "",
      });
      setScorecardColumns(scoreData.data.columns);
      setDataSource(scoreData.data.dataSource);
      setDecisionMakers(scoreData.data.contributors);
    }
  }, [errorScoreData, errorMessageScoreData, isScoreSuccess]);

  useEffect(() => {
    form.setFieldsValue({ decisionMakers });
  }, [decisionMakers]);

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
        alert("Total contribution must add up to 100%");
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
    if (error) {
      toast.error(errorMessage.message);
      clearError();
    }

    if (isSuccess) {
      setInitialData(data.data.scorecard);
    }
  }, [error, errorMessage, isSuccess, data]);

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
              Quick-View Scorecard
            </div>
          )}

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
                      rowKey="name"
                      pagination={false}
                      bordered
                      tableLayout="auto"
                      rowClassName={() => "custom-row-height"}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {isDecisionMakersModalVisible && (
            <DecisionMakersModal
              form={form}
              isAdd={false}
              handleClose={handleClose}
              handleModalOk={handleModalOk}
              isModalVisible={isDecisionMakersModalVisible}
              handleAddDecisionMaker={handleAddDecisionMaker}
              handleRemoveDecisionMaker={handleRemoveDecisionMaker}
              defaultUser={defaultUser}
            />
          )}

          {decisionMakers.length > 1 ? (
            <MultiDynamicEditableTable
              id={scorecardId}
              decisionMakers={decisionMakers}
              scorecardColumns={scorecardColumns}
              scorecardDataSource={dataSource}
              initialData={isBlank == "true" ? [] : INITIAL_DATA_SIMPLE}
              isBlank={isBlank}
              isScordcardMdel={isScordcardMdel}
              handleCancel={handleCancel}
              handleOpenDecisionModel={handleOpenDecisionModel}
              decisionName={decisionInfo}
            />
          ) : (
            <DynamicEditableTable
              id={scorecardId}
              scorecardDataSource={dataSource}
              scorecardColumns={scorecardColumns}
              scoredCardTitle={"Quick-View Scorecard"}
              initialData={isBlank == "true" ? [] : INITIAL_DATA_SIMPLE}
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

export default SimplifiedScoreCard;
