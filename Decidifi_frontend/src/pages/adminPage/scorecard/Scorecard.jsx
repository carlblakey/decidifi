import React, { useEffect, useState } from "react";
import { AdminDashboardLayout } from "../../../components";
import InDepthScorecard from "../../../components/admin/InDepthScorecard";
import QuickViewScorecard from "../../../components/admin/QuickViewScorecard";
import { Button, Select, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import IndepthFromModal from "../../../components/admin/IndepthFromModal";
import QuickViewFromModal from "../../../components/admin/QuickViewFromModal";
import NameScorecardModal from "./NameScorecardModal";
import {
  createScoreCard,
  getCompleteScoreById,
  getScoreById,
  updateScoreCard,
} from "../../../api/scorecard";
import { setAuthToken } from "../../../api/client";
import { getToken } from "../../../utilities/localStorageMethods";
import { useSearchParams } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import toast from "react-hot-toast";

const Scorecard = () => {
  const [searchParams] = useSearchParams();
  const scorecardId = searchParams.get("scorecardId");
  const [scoreCard, setScoreCard] = useState("quickView");
  const [title, setTitle] = useState("");
  const [addscoreCardModel, setAddscoreCardModel] = useState({});
  const [quickViewData, setQuickViewData] = useState([]);
  const [inDepthData, setInDepthData] = useState([]);
  const [isScordcardMdel, setIsScordcardMdel] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // get single scorecard
  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(getCompleteScoreById);

  const options = [
    {
      value: "quickView",
      label: "Quick-View",
    },
    {
      value: "inDepth",
      label: "In-Depth",
    },
  ];

  const handleChangeScoreCard = (value) => {
    setScoreCard(value);
  };

  const addQuickViewRow = ({ category, criteria }) => {
    let maxKeyObject =
      quickViewData.length > 0
        ? quickViewData.reduce((max, current) =>
            current.key > max.key ? current : max
          )
        : { key: 0 }; // Default object to avoid errors

    let currentKeys = maxKeyObject.key + 1; // Always safe to increment

    const newRow = {
      key: currentKeys,
      category: category,
      criteria: criteria,
      weighting: 0,
    };

    setQuickViewData((prevDataSource) => [newRow, ...prevDataSource]);
    handleClose();
  };

  const addInDepthRow = (rows) => {
    // Ensure maxKeyObject is always an object with a valid key
    let maxKeyObject =
      inDepthData.length > 0
        ? inDepthData.reduce((max, current) =>
            current.key > max.key ? current : max
          )
        : { key: 0 };

    // Dynamically gather all column keys from the current dataSource
    const columnKeys = inDepthData.reduce((keys, row) => {
      Object.keys(row).forEach((key) => {
        if (key.startsWith("column-") && !keys.includes(key)) {
          keys.push(key);
        }
      });
      return keys;
    }, []);

    const newRows = rows.map((v, k) => {
      let currentKeys = maxKeyObject.key + k + 1; // Always safe to increment
      return {
        key: currentKeys,
        ...v,
        weighting: 0,
        rowSpan: k === 0 ? rows.length : 0,
        // Include all column keys with default value 0
        ...columnKeys.reduce((acc, colKey) => {
          acc[colKey] = 0;
          return acc;
        }, {}),
      };
    });

    setInDepthData((prevDataSource) => [...newRows, ...prevDataSource]);
    handleClose();
  };

  const handleClose = () => {
    setAddscoreCardModel({ [scoreCard]: false });
  };
  const handleCancel = () => {
    setIsScordcardMdel(false);
  };

  const handleClickOnSave = async () => {
    if (!title.trim()) {
      setIsScordcardMdel(true);
      return;
    }

    try {
      const body = {
        title,
        quickViewScorecard: quickViewData,
        inDepthScorecard: inDepthData,
      };

      setSaveLoading(true);
      let response;
      scorecardId
        ? (response = await updateScoreCard({ id: scorecardId, data: body }))
        : (response = await createScoreCard(body));

      if (response.status === 201 || response.status === 200) {
        setTitle("");
        toast.success(response.data.message);
        return;
      }
    } catch (error) {
      toast.error("We are facing some issue in facing decision");
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    setAuthToken(getToken());
    if (scorecardId) {
      request({ id: scorecardId });
    }
  }, []);

  useEffect(() => {
    // Show error toast only once
    if (error) {
      toast.error(errorMessage.message);
      clearError();
    }

    if (isSuccess && data && Object.keys(data?.data?.scorecard).length > 0) {
      setInDepthData(data?.data?.scorecard?.inDepthScorecard || []);
      setQuickViewData(data?.data?.scorecard?.quickViewScorecard || []);
      setTitle(data?.data?.scorecard.title || "");
    }
  }, [error, errorMessage, isSuccess, data]);

  return (
    <AdminDashboardLayout>
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <main className="flex-1 p-6">
          <div className="flex flex-row items-center justify-between my-4">
            <div className="text-lg text-black font-bold">
              {scoreCard === "quickView"
                ? "Quick-View Scorecard"
                : "In-Depth Scorecard"}
            </div>

            <div className="flex flex-row items-center justify-between">
              <div>
                <Select
                  style={{
                    width: "100%",
                  }}
                  placeholder="Select ScoreCard"
                  optionFilterProp="label"
                  value={scoreCard}
                  options={options}
                  onChange={handleChangeScoreCard}
                />
              </div>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginLeft: 8 }}
                onClick={() =>
                  setAddscoreCardModel((prev) => ({ [scoreCard]: true }))
                }
              >
                Add
              </Button>

              <Button
                onClick={handleClickOnSave}
                type="primary"
                style={{ marginLeft: 8 }}
                disabled={saveLoading}
                loading={saveLoading}
              >
                Save Changes
              </Button>
            </div>
          </div>
          {scoreCard === "quickView" ? (
            <>
              <QuickViewFromModal
                addRow={addQuickViewRow}
                open={addscoreCardModel?.quickView}
                handleCancel={handleClose}
              />
              <QuickViewScorecard
                initialData={quickViewData}
                setQuickViewData={setQuickViewData}
              />
            </>
          ) : (
            <>
              <IndepthFromModal
                addRow={addInDepthRow}
                open={addscoreCardModel?.inDepth}
                handleCancel={handleClose}
              />
              <InDepthScorecard
                initialData={inDepthData}
                setInDepthData={setInDepthData}
              />
            </>
          )}
        </main>
      )}

      <NameScorecardModal
        isVisible={isScordcardMdel}
        onCancel={handleCancel}
        setTitle={setTitle}
        title={title}
        onProceed={handleCancel}
      />
    </AdminDashboardLayout>
  );
};

export default Scorecard;
