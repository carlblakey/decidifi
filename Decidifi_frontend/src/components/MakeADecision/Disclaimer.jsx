import { Alert } from "antd";

const Disclaimer = () => {
  return (
    <Alert
      message="Disclaimer"
      description="Decidifi tools are designed to help you make informed decisions by providing a structured, quantitative approach. However, decisions often involve many variables that go beyond what a scorecard can capture. We encourage you to use your personal discretion, experience, and judgment to consider all factors before making the choice that’s right for you."
      type="warning"
      closable
      showIcon
      className="mb-4"
    />
  );
};

export default Disclaimer;