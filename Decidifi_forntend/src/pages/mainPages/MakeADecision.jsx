import Tour from "reactour";
import React, { useState } from "react";
import { ICONS, ROUTES } from "../../constants";
import { Button, Alert, Modal, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import useContextHook from "../../hooks/useContextHook";
import { DECISION_CATEGORIES, TOURS } from "../../config/dummyData";
import NameScorecardModal from "../../components/InDepthScorecard/NameScorecardModal";
import { allDecisionLibrary } from "../../api/decisionLibrary";
import useApi from "../../hooks/useApi";
import { useEffect } from "react";
import {
  getToken,
  setObjectInLocalStorage,
} from "../../utilities/localStorageMethods";
import { setAuthToken } from "../../api/client";

export const convertData = (originalData) => {
  return originalData.reduce((acc, category) => {
    const parentCategory = category.parentCategory;
    const existingCategory = acc.find(
      (item) => item.parentCategory === parentCategory
    );

    // If parentCategory already exists, add this category to its categories list
    if (existingCategory) {
      existingCategory.categories.push({
        title: category.title,
        description: category?.description,
        // image: new URL(`/${category?.image}`, import.meta.url).href,
        image: category?.image,
        decisions: category.decisions,
        _id: category._id,
      });
    } else {
      // If parentCategory doesn't exist, create a new entry for it
      const image =
        parentCategory === "Personal Decisions"
          ? ICONS.PERSONAL
          : parentCategory === "Professional Decisions"
          ? ICONS.PROFESSIONAL
          : parentCategory === "Life Decisions"
          ? ICONS.LIFE
          : "";
      acc.push({
        parentCategory: parentCategory,
        image: image,
        description: category.description,
        categories: [
          {
            title: category.title,
            description: category?.description,
            image: category?.image,
            decisions: category.decisions,
            _id: category._id,
          },
        ],
      });
    }

    return acc;
  }, []);
};

const MakeADecision = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBlankScoreCardModal, setIsBlankScoreCardModal] = useState(false);
  const [selectedDecisionsLocal, setSelectedDecisionsLocal] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    image: "",
    title: "",
  });

  const navigate = useNavigate();
  const { setSelectedDecision } = useContextHook();

  const [decision, setDecision] = useState([]);

  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(allDecisionLibrary);

  useEffect(() => {
    if (isSuccess) {
      const convertedData = convertData(data.data);
      setDecision(convertedData);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    setAuthToken(getToken());
    request();
  }, []);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCategoryClick = (decisions, selectedCategory) => {
    setIsModalVisible(true);
    setSelectedDecisionsLocal(decisions);
    setSelectedCategory(selectedCategory);
  };

  const handleDecisionClick = (decision) => {
    // Navigate to the decision page
    const d = { id: decision._id, title: decision.title };
    setObjectInLocalStorage("decision", d);
    setSelectedDecision(decision);
    navigate(`${ROUTES.SCORECARD}?isblank=false`); // Update this route as needed
    setIsModalVisible(false);
  };

  const handleCreateBlankScorecard = () => {
    setIsBlankScoreCardModal(true);
  };

  const handleCancelBlank = () => {
    setIsBlankScoreCardModal(false);
  };

  const handleClickProceed = () => {
    navigate(`${ROUTES.SCORECARD}?isblank=true`); // Update this route as needed
    handleCancelBlank();
  };

  return (
    <DashboardLayout>
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">Decision Library</h2>

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

          <NameScorecardModal
            isVisible={isModalVisible}
            onCancel={handleCancel}
          />

          <div className="px-10">
            {decision.map((v, k) => (
              <div className="border-gray-400 border-b-2" key={k}>
                <div className="flex flex-row items-center gap-7 pb-6 mt-10">
                  <img
                    src={v.image}
                    className="w-20 h-20"
                    alt={v.parentCategory}
                  />
                  <div>
                    <h2 className="text-primary pl-3 border-gray-600 border-l-8 font-bold text-xl">
                      {v.parentCategory}
                    </h2>
                    <p className="mt-2 text-sm">{v.description}</p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3 flex-wrap justify-between">
                  {v.categories.map((x, y) => (
                    <div
                      className="bg-white card-container border-2 border-primary px-3 box-border py-5 w-[24%] flex flex-col items-center gap-3 mb-5 cursor-pointer"
                      key={y}
                      onClick={() =>
                        handleCategoryClick(x.decisions, {
                          image: x.image,
                          title: x.title,
                        })
                      } // Pass decisions array
                    >
                      <img src={x.image} alt={x.title} className="w-20 h-20" />
                      <span>{x.title}</span>
                      <span className="text-sm">{x.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Modal
            title=""
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <div className="flex flex-col items-center gap-3 justify-center my-4">
              <img
                src={selectedCategory.image}
                className="h-28 w-28"
                alt="image"
              />
              <h2 className="text-primary text-3xl font-bold">
                {selectedCategory.title}
              </h2>
            </div>
            <ul className="list-none p-0 max-h-[40vh] overflow-scroll">
              {selectedDecisionsLocal.map((decision, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-2  ${
                    decision.hasAccess
                      ? "text-primary cursor-pointer hover:underline"
                      : "text-gray-500 cursor-not-allowed"
                  } `}
                  onClick={
                    decision.hasAccess
                      ? () => handleDecisionClick(decision)
                      : undefined
                  }
                >
                  {decision.hasAccess ? (
                    <CheckCircleFilled className="text-primary" />
                  ) : (
                    <CloseCircleFilled />
                  )}
                  {/* Tick icon */}
                  <span>{decision.title}</span>
                </li>
              ))}
            </ul>
          </Modal>

          {/*name fo blank Scorecard Modal */}
          <NameScorecardModal
            isVisible={isBlankScoreCardModal}
            onCancel={handleCancelBlank}
            proceed={handleClickProceed}
          />

          <Tour
            steps={TOURS.MAKE_A_DECISION_TOUR}
            isOpen={isTourOpen}
            onRequestClose={() => setIsTourOpen(false)}
            disableDotsNavigation
            disableKeyboardNavigation
          />
        </main>
      )}
    </DashboardLayout>
  );
};

export default MakeADecision;
