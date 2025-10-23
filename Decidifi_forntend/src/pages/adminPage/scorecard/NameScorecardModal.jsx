import { Button, Input, Modal } from "antd";
import React from "react";
const { TextArea } = Input;

const NameScorecardModal = ({
  isVisible,
  onCancel,
  setTitle,
  title,
  onProceed,
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
            disabled={!title?.trim()}
          >
            Proceed
          </Button>
        </div>,
      ]}
    >
      <Input
        name="title"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </Modal>
  );
};

export default NameScorecardModal;
