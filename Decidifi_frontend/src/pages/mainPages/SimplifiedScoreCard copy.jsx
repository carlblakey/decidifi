import { EditOutlined } from "@ant-design/icons";
import { Table, Alert, Button, Form } from "antd";
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
import { getToken } from "../../utilities/localStorageMethods";
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

const SimplifiedScoreCard = () => {
  const { decisionMakers, setDecisionMakers } = useContextHook();
  const [searchParams] = useSearchParams();

  const isBlank = searchParams.get("isblank");
  const id = searchParams.get("id");
  const scorecardType = searchParams.get("scorecardType");

  const [initialData, setInitialData] = useState([]);
  // api call for fetch data
  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(getScoreById);

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

  useEffect(() => {
    setAuthToken(getToken());
    // request({ id, scorecardType });
  }, []);

  useEffect(() => {
    // Show error toast only once
    if (error) {
      toast.error(errorMessage.message);
      clearError();
    }

    if (isSuccess) {
      setInitialData(data.data.scorecard);
    }
  }, [error, errorMessage, isSuccess, data]);

  return (
    <DashboardLayout>
      <main className="flex-1 p-6">
        {decisionMakers.length > 1 && (
          <div className="text-lg text-black font-bold">
            Quick-View Scorecard
          </div>
        )}

        {/* Decision Makers Table */}
        <div className="mt-4 flex justify-start">
          <div className="min-w-[40%]">
            {decisionMakers.length > 1 ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">Decision Makers</h2>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleClickOnEdit}
                  >
                    Edit Contributors
                  </Button>
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
        <DecisionMakersModal
          form={form}
          isAdd={false}
          handleClose={handleClose}
          handleModalOk={handleModalOk}
          isModalVisible={isDecisionMakersModalVisible}
          handleAddDecisionMaker={handleAddDecisionMaker}
          handleRemoveDecisionMaker={handleRemoveDecisionMaker}
        />

        {/* Dynamic Editable Table */}
        {decisionMakers.length > 1 ? (
          <MultiDynamicEditableTable
            decisionMakers={decisionMakers}
            initialData={isBlank == "true" ? [] : INITIAL_DATA_SIMPLE}
          />
        ) : (
          <DynamicEditableTable
            initialData={isBlank == "true" ? [] : INITIAL_DATA_SIMPLE}
            scoredCardTitle={"Quick-View Scorecard"}
          />
        )}
      </main>
    </DashboardLayout>
  );
};

export default SimplifiedScoreCard;
