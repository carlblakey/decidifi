import { Button, Checkbox, Collapse, Input, Modal, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { cancelSingleSubscription } from "../../api/payment";
import useApi from "../../hooks/useApi";
import { setAuthToken } from "../../api/client";
import {
  getToken,
  setObjectInLocalStorage,
} from "../../utilities/localStorageMethods";
import toast from "react-hot-toast";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";
import { USER_KEY } from "../../utilities/localStorageKeys";
const { Title } = Typography;
const { Panel } = Collapse;

const SingleUnsubscribe = ({
  isVisible,
  onCancel,
  decision,
  setSelectedDecisions,
  selectedDecisions,
}) => {
  const user = getDefaultValUser();
  const [removeDecisions, setRemoveDecisions] = useState([]);

  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(cancelSingleSubscription);

  const handleDecisionChange = (decisionId) => {
    setRemoveDecisions((prev) =>
      prev.includes(decisionId)
        ? prev.filter((id) => id !== decisionId)
        : [...prev, decisionId]
    );
  };

  const onProceed = () => {
    request({ email: user.email, subscriptions: removeDecisions });
  };

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(
        "We couldn't cancel your subscription at this time. Please try again later"
      );
      clearError();
    }

    if (isSuccess) {
      toast.dismiss();
      setRemoveDecisions([]);
      setSelectedDecisions(data.data.remainingScorecards);
      setObjectInLocalStorage(USER_KEY, {
        ...user,
        purchasedScorecards: data.data.remainingScorecards,
        // expired: data.data.subscriptionStatus,
      });
      toast.success("Subscription canceled successfully");
      onCancel();
    }
  }, [error, errorMessage, isSuccess, data]);

  useEffect(() => {
    setAuthToken(getToken());
    clearError();
  }, []);

  const getActiveScoreCard = (data = []) => {
    const scores = data
      .filter((curElem) => curElem?.currentStatus === "active")
      .map((item) => item.scorecardId);

    return scores;
  };

  // check all scorecard
  const handleCheckAll = () => {
    const scores = getActiveScoreCard(user.purchasedScorecards);

    setRemoveDecisions(scores);
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <div className="flex justify-end gap-3">
          <Button
            key="check"
            onClick={handleCheckAll}
            disabled={
              getActiveScoreCard(user.purchasedScorecards).length ===
              removeDecisions.length
            }
          >
            Check All
          </Button>
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            key="proceed"
            type="primary"
            onClick={onProceed}
            disabled={loading || removeDecisions.length === 0}
            loading={loading}
          >
            Proceed
          </Button>
        </div>,
      ]}
      style={{ top: 20 }}
      styles={{
        body: {
          maxHeight: "640px", // Set a max height for the modal content
          overflowY: "auto", // Enable vertical scrolling
        },
      }}
    >
      <Title level={4}>Are you sure you want to unsubscribe?</Title>
      <p>
        We’re sorry to see you go! Before you unsubscribe, please note that by
        doing so, you will no longer receive updates, offers, and important
        notifications from us.
      </p>
      <p>
        If you're sure you want to unsubscribe, click the button below. If you
        have any questions or need assistance, feel free to reach out to us!
      </p>
      <br />
      <Title level={5}>
        Please select from the list below which single scorecard you would like
        to unsubscribe:
      </Title>

      <Collapse accordion>
        {decision
          .filter((category) =>
            category.categories.some((subCategory) =>
              subCategory.decisions.some((decision) =>
                getActiveScoreCard(user.purchasedScorecards).includes(
                  decision._id
                )
              )
            )
          )
          .map((category) => (
            <Panel
              header={category.parentCategory}
              key={category.parentCategory}
            >
              {category.categories.map((subCategory, i) => {
                // Filter decisions based on purchasedScorecards
                const filteredDecisions = subCategory.decisions.filter(
                  (decision) =>
                    getActiveScoreCard(user.purchasedScorecards).includes(
                      decision._id
                    )
                );

                // Only render subCategory if it has filtered decisions
                if (filteredDecisions.length > 0) {
                  return (
                    <div
                      key={subCategory.title}
                      style={{ marginBottom: "20px" }}
                    >
                      <Title level={5}>{subCategory.title}</Title>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr",
                          gap: "10px",
                          alignItems: "center", // Ensures checkbox and text are vertically aligned
                        }}
                      >
                        {filteredDecisions.map((decision) => (
                          <Checkbox
                            key={decision._id}
                            checked={removeDecisions.includes(decision._id)}
                            onChange={() => handleDecisionChange(decision._id)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }} // Aligns the checkbox
                          >
                            {decision.title}
                          </Checkbox>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null; // Do not render if no decisions are available
              })}
            </Panel>
          ))}
      </Collapse>
    </Modal>
  );
};

export default SingleUnsubscribe;
