import Tour from "reactour";
import { v4 as uuidv4 } from "uuid";
import { ROUTES } from "../../constants";
import { Button, Modal, Form } from "antd";
import { useEffect, useState } from "react";
import { CiLock, CiUnlock } from "react-icons/ci";
import { DashboardLayout } from "../../components";
import useContextHook from "../../hooks/useContextHook";
import { DEFAULT_DECISION_MAKERS, TOURS } from "../../config/dummyData";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";
import DecisionMakersModal from "../../components/MakeADecision/DecisionMakersModal";

const Scorecard = () => {
  const user = getDefaultValUser();
  const [isInitialModalVisible, setIsInitialModalVisible] = useState(false);
  const [activeCardRoute, setActiveCardRoute] = useState(
    ROUTES.SIMPLIFIED_SCORECARD
  );
  const [isDecisionMakersModalVisible, setIsDecisionMakersModalVisible] =
    useState(false);

  const [defaultUser, setdefaultUser] = useState({});
  const { decisionMakers, setDecisionMakers } = useContextHook();

  const [isTourOpen, setIsTourOpen] = useState(false);

  const [searchParams] = useSearchParams();

  const isBlank = searchParams.get("isblank");
  // const id = searchParams.get("id");

  useEffect(() => {
    const defaultUser = [
      {
        entityId: user.id,
        name: user.name,
        entityType: "user",
        contribution: 100,
      },
    ];
    setdefaultUser(defaultUser);
    setDecisionMakers(defaultUser);
    form.setFieldsValue({ decisionMakers: defaultUser });
  }, []);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const hasAccessToSimple = true;
  const hasAccessToComplex = true;

  const handleClick = (path) => {
    setActiveCardRoute(path);
    setIsInitialModalVisible(true);
  };

  const handleInitialModalOk = () => {
    setIsInitialModalVisible(false);
    setIsDecisionMakersModalVisible(true);
  };

  const handleInitialModalCancel = () => {
    setIsInitialModalVisible(false);
    navigate(activeCardRoute); // or use the path dynamically as needed
  };

  const handleAddDecisionMaker = () => {
    setDecisionMakers([
      ...decisionMakers,
      { name: "", contribution: 0, entityType: "subUser" },
    ]);
  };

  const handleRemoveDecisionMaker = (index) => {
    setDecisionMakers(decisionMakers.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setDecisionMakers([]);
    setIsDecisionMakersModalVisible(false);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const totalContribution = values.decisionMakers.reduce(
        (acc, curr) => acc + curr.contribution,
        0
      );
      setDecisionMakers(values.decisionMakers);

      if (totalContribution === 100) {
        setIsDecisionMakersModalVisible(false);
        navigate(activeCardRoute);
      } else {
        alert("Total contribution must add up to 100%");
      }
    });
  };

  return (
    <DashboardLayout>
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Make A Decision</h2>
        <p className="mb-5">Select the scorecard you'd like to use:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Simple Scorecard */}
          <div className="quick-view-card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-between">
            <h3 className="text-xl font-bold mb-4">Quick-View Scorecard</h3>
            <p className="mb-4">
              Opt for a Quick-View scorecard for fast insights.
            </p>

            {hasAccessToSimple ? (
              <CiUnlock className="h-16 w-16 text-green-500 mb-4" />
            ) : (
              <CiLock className="h-16 w-16 text-red-500 mb-4" />
            )}
            <Button
              className={`text-white py-5 rounded ${
                hasAccessToSimple
                  ? "bg-primary hover:bg-primary"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              disabled={!hasAccessToSimple}
              type="primary"
              block
              onClick={() =>
                handleClick(
                  `${
                    ROUTES.SIMPLIFIED_SCORECARD
                  }?isblank=${isBlank}&scorecardId=${uuidv4()}`
                )
              }
            >
              {hasAccessToSimple ? "Access Quick-View Scorecard" : "Locked"}
            </Button>
          </div>

          {/* Complex Scorecard */}
          <div className="in-depth-card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-between">
            <h3 className="text-xl font-bold mb-4">In-Depth Scorecard</h3>
            <p className="mb-4">
              Opt for an In-Depth scorecard for detailed analysis.
            </p>

            {hasAccessToComplex ? (
              <CiUnlock className="h-16 w-16 text-green-500 mb-4" />
            ) : (
              <CiLock className="h-16 w-16 text-red-500 mb-4" />
            )}
            <Button
              className={`text-white py-5 rounded ${
                hasAccessToComplex
                  ? "bg-primary hover:bg-primary"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              disabled={!hasAccessToComplex}
              type="primary"
              block
              onClick={() =>
                handleClick(
                  `${
                    ROUTES.DETAILED_SCORECARD
                  }?isblank=${isBlank}&scorecardId=${uuidv4()}`
                )
              }
            >
              {hasAccessToComplex ? "Access In-Depth Scorecard" : "Locked"}
            </Button>
          </div>
        </div>

        {/* Initial Modal */}
        <Modal
          title="Add Decision Makers"
          open={isInitialModalVisible}
          onOk={handleInitialModalOk}
          onCancel={handleInitialModalCancel}
          okText="Yes"
          cancelText="No"
        >
          <p>Would you like to include additional decision makers?</p>
        </Modal>

        {/* Decision Makers Modal */}
        <DecisionMakersModal
          form={form}
          handleClose={handleClose}
          handleModalOk={handleModalOk}
          isModalVisible={isDecisionMakersModalVisible}
          handleAddDecisionMaker={handleAddDecisionMaker}
          handleRemoveDecisionMaker={handleRemoveDecisionMaker}
          defaultUser={defaultUser}
        />

        <Tour
          isOpen={isTourOpen}
          steps={TOURS.SCORECARD}
          onRequestClose={() => setIsTourOpen(false)}
        />
      </main>
    </DashboardLayout>
  );
};

export default Scorecard;
