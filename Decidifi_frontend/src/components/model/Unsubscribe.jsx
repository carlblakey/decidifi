import { Button, Input, Modal, Typography } from "antd";
import React, { useEffect } from "react";
import { cancelSubscription } from "../../api/payment";
import useApi from "../../hooks/useApi";
import { setAuthToken } from "../../api/client";
import {
  getToken,
  setObjectInLocalStorage,
} from "../../utilities/localStorageMethods";
import toast from "react-hot-toast";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";
import { USER_KEY } from "../../utilities/localStorageKeys";
const { Title, Text } = Typography;
const Unsubscribe = ({ isVisible, onCancel }) => {
  const user = getDefaultValUser();
  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(cancelSubscription);

  const onProceed = () => {
    request({ email: user.email });
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
      setObjectInLocalStorage(USER_KEY, {
        ...user,
        currentStatus: "cancelled",
      });
      toast.dismiss();
      toast.success("Subscription canceled successfully");
      onCancel();
    }
  }, [error, errorMessage, isSuccess, data]);

  useEffect(() => {
    setAuthToken(getToken());
    clearError();
  }, []);

  return (
    <Modal
      // title="Name Your Scorecard"
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <div className="flex justify-end gap-3">
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            key="proceed"
            type="primary"
            onClick={onProceed}
            disabled={loading}
            loading={loading}
          >
            Proceed
          </Button>
        </div>,
      ]}
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
    </Modal>
  );
};

export default Unsubscribe;
