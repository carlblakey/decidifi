import ResultsModal from "./ResultsModal";
import React, { useEffect, useRef, useState } from "react";
import AddCriteriaPopOver from "./AddCriteriaPopOver";
import AddCandidatePopOver from "./AddCandidatePopOver";
import useContextHook from "../../hooks/useContextHook";
import { EditFilled, DeleteOutlined } from "@ant-design/icons";
import { savePreviousDecision } from "../../api/previousDecisions";
import { Table, Input, Button, Select, notification, message } from "antd";
import NameScorecardModal from "./NameScorecardModal";
import {
  BLANK_SCORECARDS_TITLE,
  CHANGE_IN_SCORECARDS,
} from "../../utilities/localStorageKeys";
import {
  getItem,
  removeItem,
  setObjectInLocalStorage,
} from "../../utilities/localStorageMethods";
import SaveNewChangesScorecardMdel from "./SaveNewChangesScorecardMdel";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

const { Option } = Select;
const { Summary } = Table;

const FORM_DATA = {
  title: "",
  description: "",
  decision: { id: "", title: "" },
};

const DynamicEditableTable = ({
  initialData,
  scoredCardTitle,
  id,
  scorecardColumns,
  scorecardDataSource,
  isBlank,
  isScordcardMdel,
  handleCancel,
  handleOpenDecisionModel,
  decisionName,
}) => {
  const initialColumns = [
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      minWidth: 90,
      render: (_, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => deleteRow(record.key)}
          danger
        />
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      minWidth: 90,
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Criteria",
      dataIndex: "criteria",
      key: "criteria",
      minWidth: 90,
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Weighting %",
      dataIndex: "weighting",
      key: "weighting",
      minWidth: 120,
      render: (text, record) => (
        <Input
          value={text}
          type="number"
          className="text-center"
          min={0}
          max={100}
          onChange={(e) =>
            handleCellChange(e.target.value, record.key, "weighting")
          }
        />
      ),
    },
  ];

  const prevScorecardsNewChanges = getItem(CHANGE_IN_SCORECARDS) || [];
  const [searchParams] = useSearchParams();
  const scorecardId = searchParams.get("scorecardId");
  const [isSaveNewScorecardMdel, setisSaveNewScorecardMdel] = useState(false);
  const [decisionInfo, setDecisionInfo] = useState(FORM_DATA);
  const [editingColumnKey, setEditingColumnKey] = useState(null);
  const [newColKey, setnewColumnKey] = useState("");
  const [columnIndex, setColumnIndex] = useState(0);

  const { decisionMakers, scorecardName } = useContextHook();

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [resultsData, setResultsData] = useState([]);
  const [optionNames, setOptionNames] = useState({});
  const [newCriteria, setNewCriteria] = useState("");
  const [newOptionName, setNewOptionName] = useState("");
  const [columns, setColumns] = useState([...initialColumns]);
  const [dataSource, setDataSource] = useState(initialData);
  const [newdataSource, setNewDataSource] = useState(prevScorecardsNewChanges);

  const [popoverVisible, setPopoverVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addCriteriaPopoverVisible, setAddCriteriaPopoverVisible] =
    useState(false);

  const handleEditClick = (name, key, newColumnKey) => {
    setnewColumnKey(newColumnKey);
    setNewOptionName(name);
    setEditingColumnKey(key); // Track the column that is being edited
    setPopoverVisible(true);
  };

  useEffect(() => {
    if (scorecardColumns && scorecardDataSource) {
      const updatedColumns = processColumns(scorecardColumns);
      setColumns(updatedColumns); // Ensure render logic is preserved
      setDataSource(scorecardDataSource);
    } else {
      addColumn();
    }
  }, [scorecardColumns, scorecardDataSource]);

  const processColumns = (rawColumns, parentTitle = null) => {
    return rawColumns.map((v) => {
      // Process child columns recursively, passing the current column's title as the parent title
      if (v?.children && Array.isArray(v.children)) {
        return {
          ...v,
          title: (
            <div className="flex items-center justify-between">
              {typeof v?.title === "string"
                ? v.title
                : typeof v?.title?.props?.children === "string"
                ? v?.title?.props?.children
                : v?.title?.props?.children[0] || "N/A"}
            </div>
          ),
          children: processColumns(
            v.children,
            v?.title?.props?.children || v.title
          ), // Pass parent title
        };
      }

      // Handle the "Score" column logic
      if (v?.title === "Score") {
        setOptionNames((prev) => ({
          ...prev,
          [v.key]:
            typeof parentTitle === "string"
              ? parentTitle
              : typeof parentTitle === "string"
              ? parentTitle
              : parentTitle[0] || "N/A",
        }));
        return {
          ...v,
          render: (text, record) => (
            <Select
              value={text !== undefined ? text : null}
              onChange={(value) =>
                handleCellChange(value, record.key, v.newColumnKey || v.key)
              }
              className="text-center"
              style={{ width: "100%" }}
              listHeight={400}
              virtual={false} // Disable virtualization to show all items without scrolling
            >
              {[...Array(11).keys()].map((num) => (
                <Option key={num} value={num}>
                  {num}
                </Option>
              ))}
            </Select>
          ),
          // Include parent title for reference
          parentTitle: parentTitle || "No Parent", // Optional, use "No Parent" if no parent title is present
        };
      }

      // Handle "Weighting %" column logic
      if (v?.title === "Weighting %") {
        return {
          ...v,
          render: (text, record) => (
            <Input
              value={text}
              type="number"
              className="text-center"
              min={0}
              max={100}
              onChange={(e) =>
                handleCellChange(e.target.value, record.key, "weighting")
              }
            />
          ),
        };
      }

      // Handle "Total" column logic
      if (v?.title === "Total") {
        return {
          ...v,
          render: (text, record) => {
            const weight = parseFloat(record.weighting) / 100;
            const value = record[v.key.split("total-")[1]] || 0;

            const total = weight * value;
            return <b className="text-center block">{total.toFixed(2)}</b>;
          },
        };
      }

      // Handle "Actions" column logic
      if (v?.title === "Actions") {
        return initialColumns[0]; // Use initial column definition for "Actions"
      }

      // Return column as is if no modifications are required
      return {
        ...v,
        render: (text) => <b>{text}</b>,
      };
    });
  };

  const updateColumnTitle = (key, value, newColKey) => {
    setOptionNames((prev) => ({
      ...prev,
      [newColKey]: value,
    }));

    // Update the column title
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.key === key
          ? {
              ...col,
              title: (
                <div className="flex items-center justify-between">
                  {value}
                  <EditFilled
                    onClick={() => handleEditClick(value, key, newColKey)} // Update the edit handler
                    style={{ cursor: "pointer", marginLeft: "8px" }}
                  />
                </div>
              ),
            }
          : col
      )
    );

    // setnewColumnKey("");
    setNewOptionName("");
    setPopoverVisible(false);
    setEditingColumnKey(null); // Reset the editing column key
  };

  const addColumn = () => {
    if (editingColumnKey) {
      updateColumnTitle(editingColumnKey, newOptionName, newColKey);
      return;
    }
    const newColumnKey = `column-${columnIndex}`;
    // const newColumnTitle = newOptionName || "Score";
    const newColumnTitle = newOptionName || "Option 1";

    const newColumn = {
      title: "Score",
      dataIndex: newColumnKey,
      key: newColumnKey,
      minWidth: 140,
      render: (text, record) => (
        <Select
          value={text !== undefined ? text : null}
          onChange={(value) =>
            handleCellChange(value, record.key, newColumnKey)
          }
          className="text-center"
          style={{ width: "100%" }}
          listHeight={400}
          virtual={false} // Disable virtualization to show all items without scrolling
        >
          {[...Array(11).keys()].map((num) => (
            <Option key={num} value={num}>
              {num}
            </Option>
          ))}
        </Select>
      ),
    };

    const newTotalColumn = {
      title: "Total",
      dataIndex: `total-${newColumnKey}`,
      key: `total-${newColumnKey}`,
      width: 100,
      render: (text, record) => {
        const weight = parseFloat(record.weighting) / 100;
        const value = record[newColumnKey] || 0;
        const total = weight * value;
        return <b className="text-center block">{total.toFixed(2)}</b>;
      },
    };

    setColumns((prevColumns) => [
      ...prevColumns,
      {
        title: (
          <div className="flex items-center justify-between">
            {newColumnTitle}
            <EditFilled
              onClick={() =>
                handleEditClick(
                  newColumnTitle,
                  `new-${columns.length - 2}`,
                  newColumnKey
                )
              }
              style={{ cursor: "pointer", marginLeft: "8px" }}
            />
          </div>
        ),
        key: `new-${columns.length - 2}`,
        dataIndex: `new-${columns.length - 2}`,
        children: [newColumn],
      },
      newTotalColumn,
    ]);

    setDataSource((prevDataSource) =>
      prevDataSource.map((row) => ({
        ...row,
        [newColumnKey]: row[newColumnKey] !== undefined ? row[newColumnKey] : 0,
      }))
    );

    setOptionNames((prev) => ({
      ...prev,
      [newColumnKey]: newColumnTitle,
    }));
    setColumnIndex((prevIndex) => prevIndex + 1);
    setNewOptionName("");
    setPopoverVisible(false);
  };

  const handleCellChange = (value, key, column) => {
    setDataSource((prevDataSource) => {
      const updatedSource = prevDataSource.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            [column]: value,
          };
        }
        return item;
      });

      if (column === "weighting") {
        validateTotalWeighting(updatedSource);
      }

      return updatedSource;
    });
    // update new data in state and localstorage
    setNewDataSource((prev) =>
      prev.map((item) => {
        if (item.scorecardId === scorecardId) {
          return {
            ...item,
            newData: item.newData.map((data) =>
              data.key === key
                ? {
                    ...data,
                    [column]: value, // Update the specific column with the new value
                  }
                : data
            ),
          };
        }
        return item; // Keep unchanged items
      })
    );
  };

  const calculateTotals = () => {
    const totals = {};
    columns.forEach((col) => {
      if (col?.dataIndex && col?.dataIndex === "weighting") {
        totals[col.dataIndex] = dataSource.reduce((sum, row) => {
          const value = parseFloat(row[col.dataIndex]);
          return sum + (isNaN(value) ? 0 : value);
        }, 0);
      } else if (col?.dataIndex && col?.dataIndex?.startsWith("total")) {
        totals[col?.dataIndex] = dataSource.reduce((sum, row) => {
          const value = parseFloat(
            row[`${col.dataIndex.split("-")[1]}-${col.dataIndex.split("-")[2]}`]
          );
          return sum + (isNaN(value) ? 0 : (row["weighting"] / 100) * value);
        }, 0);
      }
    });

    return totals;
  };

  const errorKey = "error_notification";
  const successKey = "success_notification";

  const validateTotalWeighting = (source) => {
    const allItemsHaveValue = source.every(
      (item) => item.weighting !== undefined && item.weighting !== null
      // &&
      // item.weighting != 0
    );

    if (!allItemsHaveValue) {
      notification.destroy();
      return;
    }

    const totalWeighting = source.reduce((total, item) => {
      const weightValue = parseFloat(item.weighting);
      return total + (isNaN(weightValue) ? 0 : weightValue);
    }, 0);
    if (totalWeighting > 100) {
      toast.dismiss();
      toast.error("Weighting must equal 100%");
    } else if (totalWeighting === 100) {
      toast.dismiss();
      toast.success("Total weighting is 100%");
    } else {
      toast.dismiss();
    }
  };

  const isWeightingDisabled = dataSource.reduce((total, item) => {
    const weightValue = parseFloat(item.weighting);
    return total + (isNaN(weightValue) ? 0 : weightValue);
  }, 0);

  const addRow = ({ category, criteria }) => {
    const newRow = {
      key: uuidv4(),
      category: category,
      criteria: criteria,
      weighting: "0%",
      // Initialize new scores based on the current columns
      ...columns.reduce((acc, col) => {
        if (col.key.startsWith("column-")) {
          acc[col.dataIndex] = 0; // Initialize scores to 0
        }
        return acc;
      }, {}),
    };

    setDataSource((prevDataSource) => [newRow, ...prevDataSource]);
    setNewCriteria("");
    setAddCriteriaPopoverVisible(false);
    // if chnage in data source
    setNewDataSource((prev) => {
      // First, update the existing item or add a new item
      const updatedItems = prev.map((item) =>
        item.scorecardId === scorecardId
          ? { scorecardId, newData: [newRow, ...item.newData] }
          : item
      );

      // If scorecardId doesn't exist, add it
      if (!prev.some((item) => item.scorecardId === scorecardId)) {
        updatedItems.push({
          scorecardId,
          newData: [newRow],
        });
      }

      return updatedItems;
    });
  };

  function deleteRow(key) {
    setDataSource((prevDataSource) =>
      prevDataSource.filter((item) => item.key !== key)
    );

    // // Update the local storage with the new array
    setNewDataSource(
      (prev) =>
        prev
          .map((item) => {
            // Check if the item has the matching scorecardId
            if (item.scorecardId === scorecardId) {
              // Filter out the element by its key
              const updatedValue = item.newData.filter(
                (curElem) => curElem.key !== key
              );

              // If there are items left in newData, update the item
              if (updatedValue.length > 0) {
                return {
                  ...item,
                  newData: updatedValue,
                };
              }
              // If newData is empty, don't return this item (i.e., remove it from the array)
              return null; // Returning null will be filtered out in the next step
            }
            // Return unchanged items
            return item;
          })
          .filter(Boolean) // Filter out any null values (which represent the removed item)
    );
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const computeTotalColumnsData = () => {
    showModal();
    setLoading(true);
    const totals = calculateTotals();
    let results = [];
    let index = 0;

    Object.entries(totals).forEach(([key, value]) => {
      if (key.startsWith("total")) {
        results.push({
          name: optionNames[`column-${index}`],
          score: value,
        });
        index++;
      }
    });

    setResultsData(results);
    setLoading(false);
  };

  const handleClickOnSave = async () => {
    if (!decisionInfo.title.trim()) {
      handleOpenDecisionModel();
      setisSaveNewScorecardMdel(false);
      return;
    }
    try {
      const previousDecisionBody = {
        _id: id,
        title: decisionInfo.title,
        description: decisionInfo.description,
        decision: decisionInfo?.decision?.id || null,
        contributors: decisionMakers,
        dataSource,
        columns,
        scorecardType: "quick-view",
      };
      setSaveLoading(true);
      const response = await savePreviousDecision(previousDecisionBody);
      if (response.status === 200) {
        toast.dismiss();
        toast.success("Decision saved successfully");
        removeItem("decision");
        removeItem(BLANK_SCORECARDS_TITLE);
        // setDecisionInfo(FORM_DATA);
        //  remove current scorecardId
        setNewDataSource((prev) =>
          prev.filter((item) => item.scorecardId !== scorecardId)
        );
        handleCancel();
        setisSaveNewScorecardMdel(false);
        return;
      }
      toast.dismiss();
      toast.error(
        "We couldn't save your decision at this time. Please try again later"
      );
    } catch (error) {
      toast.dismiss();
      toast.error(
        "We couldn't save your decision at this time. Please try again later"
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDecisionInfo((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (decisionName) {
      setDecisionInfo(decisionName);
    }
  }, [decisionName]);

  // for checking new changes exit or not
  useEffect(() => {
    if (Array.isArray(prevScorecardsNewChanges)) {
      const data = prevScorecardsNewChanges?.find(
        (item) => item.scorecardId === scorecardId
      );

      setNewDataSource(prevScorecardsNewChanges);
      if (data && data.scorecardId && data?.newData?.length > 0) {
        setDataSource((prev) => [...data.newData, ...prev]);
        setisSaveNewScorecardMdel(true);
      }
    }
  }, [scorecardDataSource]);

  useEffect(() => {
    if (Array.isArray(newdataSource)) {
      setObjectInLocalStorage(CHANGE_IN_SCORECARDS, newdataSource);
    }
  }, [newdataSource]);

  useEffect(() => {
    if (isBlank === "true") {
      setDecisionInfo((prev) => ({
        ...prev,
        title: scorecardName.title,
        description: scorecardName.description,
      }));
    }
  }, [isBlank]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="flex flex-row items-center justify-between mb-4">
          <div className="text-lg text-black font-bold">{scoredCardTitle}</div>
          <div>
            <AddCandidatePopOver
              addColumn={addColumn}
              newOptionName={newOptionName}
              popoverVisible={popoverVisible}
              setNewOptionName={setNewOptionName}
              setPopoverVisible={setPopoverVisible}
              isWeightingCompleted={isWeightingDisabled !== 100}
            />
            <AddCriteriaPopOver
              addRow={addRow}
              newCriteria={newCriteria}
              setNewCriteria={setNewCriteria}
              addCriteriaPopoverVisible={addCriteriaPopoverVisible}
              setAddCriteriaPopoverVisible={setAddCriteriaPopoverVisible}
            />
            <Button
              onClick={computeTotalColumnsData}
              type="primary"
              style={{ marginLeft: 8 }}
            >
              Show Results
            </Button>

            <Button
              onClick={handleClickOnSave}
              type="primary"
              style={{ marginLeft: 8 }}
              disabled={isWeightingDisabled !== 100 || saveLoading}
              loading={saveLoading}
            >
              Save Changes
            </Button>

            <ResultsModal
              resultsData={resultsData}
              setIsModalVisible={setIsModalVisible}
              isModalVisible={isModalVisible}
              loading={loading}
            />
          </div>
        </div>

        <Table
          className="shadow-sm overflow-scroll dynamic-table"
          summary={() => {
            const totals = calculateTotals();

            return (
              <Summary fixed>
                <Summary.Row
                  style={{ fontWeight: "bold", backgroundColor: "#fafafa" }}
                >
                  {columns.map((col) => (
                    <Summary.Cell
                      key={col.key}
                      index={col.key}
                      className="text-center"
                    >
                      {(col?.dataIndex?.startsWith("total-") ||
                        col?.dataIndex === "weighting") &&
                      totals[col.dataIndex] !== undefined
                        ? totals[col.dataIndex].toFixed(2)
                        : ""}
                    </Summary.Cell>
                  ))}
                </Summary.Row>
              </Summary>
            );
          }}
          tableLayout="auto"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: columns.length * 150, y: "auto" }}
          pagination={false}
          bordered
          rowClassName={() => "custom-row-height"}
        />
      </div>

      <NameScorecardModal
        isVisible={isScordcardMdel}
        onCancel={handleCancel}
        handleChange={handleChange}
        decisionInfo={decisionInfo}
        onProceed={handleCancel}
        loading={saveLoading}
        isBlank={isBlank}
      />

      <SaveNewChangesScorecardMdel
        isVisible={isSaveNewScorecardMdel}
        onCancel={() => setisSaveNewScorecardMdel(false)}
        onProceed={handleClickOnSave}
        loading={saveLoading}
        isWeightingCompleted={isWeightingDisabled !== 100}
      />
    </>
  );
};

export default DynamicEditableTable;
