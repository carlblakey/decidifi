import Tour from "reactour";
import React, { useState } from "react";
import { ROUTES } from "../../constants";
import { CiUnlock } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components";
import useContextHook from "../../hooks/useContextHook";
import { Input, Collapse, Button, Space, Alert } from "antd";
import { DECISION_CATEGORIES, TOURS } from "../../config/dummyData";
import NameScorecardModal from "../../components/InDepthScorecard/NameScorecardModal";

const { Search } = Input;
const { Panel } = Collapse;

const MakeADecision = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isTourOpen, setIsTourOpen] = useState(false); // Tour state
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { setSelectedDecision } = useContextHook();
  const navigate = useNavigate();

  const handleClick = (decision) => {
    setSelectedDecision(decision);
    navigate(`${ROUTES.SCORECARD}?isblank=false`);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreateBlankScorecard = () => {
    setIsModalVisible(true);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleClickProceed = () => {
    navigate(`${ROUTES.SCORECARD}?isblank=true`); // Update this route as needed
    handleCancel();
  };

  const filteredCategories = DECISION_CATEGORIES.map((mainCategory) => ({
    ...mainCategory,
    categories: mainCategory.categories.filter(
      (category) =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.decisions.some((decision) =>
          decision.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ),
  })).filter((mainCategory) => mainCategory.categories.length > 0);

  const defaultActiveKeys = filteredCategories.map((cat, index) =>
    index.toString()
  );

  return (
    <DashboardLayout>
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Decision Library</h2>

        {/* Indicator section */}
        <Alert
          message={
            <div className="flex flex-row items-center justify-between">
              <span className="mr-2">
                Can't find the scorecard you need? Use our Buildable Scorecard
                template to create your own.
              </span>
              <Button type="primary" onClick={handleCreateBlankScorecard}>
                Create Your Own Scorecard
              </Button>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />

        <Search
          placeholder="Search categories"
          enterButton
          onSearch={handleSearch}
          style={{ marginBottom: 20 }}
        />

        <NameScorecardModal
          isVisible={isModalVisible}
          onCancel={handleCancel}
          proceed={handleClickProceed}
        />

        <Collapse
          defaultActiveKey={defaultActiveKeys}
          style={{
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
          }}
        >
          {filteredCategories.map((mainCategory, index) => (
            <Panel header={mainCategory.title} key={index.toString()}>
              <Collapse style={{ maxHeight: "200px", overflowY: "auto" }}>
                {mainCategory.categories.map((category, catIndex) => (
                  <Panel
                    header={
                      <div className="flex flex-row items-center gap-2">
                        {category.image && (
                          <img
                            src={category.image}
                            alt="category image"
                            style={{ width: 20, height: 20 }}
                          />
                        )}
                        <span className="collapse-header">
                          {category.title}
                        </span>
                      </div>
                    }
                    key={catIndex.toString()}
                  >
                    <Space direction="vertical">
                      {category.decisions.map((decision, idx) => (
                        <Button
                          key={idx}
                          onClick={() => handleClick(decision)}
                          icon={
                            category.image ? (
                              <img
                                src={category.image}
                                alt="category image"
                                style={{ width: 20, height: 20 }}
                              />
                            ) : (
                              <CiUnlock color="green" />
                            )
                          }
                        >
                          {decision}
                        </Button>
                      ))}
                    </Space>
                  </Panel>
                ))}
              </Collapse>
            </Panel>
          ))}
        </Collapse>

        {/* Reactour component to guide users */}
        <Tour
          steps={TOURS.MAKE_A_DECISION_TOUR}
          isOpen={isTourOpen}
          onRequestClose={() => setIsTourOpen(false)}
          disableDotsNavigation
          disableKeyboardNavigation
        />
      </main>
    </DashboardLayout>
  );
};

export default MakeADecision;
