import React, { useState, useEffect } from "react";
import {
  Radio,
  Card,
  Button,
  Typography,
  Row,
  Col,
  Badge,
  Collapse,
  Checkbox,
  Tooltip,
} from "antd";
import { DashboardLayout, Spinner } from "../../components";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";
import useApi from "../../hooks/useApi";
import { activateFreeTrial, payment } from "../../api/payment";
import { allLibrary } from "../../api/decisionLibrary";
import { SUBSCRIPTION_PLAN, USER_KEY } from "../../utilities/localStorageKeys";
import { convertData } from "./MakeADecision copy";
import { setObjectInLocalStorage } from "../../utilities/localStorageMethods";
import toast from "react-hot-toast";
import Unsubscribe from "../../components/model/Unsubscribe";
import SingleUnsubscribe from "../../components/model/SingleUnsubscribe";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const ManageSubscription = () => {
  const navigate = useNavigate();
  const user = getDefaultValUser();

  const subscriptionPlans = [
    {
      id: "SINGLE_SCORECARD",
      name: "Single Scorecard Access",
      description:
        "Access to a single quick-view and in-depth scorecard for one year.",
      price: "9.99",
    },
    {
      id: "UNLIMITED",
      name: "Unlimited Scorecard Access",
      description:
        "Access to over 250 quick-view and 250 in-depth scorecards for one year.",
      price: "49.99",
      badge: "Popular",
    },
    {
      id: "DEFAULT",
      name: "Free Trial Access",
      description: "Access to all scorecards for 48 hours.",
      price: "Free",
    },
    {
      id: "UNSUBSCRIBE",
      name: "Cancel Subscription",
      description:
        "Canceling stops auto-renewal, but you’ll retain subscription access until your billing period ends.",
    },
  ];

  const [unsubscribeModel, setUnsubscribeModel] = useState({
    unlimited: false,
    single_scorecard: false,
  });
  const [selectedPlan, setSelectedPlan] = useState({});
  const [decision, setDecision] = useState([]);
  const [selectedDecisions, setSelectedDecisions] = useState([]);
  // const [isDefaultDisabled, setIsDefaultDisabled] = useState(false);

  // for UNLIMITED subscribtion
  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(payment);
  // for DEFAULT subscribtion
  const {
    data: freeTrial,
    isSuccess: isSuccessFreeTrial,
    error: errorFreeTrial,
    errorMessage: errorMessageFreeTrial,
    loading: loadingFreeTrial,
    request: requestFreeTrial,
    clearError: clearErrorFreeTrial,
  } = useApi(activateFreeTrial);
  // get Scorecard
  const {
    data: allLibraryData,
    isSuccess: isSuccessAllLibrary,
    error: errorAllLibrary,
    errorMessage: errorMessageAllLibrary,
    loading: loadingAllLibrary,
    request: requestAllLibrary,
    clearError: clearErrorAllLibrary,
  } = useApi(allLibrary);

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
    setSelectedDecisions([]);

    if (error) {
      clearError();
    }
    if (errorFreeTrial) {
      clearErrorFreeTrial();
    }
    if (errorAllLibrary) {
      clearErrorAllLibrary();
    }
  };

  const handleDecisionChange = (decisionId) => {
    setSelectedDecisions((prev) => {
      // Check if the decision already exists
      const exists = prev.some((curElem) => curElem.scorecardId === decisionId);

      if (exists) {
        // Remove the decision if it already exists
        return prev.filter((curElem) => curElem.scorecardId !== decisionId);
      } else {
        // Add the new decision
        return [...prev, { currentStatus: "active", scorecardId: decisionId }];
      }
    });
  };

  const getActiveScoreCard = (data) => {
    return data
      .filter((curElem) => curElem?.currentStatus === "active") // Filter active decisions
      .map((item) => item.scorecardId); // Get the scorecardIds of active decisions
  };
  // check new scroecad
  const handleNewSelectedDecisions = (data) => {
    const scores = getActiveScoreCard(data);
    const newSelectedDecisions = scores.filter(
      (id) =>
        !user?.purchasedScorecards?.some(
          (scorecard) => scorecard.scorecardId === id
        ) // Check if the scorecardId is not in user.purchasedScorecards
    );
    return newSelectedDecisions; // Return the filtered scorecardIds
  };

  const handlePayment = () => {
    const newSelectedDecisions = handleNewSelectedDecisions(selectedDecisions);

    const price =
      selectedPlan.id === "UNLIMITED"
        ? selectedPlan.price
        : selectedPlan.price * newSelectedDecisions.length;
    const payload = {
      env: "PROD",
      packages: [
        {
          price_data: {
            unit_amount: price,
            currency: "usd",
            product_data: {
              name: selectedPlan.name,
            },
          },
          quantity: 1,
        },
      ],
      subscriptionDetails: {
        planId: selectedPlan.id,
        durationInDays: 365,
      },
      email: user.email,
      scorecards: newSelectedDecisions,
    };

    if (selectedPlan.id === "DEFAULT") {
      requestFreeTrial({ email: user.email });
    } else {
      request(payload);
    }
  };

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(
        "We couldn't activate your subscription. Please verify your payment details and try again"
      );
    }

    if (isSuccess) {
      const newSelectedDecisions =
        handleNewSelectedDecisions(selectedDecisions);
      if ((data.status = 200)) {
        const price =
          selectedPlan.id === "UNLIMITED"
            ? selectedPlan.price
            : selectedPlan.price * newSelectedDecisions.length;

        setObjectInLocalStorage(SUBSCRIPTION_PLAN, {
          ...selectedPlan,
          price,
          purchasedScorecards: selectedDecisions,
        });
        window.location.href = data.redirectUrl;
      }
    }
  }, [error, errorMessage, isSuccess, data]);

  useEffect(() => {
    if (errorFreeTrial) {
      toast.dismiss();
      toast.error(
        "We couldn't activate your free trial. Please try again shortly"
      );
    }

    if (isSuccessFreeTrial) {
      toast.dismiss();
      toast.success("Free trial activated successfully");
      setObjectInLocalStorage(USER_KEY, {
        ...user,
        subscription: selectedPlan.id.toLowerCase(),
        purchasedScorecards: selectedDecisions,
        currentStatus: "cancelled",
      });
    }
  }, [errorFreeTrial, errorMessageFreeTrial, isSuccessFreeTrial, freeTrial]);

  useEffect(() => {
    if (errorAllLibrary) {
      toast.dismiss();
      toast.error(errorMessageAllLibrary.message);
    }

    if (isSuccessAllLibrary) {
      const convertedData = convertData(allLibraryData.data);
      setDecision(convertedData);
      if (user?.subscription?.toUpperCase() === "SINGLE_SCORECARD") {
        setSelectedDecisions(user?.purchasedScorecards);
      }
    }
  }, [
    errorAllLibrary,
    errorMessageAllLibrary,
    isSuccessAllLibrary,
    allLibraryData,
  ]);

  useEffect(() => {
    const currentSubscription = subscriptionPlans?.find(
      (item) => item.id === user?.subscription?.toUpperCase()
    );
    setSelectedPlan(currentSubscription);
  }, []);

  useEffect(() => {
    if (selectedPlan?.id === "SINGLE_SCORECARD") {
      requestAllLibrary();
    }
  }, [selectedPlan]);

  //
  const handleUnsubscribe = () => {
    const subscription = user?.subscription?.toLowerCase();
    setUnsubscribeModel((prev) => ({
      ...prev,
      [subscription]: !prev[subscription],
    }));
  };

  return (
    <>
      <DashboardLayout>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Manage Subscription</h2>
          <Text
            type="secondary"
            style={{ textAlign: "left", display: "block" }}
            className="mb-4"
          >
            Select a subscription plan that suits your needs:
          </Text>

          <Row gutter={[16, 16]} justify="center">
            {subscriptionPlans.map((plan) => (
              <Col key={plan.id} xs={24} sm={24} md={12} lg={8} xl={6}>
                <Badge.Ribbon
                  text={
                    user?.subscription?.toUpperCase() === "SINGLE_SCORECARD" ||
                    user?.subscription?.toUpperCase() === "DEFAULT"
                      ? "Active"
                      : user?.currentStatus?.charAt(0)?.toUpperCase() +
                        user?.currentStatus?.slice(1)
                  }
                  color="red"
                  style={{
                    visibility:
                      user?.subscription?.toUpperCase() === plan.id
                        ? "visible"
                        : "hidden",
                  }}
                >
                  <Card
                    style={{
                      minHeight: "215px",
                      borderRadius: "10px",
                      transition: "all 0.3s",
                      boxShadow:
                        selectedPlan === plan.id
                          ? "0 8px 16px rgba(24, 144, 255, 0.4)"
                          : "0 4px 8px rgba(0, 0, 0, 0.1)",
                      border:
                        selectedPlan === plan.id
                          ? "2px solid #1890ff"
                          : "1px solid #d9d9d9",
                    }}
                    hoverable
                  >
                    <Radio.Group value={selectedPlan?.id}>
                      <Radio
                        value={plan.id}
                        onChange={() => handlePlanChange(plan)}
                        disabled={
                          (plan.id === "DEFAULT" &&
                            (selectedPlan?.id === "UNLIMITED" ||
                              selectedPlan?.id === "SINGLE_SCORECARD" ||
                              selectedPlan?.id === "UNSUBSCRIBE")) ||
                          (plan?.id === "UNSUBSCRIBE" &&
                            selectedPlan?.id === "UNLIMITED" &&
                            user?.currentStatus === "cancelled") ||
                          (plan?.id === "UNSUBSCRIBE" &&
                            selectedPlan?.id === "SINGLE_SCORECARD" &&
                            getActiveScoreCard(user?.purchasedScorecards)
                              .length === 0)
                        }
                        style={{ marginBottom: "10px" }}
                      >
                        <Title level={4} style={{ marginBottom: "8px" }}>
                          {plan.name}
                        </Title>
                        <Text
                          style={{
                            display: "block",
                            marginBottom: "6px",
                          }}
                        >
                          {plan?.description}
                        </Text>
                        <Text strong className="text-primary">
                          {plan?.price &&
                            (plan.id === "DEFAULT"
                              ? plan?.price
                              : `$${plan?.price}`)}
                        </Text>
                      </Radio>
                    </Radio.Group>
                  </Card>
                </Badge.Ribbon>
              </Col>
            ))}
          </Row>
          {loadingAllLibrary && selectedPlan.id === "SINGLE_SCORECARD" ? (
            <div className="text-center my-5">
              <Spinner />
            </div>
          ) : (
            selectedPlan?.id === "SINGLE_SCORECARD" && (
              <div style={{ marginTop: "30px" }}>
                <Title level={5}>
                  Please select a single scorecard from the list below. If you’d
                  like to add another scorecard later, simply visit ‘Manage
                  Subscription’ to update your selection and add more single
                  scorecards.
                </Title>
                <Collapse accordion>
                  {decision.map((category) => (
                    <Panel
                      header={category.parentCategory}
                      key={category.parentCategory}
                    >
                      {category.categories.map((subCategory) => (
                        <div
                          key={subCategory.title}
                          style={{ marginBottom: "20px" }}
                        >
                          <Title level={5}>{subCategory.title}</Title>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr 1fr",
                              gap: "10px",
                              alignItems: "center", // Ensures checkbox and text are vertically aligned
                            }}
                          >
                            {subCategory.decisions.map((decision) => {
                              const selectedDecision = selectedDecisions.find(
                                (item) => item.scorecardId === decision._id
                              );

                              const status = selectedDecision?.currentStatus;

                              return (
                                <Tooltip
                                  title={status}
                                  color={
                                    selectedDecision?.currentStatus ===
                                    "cancelled"
                                      ? "red"
                                      : "#133c68"
                                  }
                                  key={decision._id}
                                >
                                  <Checkbox
                                    checked={!!selectedDecision}
                                    disabled={
                                      selectedDecision?.currentStatus ===
                                      "cancelled"
                                    }
                                    onChange={() =>
                                      handleDecisionChange(decision._id)
                                    }
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }} // Aligns the checkbox
                                  >
                                    {decision.title}
                                  </Checkbox>
                                </Tooltip>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </Panel>
                  ))}
                </Collapse>
              </div>
            )
          )}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            {selectedPlan?.id === "UNSUBSCRIBE" ? (
              <Button
                type="primary"
                shape="round"
                size="large"
                icon={<CheckCircleOutlined />}
                onClick={handleUnsubscribe}
                disabled={
                  (user?.subscription.toUpperCase() === "UNLIMITED" &&
                    user?.currentStatus === "cancelled") ||
                  loadingAllLibrary ||
                  (user?.subscription.toUpperCase() === "SINGLE_SCORECARD" &&
                    getActiveScoreCard(user?.purchasedScorecards).length ===
                      0) ||
                  user?.subscription?.toUpperCase() === "DEFAULT"
                }
              >
                Cancel
              </Button>
            ) : (
              <Button
                type="primary"
                shape="round"
                size="large"
                icon={<CheckCircleOutlined />}
                onClick={handlePayment}
                disabled={
                  loading ||
                  loadingFreeTrial ||
                  (selectedPlan?.id === "UNLIMITED" &&
                    user?.subscription?.toUpperCase() === "UNLIMITED" &&
                    user?.currentStatus === "active") ||
                  (selectedPlan?.id === "SINGLE_SCORECARD" &&
                    !handleNewSelectedDecisions(selectedDecisions).length >
                      0) ||
                  (selectedPlan?.id === "DEFAULT" &&
                    user?.subscription?.toUpperCase() === "DEFAULT")
                }
              >
                {loading || loadingFreeTrial ? <Spinner /> : "Subscribe"}
              </Button>
            )}
          </div>
        </div>
      </DashboardLayout>

      <Unsubscribe
        isVisible={unsubscribeModel.unlimited}
        onCancel={handleUnsubscribe}
      />
      <SingleUnsubscribe
        isVisible={unsubscribeModel.single_scorecard}
        onCancel={handleUnsubscribe}
        decision={decision}
        setSelectedDecisions={setSelectedDecisions}
        selectedDecisions={user?.purchasedScorecards}
      />
    </>
  );
};

export default ManageSubscription;
