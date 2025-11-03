import ResultsModal from "./ResultsModal";
import AddCriteriaPopOver from "./AddCriteriaPopOver";
import AddCandidatePopOver from "./AddCandidatePopOver";
import useContextHook from "../../hooks/useContextHook";
import { DeleteOutlined, EditFilled } from "@ant-design/icons";
import React, { useState, useCallback, useEffect } from "react";
import { savePreviousDecision } from "../../api/previousDecisions";
import { Table, Input, Button, Select, notification, message } from "antd";
import NameScorecardModal from "./NameScorecardModal";
import {
  getItem,
  removeItem,
  setObjectInLocalStorage,
} from "../../utilities/localStorageMethods";
import {
  BLANK_SCORECARDS_TITLE,
  CHANGE_IN_SCORECARDS,
} from "../../utilities/localStorageKeys";
import { useSearchParams } from "react-router-dom";
import SaveNewChangesScorecardMdel from "./SaveNewChangesScorecardMdel";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
const { Summary } = Table;
const FORM_DATA = {
  title: "",
  description: "",
  decision: { id: "", title: "" },
};

const MultiDynamicEditableTable = ({
  id,
  initialData,
  decisionMakers,
  scorecardColumns,
  scorecardDataSource,
  isBlank,
  isScordcardMdel,
  handleCancel,
  handleOpenDecisionModel,
  decisionName,
}) => {
  const user = getDefaultValUser();

  const prevScorecardsNewChanges = getItem(CHANGE_IN_SCORECARDS) || [];
  const [searchParams] = useSearchParams();
  const scorecardId = searchParams.get("scorecardId");
  const [isSaveNewScorecardMdel, setisSaveNewScorecardMdel] = useState(false);

  const [decisionInfo, setDecisionInfo] = useState(FORM_DATA);
  const [scoreCount, setScoreCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resultsData, setResultsData] = useState([]);
  const [optionNames, setOptionNames] = useState({});
  const [newOptionName, setNewOptionName] = useState("");
  const [dataSource, setDataSource] = useState(initialData);
  const [newdataSource, setNewDataSource] = useState(prevScorecardsNewChanges);

  const [popoverVisible, setPopoverVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCriteria, setNewCriteria] = useState("");
  const [addCriteriaPopoverVisible, setAddCriteriaPopoverVisible] =
    useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editingColumnKey, setEditingColumnKey] = useState(null);
  const [newColKey, setnewColumnKey] = useState("");

  const { scorecardName } = useContextHook();

  // Stable column generators with useCallback
  const generateWeightingColumns = useCallback(() => {
    return decisionMakers.map((maker, index) => ({
      title: `${maker.name}'s Weighting %`,
      dataIndex: `weighting-${index}`,
      key: `weighting-${index}`,
      minWidth: 120,
      render: (text, record) => (
        <Input
          value={text}
          type="number"
          min={0}
          max={100}
          className="text-center"
          onChange={(e) =>
            handleCellChange(e.target.value, record.key, `weighting-${index}`)
          }
        />
      ),
    }));
  }, [decisionMakers]);

  const generateInitialColumns = useCallback(() => {
    return [
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
        minWidth: 200,
        render: (text) => <b>{text}</b>,
      },
      {
        title: "Criteria",
        dataIndex: "criteria",
        minWidth: 400,
        key: "criteria",
        render: (text) => <b>{text}</b>,
      },
      ...generateWeightingColumns(),
    ];
  }, [generateWeightingColumns]);

  const [columns, setColumns] = useState(generateInitialColumns);

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
    return rawColumns.map((column) => {
      // Recursively process children columns
      if (column?.children && Array.isArray(column.children)) {
        return {
          ...column,
          children: processColumns(column.children, column.title), // Pass parent title to children
        };
      }

      // Render logic for "Score"
      if (column?.title?.includes("Score")) {
        setOptionNames((prev) => ({
          ...prev,
          [`${column.key.split("-")[0]}-${column.key.split("-")[1]}`]:
            parentTitle,
        }));

        return {
          ...column,
          render: (text, record) => (
            <Select
              value={text !== undefined ? text : null}
              onChange={(value) =>
                handleCellChange(value, record.key, column.dataIndex)
              }
              listHeight={400}
              virtual={false} // Disable virtualization for smooth dropdown
              style={{ width: "100%" }}
              className="text-center"
            >
              {[...Array(11).keys()].map((num) => (
                <Select.Option key={num} value={num}>
                  {num}
                </Select.Option>
              ))}
            </Select>
          ),
        };
      }

      // Render logic for "Weighting %"
      if (column?.title?.includes("Weighting %")) {
        return {
          ...column,
          render: (text, record) => (
            <Input
              value={text}
              type="number"
              min={0}
              max={100}
              className="text-center"
              onChange={(e) =>
                handleCellChange(e.target.value, record.key, column.dataIndex)
              }
            />
          ),
        };
      }

      if (column?.title === "Total") {
        return {
          ...column,
          render: (text, record) => {
            // Extract the scoreKey from the column key (assuming a standard format)
            const scoreKey = column.key.split("total-")[1]; // Extract "1" from "total-1"

            const total = decisionMakers.reduce((acc, maker, idx) => {
              const contribution = parseFloat(maker.contribution || 0) / 100; // Contribution percentage
              const weighting =
                parseFloat(record[`weighting-${idx}`] || 0) / 100; // Weighting percentage
              const score = parseFloat(record[`score-${scoreKey}-${idx}`] || 0); // Dynamically find score

              // Weighted score calculation
              const weightedScore = contribution * weighting * score;
              return acc + weightedScore;
            }, 0);

            return <b className="text-center block">{total.toFixed(2)}</b>; // Render total with 2 decimal places
          },
        };
      }

      // Render logic for "Actions"
      if (column?.title === "Actions") {
        return {
          ...column,
          render: (_, record) => (
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => deleteRow(record.key)}
              danger
            />
          ),
        };
      }

      // Default render logic
      return {
        ...column,
        render: (text) => <b>{text}</b>, // Bold the text by default
      };
    });
  };

  // Cell change handler preserving all cell data
  const handleCellChange = (value, key, column, title) => {
    setDataSource((prevData) => {
      const newState = [...prevData];

      const updateState = newState.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            [column]: value,
          };
        }
        return item;
      });
      if (column.startsWith("weighting")) {
        validateTotalWeighting(updateState, column);
      }

      return updateState;
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

  const validateTotalWeighting = (source, column) => {
    // Check if all items have a value for the specified column
    const allItemsHaveValue = source.every(
      (item) => item[column] !== undefined && item[column] !== null
    );

    if (!allItemsHaveValue) {
      notification.destroy();
      return;
    }

    // Calculate total weighting
    const totalWeighting = source.reduce((total, item) => {
      const weightValue = parseFloat(item[column]);
      return total + (isNaN(weightValue) ? 0 : weightValue);
    }, 0);
    // Validate the total weighting
    if (totalWeighting > 100) {
      toast.dismiss();
      toast.error(
        `Weighting must equal 100% for ${
          decisionMakers[parseInt(column.split("-")[1])].name
        }`
      );
    } else if (totalWeighting === 100) {
      toast.dismiss();
      toast.success(
        `Total weighting is 100% for ${
          decisionMakers[parseInt(column.split("-")[1])].name
        }`
      );
    } else {
      toast.dismiss();
    }
  };

  // index current user
  const currentUserIndex = decisionMakers.findIndex(
    (maker) => maker.entityId === user.id
  );

  const shouldOptionDisabled = () => {
    return columns.some((v) => {
      if (v?.dataIndex?.startsWith("weighting")) {
        if (currentUserIndex === -1) return false;

        const currentUserWeightingColumn = `weighting-${currentUserIndex}`;

        const allItemsHaveValue = dataSource.every(
          (s) =>
            s[currentUserWeightingColumn] !== undefined &&
            s[currentUserWeightingColumn] !== null
        );

        if (!allItemsHaveValue) return true;

        const weighting = dataSource.reduce((total, item) => {
          const weightValue = parseFloat(item[currentUserWeightingColumn]); // Correct reference to column
          return total + (isNaN(weightValue) ? 0 : weightValue);
        }, 0);

        return weighting !== 100; // If the weighting is not 100, return true
      }
      return false; // Continue checking other columns
    });
  };

  const isWeightingDisabled = shouldOptionDisabled();

  const handleEditClick = (name, key, newColumnKey) => {
    setnewColumnKey(newColumnKey);
    setNewOptionName(name);
    setEditingColumnKey(key); // Track the column that is being edited
    setPopoverVisible(true);
  };

  const updateColumnTitle = (key, value, newColKey) => {
    setOptionNames((prev) => ({
      ...prev,
      [newColKey]: value,
    }));

    // Update the column tilogtle
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

    setNewOptionName("");
    setPopoverVisible(false);
    setEditingColumnKey(null); // Reset the editing column key
  };

  const addColumn = () => {
    if (editingColumnKey) {
      updateColumnTitle(editingColumnKey, newOptionName, newColKey);
      return;
    }
    const newColumnKey = `total-${scoreCount + 1}`;
    const scoreColumnKey = `score-${scoreCount + 1}`;
    const newColumnTitle = newOptionName || "Option 1";

    const newColumns = decisionMakers.map((_, index) => ({
      title: `${_.name}'s Score`,
      dataIndex: `${scoreColumnKey}-${index}`,
      key: `${scoreColumnKey}-${index}`,
      minWidth: 120,
      render: (text, record) => (
        <Select
          value={text !== undefined ? text : null}
          onChange={(value) =>
            handleCellChange(value, record.key, `${scoreColumnKey}-${index}`)
          }
          listHeight={400}
          virtual={false} // Disable virtualization to show all items without scrolling
          style={{ width: "100%" }}
          className="text-center"
        >
          {[...Array(11).keys()].map((num) => (
            <Select.Option key={num} value={num}>
              {num}
            </Select.Option>
          ))}
        </Select>
      ),
    }));

    const newTotalColumn = {
      title: "Total",
      dataIndex: newColumnKey,
      key: newColumnKey,
      minWidth: 80,
      render: (text, record) => {
        const total = decisionMakers.reduce((acc, decisionMaker, idx) => {
          // Retrieve the contribution percentage from the decisionMakers array
          const contributionPercentage =
            parseFloat(decisionMaker.contribution || 0) / 100;

          // Criteria weighting (percentage) from the record
          const weighting = parseFloat(record[`weighting-${idx}`] || 0) / 100;

          // 11-point scoring system score from the record
          const score = parseFloat(record[`${scoreColumnKey}-${idx}`] || 0);

          // Calculate the weighted score
          const weightedScore = contributionPercentage * weighting * score;

          return acc + weightedScore;
        }, 0);

        // Display the final total rounded to two decimal places
        return <b className="text-center block">{total.toFixed(2)}</b>;
      },
    };

    setScoreCount((prev) => prev + 1);

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
                  scoreColumnKey
                )
              }
              style={{ cursor: "pointer", marginLeft: "8px" }}
            />
          </div>
        ),
        key: `new-${columns.length - 2}`,
        children: newColumns,
      },
      newTotalColumn,
    ]);

    setDataSource((prevDataSource) =>
      prevDataSource.map((row) => ({
        ...row,
        ...newColumns.reduce((acc, col) => ({ ...acc, [col.key]: 0 }), {}),
      }))
    );

    setOptionNames((prev) => ({
      ...prev,
      [scoreColumnKey]: newColumnTitle,
    }));

    setNewOptionName("");
    setPopoverVisible(false);
  };

  const calculateTotals = () => {
    const totals = {};
    columns.forEach((col) => {
      if (col?.dataIndex && col?.dataIndex?.startsWith("weighting")) {
        totals[col.dataIndex] = dataSource.reduce((sum, row) => {
          const value = parseFloat(row[col.dataIndex]);
          return sum + (isNaN(value) ? 0 : value);
        }, 0);
      } else if (col?.dataIndex && col?.dataIndex?.startsWith("total")) {
        if (col.dataIndex && col.dataIndex.startsWith("total")) {
          // Loop through each row in dataSource
          dataSource.forEach((row) => {
            if (!totals[col?.dataIndex]) totals[col?.dataIndex] = 0;

            // Calculate total for each decision maker
            decisionMakers.forEach((decisionMaker, decisionMakerIdx) => {
              const contributionPercentage =
                parseFloat(decisionMaker.contribution || 0) / 100;
              const weighting =
                parseFloat(row[`weighting-${decisionMakerIdx}`] || 0) / 100;
              const score = parseFloat(
                row[
                  `score-${col.dataIndex.split("-")[1]}-${decisionMakerIdx}`
                ] || 0
              );

              const weightedScore = contributionPercentage * weighting * score;

              totals[col.dataIndex] += weightedScore;
            });
          });
        }
      }
    });

    return totals;
  };

  const deleteRow = (key) => {
    setDataSource((prevDataSource) =>
      prevDataSource.filter((item) => item.key !== key)
    );

    // Update the local storage with the new array
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
  };

  const addRow = ({ category, criteria }) => {
    const newRow = {
      key: uuidv4(),
      criteria: criteria,
      category: category,
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
    // const newDataSource = [
    //   ...prevScorecardsNewChanges.map((item) =>
    //     item.scorecardId === scorecardId
    //       ? { scorecardId, newData: [newRow, ...item.newData] }
    //       : item
    //   ),
    //   // If the scorecardId doesn't exist, add it to the array
    //   !prevScorecardsNewChanges.some(
    //     (item) => item.scorecardId === scorecardId
    //   ) && {
    //     scorecardId,
    //     newData: [newRow],
    //   },
    // ].filter(Boolean);
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

  const sanitizeColumns = (columns) => {
    return columns.map((column) => {
      const sanitizedColumn = { ...column };

      // Remove or transform React elements (like title) to plain text or structured data
      if (React.isValidElement(sanitizedColumn.title)) {
        sanitizedColumn.title = sanitizedColumn.title.props.children
          ? sanitizedColumn.title.props.children[0] // Extract the plain text
          : "Untitled";
      }

      // Recursively sanitize children if present
      if (sanitizedColumn.children) {
        sanitizedColumn.children = sanitizeColumns(sanitizedColumn.children);
      }

      return sanitizedColumn;
    });
  };

  const handleClickOnSave = async () => {
    if (!decisionInfo.title.trim()) {
      setisSaveNewScorecardMdel(false);
      handleOpenDecisionModel();
      return;
    }

    try {
      const previousDecisionBody = {
        _id: id,
        dataSource,
        title: decisionInfo.title,
        description: decisionInfo.description,
        decision: decisionInfo?.decision?.id || null,
        scorecardType: "quick-view",
        contributors: decisionMakers,
        columns: sanitizeColumns(columns),
      };

      setSaveLoading(true);
      const response = await savePreviousDecision(previousDecisionBody);

      if (response.status === 200) {
        toast.dismiss();
        toast.success("Decision successfully saved");
        // setDecisionInfo(FORM_DATA);
        setNewDataSource((prev) =>
          prev.filter((item) => item.scorecardId !== scorecardId)
        );

        removeItem("decision");

        removeItem(BLANK_SCORECARDS_TITLE);
        handleCancel();
        //  remove current scorecardId
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
          name: optionNames[`score-${index}`],
          score: value,
        });
        index++;
      }
    });

    setResultsData(results);
    setLoading(false);
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
        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <AddCandidatePopOver
            addColumn={addColumn}
            newOptionName={newOptionName}
            popoverVisible={popoverVisible}
            setNewOptionName={setNewOptionName}
            setPopoverVisible={setPopoverVisible}
            isWeightingCompleted={isWeightingDisabled}
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
            // icon={<TrophyOutlined />}
          >
            Show Results
          </Button>

          <Button
            onClick={handleClickOnSave}
            type="primary"
            style={{ marginLeft: 8 }}
            // icon={<TrophyOutlined />}
            loading={saveLoading}
            disabled={isWeightingDisabled || saveLoading}
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

        <Table
          className="shadow-sm overflow-scroll dynamic-table"
          columns={columns}
          dataSource={dataSource}
          scroll={{
            x: columns.length * 150,
            y: "auto",
          }}
          summary={() => {
            const totals = calculateTotals();

            return (
              <Summary fixed>
                <Summary.Row
                  style={{ fontWeight: "bold", backgroundColor: "#fafafa" }}
                >
                  {columns.map((col) => {
                    if (col.children) {
                      // Render empty cells for grouped columns
                      return col.children.map((childCol) => (
                        <Summary.Cell
                          key={childCol.key}
                          index={childCol.key}
                          className="text-center"
                        >
                          {childCol.dataIndex &&
                          (childCol.dataIndex.startsWith("weighting-") ||
                            childCol.dataIndex.startsWith("total-")) &&
                          totals[childCol.dataIndex] !== undefined
                            ? totals[childCol.dataIndex].toFixed(2)
                            : ""}
                        </Summary.Cell>
                      ));
                    } else {
                      // Render cells for non-grouped columns
                      return (
                        <Summary.Cell
                          key={col.key}
                          index={col.key}
                          className="text-center"
                        >
                          {col.dataIndex &&
                          (col.dataIndex.startsWith("weighting-") ||
                            col.dataIndex.startsWith("total-")) &&
                          totals[col.dataIndex] !== undefined
                            ? totals[col.dataIndex].toFixed(2)
                            : ""}
                        </Summary.Cell>
                      );
                    }
                  })}
                </Summary.Row>
              </Summary>
            );
          }}
          pagination={false}
          bordered
          tableLayout="auto"
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
        isWeightingCompleted={isWeightingDisabled}
      />
    </>
  );
};

export default MultiDynamicEditableTable;
