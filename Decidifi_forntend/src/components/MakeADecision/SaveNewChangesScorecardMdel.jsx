import { Button, Input, Modal, Typography } from "antd";
import React from "react";
const { TextArea } = Input;
const { Title, Text } = Typography;
const SaveNewChangesScorecardMdel = ({
  isVisible,
  onCancel,
  onProceed,
  loading,
  isWeightingCompleted,
}) => {
  return (
    <Modal
      //   title="Name Your Scorecard"
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
            loading={loading}
            disabled={isWeightingCompleted || loading}
          >
            Proceed
          </Button>
        </div>,
      ]}
    >
      <Text>Would you like to save the new changes?</Text>
    </Modal>
  );
};

export default SaveNewChangesScorecardMdel;
