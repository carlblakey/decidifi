import React, { useState, useEffect } from "react";
import {
  Radio,
  Card,
  Button,
  Typography,
  Row,
  Col,
  Badge,
  Checkbox,
  Collapse,
} from "antd";
import { Footer, Header, Spinner } from "../../components";
import { CheckCircleOutlined } from "@ant-design/icons";
import useApi from "../../hooks/useApi";
import { activateFreeTrial, payment } from "../../api/payment";
import toast from "react-hot-toast";
import {
  getSingleItem,
  removeItem,
  setObjectInLocalStorage,
  setToken,
} from "../../utilities/localStorageMethods";
import {
  EMAIL_KEY,
  SUBSCRIPTION_PLAN,
  USER_KEY,
} from "../../utilities/localStorageKeys";
import { DECISION_CATEGORIES } from "../../config/dummyData";
import { ROUTES } from "../../constants";
import { useNavigate } from "react-router-dom";
import { allLibrary } from "../../api/decisionLibrary";
import { convertData } from "./../mainPages/MakeADecision copy";
import useContextHook from "../../hooks/useContextHook";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";

const { Title, Text } = Typography;
const { Panel } = Collapse;

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
];

const ManageSubscription = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContextHook();
  const user = getDefaultValUser();
  const email = getSingleItem(EMAIL_KEY);
  const [selectedPlan, setSelectedPlan] = useState({
    id: "DEFAULT",
    name: "Free Trial Access",
    price: "Free",
  });
  const [decision, setDecision] = useState([]);
  const [selectedDecisions, setSelectedDecisions] = useState([]);
  const [isDefaultDisabled, setIsDefaultDisabled] = useState(false);

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

  const subscriptionStartTime = new Date().getTime(); // Simulated
  const expiryTimeInMs = 48 * 60 * 60 * 1000; // 48 hours

  useEffect(() => {
    const checkExpiry = () => {
      const currentTime = new Date().getTime();
      if (currentTime - subscriptionStartTime > expiryTimeInMs) {
        setIsDefaultDisabled(true);
        if (selectedPlan === "default") setSelectedPlan("");
      }
    };

    const intervalId = setInterval(checkExpiry, 1000);
    return () => clearInterval(intervalId);
  }, [selectedPlan, subscriptionStartTime]);

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

    if (plan.id === "SINGLE_SCORECARD") {
      requestAllLibrary();
    }
  };

  const handleDecisionChange = (decisionId) => {
    setSelectedDecisions((prev) =>
      prev.includes(decisionId)
        ? prev.filter((id) => id !== decisionId)
        : [...prev, decisionId]
    );
  };
  // PROD
  const handlePayment = () => {
    const price =
      selectedPlan.id === "UNLIMITED"
        ? selectedPlan.price
        : selectedPlan.price * selectedDecisions.length;
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
      email,
      scorecards: selectedDecisions,
    };

    if (selectedPlan.id === "DEFAULT") {
      requestFreeTrial({ email });
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
      if ((data.status = 200)) {
        const price =
          selectedPlan.id === "UNLIMITED"
            ? selectedPlan.price
            : selectedPlan.price * selectedDecisions.length;

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
      removeItem(EMAIL_KEY);
      navigate(ROUTES.INDEX);
      setToken(user.token);
      setIsAuthenticated(true);
      navigate(ROUTES.INDEX);
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
    }
  }, [
    errorAllLibrary,
    errorMessageAllLibrary,
    isSuccessAllLibrary,
    allLibraryData,
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col px-8">
        <div className="max-w-7xl m-auto">
          <div>
            <div
              id="welcome-section"
              className="flex mt-5 p-6 flex-col justify-center items-center"
            >
              <h1 className="text-4xl font-bold py-5 w-fit">
                Manage Subscription
              </h1>
              <Text
                type="secondary"
                style={{ textAlign: "left", display: "block" }}
                className="mb-4"
              >
                Select a subscription plan that suits your needs:
              </Text>
            </div>
            <div className="p-6">
              {/* <h2 className="text-2xl font-bold mb-4"></h2> */}

              <Row gutter={[16, 16]} justify="center">
                {subscriptionPlans.map((plan) => (
                  <Col key={plan.id} xs={24} sm={12} md={8}>
                    <Badge.Ribbon
                      text={plan.badge}
                      color="red"
                      style={{
                        visibility: plan.badge ? "visible" : "hidden",
                      }}
                    >
                      <Card
                        style={{
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
                        <Radio.Group value={selectedPlan.id}>
                          <Radio
                            value={plan.id}
                            onChange={() => handlePlanChange(plan)}
                            disabled={
                              plan.id === "default" && isDefaultDisabled
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
                              {plan.description}
                            </Text>
                            <Text strong className="text-primary">
                              {plan.id === "DEFAULT"
                                ? plan.price
                                : `$${plan.price}`}
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
                      Please select a single scorecard from the list below. If
                      you’d like to add another scorecard later, simply visit
                      ‘Manage Subscription’ to update your selection and add
                      more single scorecards.
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
                                {subCategory.decisions.map((decision) => (
                                  <Checkbox
                                    key={decision._id}
                                    checked={selectedDecisions.includes(
                                      decision._id
                                    )}
                                    onChange={() =>
                                      handleDecisionChange(decision._id)
                                    }
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }} // Aligns the checkbox
                                    disabled={
                                      selectedDecisions.length > 0 &&
                                      !selectedDecisions.includes(decision._id)
                                    }
                                  >
                                    {decision.title}
                                  </Checkbox>
                                ))}
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
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  icon={<CheckCircleOutlined />}
                  onClick={handlePayment}
                  disabled={loading || loadingFreeTrial}
                >
                  {loading || loadingFreeTrial ? <Spinner /> : "Subscribe"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManageSubscription;
