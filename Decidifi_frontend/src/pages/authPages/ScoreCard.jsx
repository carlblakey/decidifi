import React from "react";
import { Footer, Header } from "../../components";
import { Typography } from "antd";
import DynamicEditableTable from "../../components/ScoreCard/DynamicEditableTable";
import { INITIAL_DATA_DECISION } from "../../config/dummyData";
const { Title, Text } = Typography;
const ScoreCard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col px-8">
        <div className="max-w-7xl m-auto">
          <div>
            <div
              id="welcome-section"
              // className="flex mt-5 p-6 flex-col justify-center items-center"
            >
              <h2 className="text-2xl font-bold py-5 w-fit">
                Whether to Subscribe to Decidifi
              </h2>
              <Title level={5}>
                Deciding whether to subscribe to Decidifi depends on factors
                such as your decision-making needs, the complexity of your
                choices, and the value you place on having structured guidance.
                Here are the key decision criteria to help guide your selection:
              </Title>
              <DynamicEditableTable initialData={INITIAL_DATA_DECISION} />
              <Title level={5}>
                <Title level={5}>
                  By reflecting on these criteria, you can confidently determine
                  whether subscribing to Decidifi is the right choice for your
                  decision-making needs.
                </Title>
              </Title>
            </div>
            <div className="p-6"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScoreCard;
