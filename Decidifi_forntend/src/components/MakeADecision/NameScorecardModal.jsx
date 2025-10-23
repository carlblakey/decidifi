import { Button, Input, Modal, Form } from "antd";
import React from "react";
const { TextArea } = Input;

const NameScorecardModal = ({
  isVisible,
  onCancel,
  handleChange,
  decisionInfo,
  onProceed,
  loading,
  isBlank = false,
}) => {
  return (
    <Modal
      title="Name Your Scorecard"
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
            disabled={!decisionInfo?.title?.trim() || loading}
            loading={loading}
          >
            Proceed
          </Button>
        </div>,
      ]}
    >
      <label>Title</label>
      <Input
        name="title"
        placeholder="Enter Title"
        value={decisionInfo.title}
        onChange={handleChange}
      />
      <br />
      <br />
      {isBlank === "false" && (
        <>
          <label>Scorecard</label>
          <Input
            name="scorecard"
            placeholder="Enter Title"
            value={decisionInfo?.decision?.title || ""}
            readOnly
            onChange={handleChange}
          />
          <br />
          <br />
        </>
      )}

      <label>Description</label>
      <TextArea
        rows={4}
        value={decisionInfo.description}
        placeholder="Add optional notes about this scorecard"
        onChange={handleChange}
        name="description"
      />
    </Modal>
  );
};

export default NameScorecardModal;
