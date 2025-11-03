import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import useContextHook from "../../hooks/useContextHook";
import { createBlankScoreCard } from "../../api/scorecard";
import useApi from "../../hooks/useApi";
import { useEffect } from "react";
import { Spiner2 } from "../shared/Spiner";
import toast from "react-hot-toast";
import { setAuthToken } from "../../api/client";
import {
  getToken,
  setObjectInLocalStorage,
} from "../../utilities/localStorageMethods";
import { BLANK_SCORECARDS_TITLE } from "../../utilities/localStorageKeys";
const { TextArea } = Input;

const NameScorecardModal = ({
  isVisible,
  onCancel,
  proceed,
  singleData = null,
}) => {
  const [formData, setFormData] = useState({ title: "", description: "" });

  const { setScorecardName } = useContextHook();

  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(createBlankScoreCard);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on input change
    if (error) {
      clearError();
    }
  };

  const onProceed = () => {
    setScorecardName(formData);
    {
      singleData ? "" : request(formData);
    }
  };

  useEffect(() => {
    setAuthToken(getToken());
  }, []);

  useEffect(() => {
    // Show error toast only once
    if (error) {
      toast.error(errorMessage.message);
    }

    if (isSuccess) {
      toast.success("Blank scorecard template created successfully");
      setObjectInLocalStorage(BLANK_SCORECARDS_TITLE, formData);
      setFormData({ title: "", description: "" });

      {
        !singleData && proceed();
      }
    }
  }, [error, errorMessage, isSuccess, data]);

  useEffect(() => {
    if (singleData) {
      setFormData((prev) => ({ ...prev, title: singleData.title }));
      // setName(singleData.title);
    }
  }, [singleData]);

  return (
    <Modal
      title={singleData ? "Update Your Scorecard Name" : "Name Your Scorecard"}
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="proceed"
          type="primary"
          onClick={onProceed}
          disabled={!formData.title.trim() || loading} // Disable if no name is provided
          loading={loading}
        >
          Proceed
        </Button>,
      ]}
    >
      <Input
        placeholder="Enter scorecard name"
        value={formData.title}
        onChange={handleChange}
        name="title"
      />
      <br />
      <br />
      <TextArea
        rows={4}
        value={formData.description}
        placeholder="Add optional notes about this scorecard"
        onChange={handleChange}
        name="description"
      />
    </Modal>
  );
};

export default NameScorecardModal;
