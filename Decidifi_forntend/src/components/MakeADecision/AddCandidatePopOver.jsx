import { Button, Input, Popover } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const AddCandidatePopOver = ({
  addColumn,
  newOptionName,
  popoverVisible,
  setNewOptionName,
  setPopoverVisible,
  isWeightingCompleted,
}) => {
  return (
    <Popover
      content={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Input
            placeholder="Add Option Name Here"
            value={newOptionName}
            onChange={(e) => setNewOptionName(e.target.value)}
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button
            style={{ marginRight: 8 }}
            type="primary"
            onClick={() => addColumn("add")}
          >
            Confirm
          </Button>
        </div>
      }
      title="New Option"
      trigger="click"
      open={popoverVisible}
      onOpenChange={setPopoverVisible}
    >
      <Button
        type="primary"
        icon={<PlusOutlined />}
        disabled={isWeightingCompleted}
      >
        Add Option
      </Button>
    </Popover>
  );
};

export default AddCandidatePopOver;
