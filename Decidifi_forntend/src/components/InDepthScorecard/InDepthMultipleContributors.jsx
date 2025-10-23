import { DeleteOutlined, EditFilled, TrophyOutlined } from "@ant-design/icons";
import React, { useState, useCallback, useEffect } from "react";
import { Table, Input, Button, Select, notification, message } from "antd";
import ResultsModal from "../../components/MakeADecision/ResultsModal";
import AddCandidatePopOver from "../../components/MakeADecision/AddCandidatePopOver";
import InDepthAddCategoryModal from "../../components/InDepthScorecard/InDepthAddCategoryModal";
import { useSearchParams } from "react-router-dom";
import {
  BLANK_SCORECARDS_TITLE,
  CHANGE_IN_SCORECARDS,
} from "../../utilities/localStorageKeys";
import {
  getItem,
  removeItem,
  setObjectInLocalStorage,
} from "../../utilities/localStorageMethods";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";
import { savePreviousDecision } from "../../api/previousDecisions";
import NameScorecardModal from "../MakeADecision/NameScorecardModal";
import SaveNewChangesScorecardMdel from "../MakeADecision/SaveNewChangesScorecardMdel";
import useContextHook from "../../hooks/useContextHook";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
const { Summary } = Table;

const FORM_DATA = {
  title: "",
  description: "",
  decision: { id: "", title: "" },
};

const InDepthMultipleContributors = ({
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
  const [saveLoading, setSaveLoading] = useState(false);
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

  const [editingColumnKey, setEditingColumnKey] = useState(null);
  const [newColKey, setnewColumnKey] = useState("");
  const { scorecardName } = useContextHook();
  // Stable column generators with useCallback
  const generateWeightingColumns = useCallback(() => {
    const weigthingColumnKeys = {};

    const newColumnsWeigthing = decisionMakers.map((maker, index) => {
      const dataIndex = `weighting-${index}`;
      weigthingColumnKeys[dataIndex] = 0;

      return {
        title: `${maker.name}'s Weighting %`,
        dataIndex: dataIndex,
        key: dataIndex,
        minWidth: 120,
        render: (text, record, index) => {
          const rowSpan = record.rowSpan || 0;
          return rowSpan ? (
            <Input
              value={text}
              type="number"
              className="text-center"
              min={0}
              max={100}
              onChange={(e) =>
                handleCellChange(e.target.value, record.key, dataIndex)
              }
            />
          ) : null; // Render input only for rows with rowSpan > 0
        },
        onCell: (record) => ({
          rowSpan: record.rowSpan || 0, // Set rowSpan for each row
        }),
      };
    });

    setDataSource((prev) => {
      const newState = [...prev];

      const updatedState = newState.map((v) => ({
        ...v,
        ...weigthingColumnKeys,
      }));

      localStorage.setItem("dataSourceComplex", JSON.stringify(updatedState));

      return updatedState;
    });

    return newColumnsWeigthing;
  }, [decisionMakers]);

  const generateInitialColumns = useCallback(() => {
    return [
      {
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        minWidth: 90,
        render: (_, record) => {
          const rowSpan = record.rowSpan || 0;
          return rowSpan ? (
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => deleteRow(record.category)}
              danger
            />
          ) : null;
        },
        onCell: (record) => ({
          rowSpan: record.rowSpan || 0, // Set rowSpan for each row
        }),
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        minWidth: 200,
        render: (text, record, index) => {
          // Get the rowSpan value for the current row
          const rowSpan = record.rowSpan || 0;
          return rowSpan ? <b>{text}</b> : null; // Render text only for rows with rowSpan > 0
        },
        onCell: (record) => ({
          rowSpan: record.rowSpan || 0, // Set rowSpan for each row
        }),
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
          render: (text, record) => {
            const rowSpan = record.rowSpan || 0;
            return rowSpan ? (
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
            ) : null;
          },
          onCell: (record) => ({
            rowSpan: record.rowSpan || 0, // Set rowSpan for each row
          }),
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
          render: (_, record) => {
            const rowSpan = record.rowSpan || 0;
            return rowSpan ? (
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => deleteRow(record.category)}
                danger
              />
            ) : null;
          },
          onCell: (record) => ({
            rowSpan: record.rowSpan || 0, // Set rowSpan for each row
          }),
        };
      }

      // Render logic for "Actions"
      if (column?.title === "Category") {
        return {
          ...column,
          render: (text, record) => {
            const rowSpan = record.rowSpan || 0;
            return rowSpan ? <b>{text}</b> : null;
          },
          onCell: (record) => ({
            rowSpan: record.rowSpan || 0, // Set rowSpan for each row
          }),
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

      localStorage.setItem("dataSourceComplex", JSON.stringify(updateState));

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
    const uniqueSource = Array.from(
      source
        .reduce((map, item) => {
          if (!map.has(item.category)) {
            map.set(item.category, item); // Only add the first occurrence
          }
          return map;
        }, new Map())
        .values()
    );

    const allItemsHaveValue = uniqueSource.every(
      (item) => item[column] !== undefined && item[column] !== null
      // && item[column] != 0
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

        const uniqueSource = Array.from(
          dataSource
            .reduce((map, item) => {
              if (!map.has(item.category)) {
                map.set(item.category, item); // Only add the first occurrence
              }
              return map;
            }, new Map())
            .values()
        );
        const currentUserWeightingColumn = `weighting-${currentUserIndex}`;
        const allItemsHaveValue = uniqueSource.every(
          (s) =>
            s[currentUserWeightingColumn] !== undefined &&
            s[currentUserWeightingColumn] !== null
        );

        if (!allItemsHaveValue) return true;

        const weighting = uniqueSource.reduce((total, item) => {
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
        const localDataSource = localStorage.getItem("dataSourceComplex");
        let comparisonSource = localDataSource
          ? JSON.parse(localDataSource)
          : dataSource;

        const filteredCategoryRecords = comparisonSource.filter(
          (v) => v.category === record.category
        );

        const total = decisionMakers.reduce((acc, decisionMaker, idx) => {
          // Contribution %
          const contributionPercentage =
            Number(decisionMaker.contribution) / 100 || 0;

          // Weighting (average if multiple records in same category)
          const rawWeighting =
            filteredCategoryRecords[0]?.[`weighting-${idx}`] ??
            record[`weighting-${idx}`] ??
            0;
          const weighting = Number(rawWeighting) / 100 || 0;

          // Score
          const rawScore = record[`${scoreColumnKey}-${idx}`];
          const score = Number(rawScore) || 0;

          // Weighted Score
          const weightedScore = contributionPercentage * weighting * score;

          return acc + weightedScore;
        }, 0);

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

    setDataSource((prevDataSource) => {
      const updatedState = prevDataSource.map((row) => ({
        ...row,
        ...newColumns.reduce((acc, col) => ({ ...acc, [col.key]: 0 }), {}),
      }));

      localStorage.setItem("dataSourceComplex", JSON.stringify(updatedState));

      return updatedState;
    });

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
      if (col.dataIndex && col.dataIndex.startsWith("weighting")) {
        totals[col.dataIndex] = dataSource.reduce((sum, row) => {
          const value = parseFloat(row[col.dataIndex]);
          return sum + (isNaN(value) ? 0 : value);
        }, 0);
      } else if (col.dataIndex && col.dataIndex.startsWith("total")) {
        if (col.dataIndex && col.dataIndex.startsWith("total")) {
          // Loop through each row in dataSource
          dataSource.forEach((row) => {
            if (!totals[col.dataIndex]) totals[col.dataIndex] = 0;

            const filteredCategoryRecords = dataSource.filter(
              (v) => v.category == row.category
            );

            // Calculate total for each decision maker
            decisionMakers.forEach((decisionMaker, decisionMakerIdx) => {
              const contributionPercentage =
                parseFloat(decisionMaker.contribution || 0) / 100;
              const weighting =
                parseFloat(
                  filteredCategoryRecords[0]
                    ? (filteredCategoryRecords[0][
                        `weighting-${decisionMakerIdx}`
                      ] || 0) / filteredCategoryRecords.length
                    : 0
                ) / 100;
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

  const deleteRow = (category) => {
    setDataSource((prevDataSource) => {
      const newState = [...prevDataSource];
      const updatedState = newState.filter(
        (item) => item.category !== category
      );
      localStorage.setItem("dataSourceComplex", JSON.stringify(updatedState));

      return updatedState;
    });

    // // Update the local storage with the new array
    setNewDataSource(
      (prev) =>
        prev
          .map((item) => {
            // Check if the item has the matching scorecardId
            if (item.scorecardId === scorecardId) {
              // Filter out the element by its key
              const updatedValue = item.newData.filter(
                (curElem) => curElem.category !== category
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

  const addRow = (rows) => {
    let currentKeys = dataSource.length;

    // Dynamically gather all column keys from the current dataSource
    const columnKeys = dataSource.reduce((keys, row) => {
      Object.keys(row).forEach((key) => {
        if (key.startsWith("score-") && !keys.includes(key)) {
          keys.push(key);
        }
      });
      return keys;
    }, []);

    const weightingKeys = dataSource.reduce((keys, row) => {
      Object.keys(row).forEach((key) => {
        if (key.startsWith("weighting-") && !keys.includes(key)) {
          keys.push(key);
        }
      });
      return keys;
    }, []);

    // Map new rows to include all column keys initialized to 0
    const newRows = rows.map((v, k) => {
      currentKeys = currentKeys + 1;

      // Initialize row data
      return {
        key: uuidv4(),
        ...v,
        weighting: 0,
        rowSpan: k === 0 ? rows.length : 0,
        // Include all column keys with default value 0
        ...columnKeys.reduce((acc, colKey) => {
          acc[colKey] = 0;
          return acc;
        }, {}),
        ...weightingKeys.reduce((acc, colKey) => {
          acc[colKey] = 0;
          return acc;
        }, {}),
      };
    });

    setDataSource((prevDataSource) => [...newRows, ...prevDataSource]);
    localStorage.setItem(
      "dataSourceComplex",
      JSON.stringify([...newRows, ...dataSource])
    );
    setNewCriteria("");
    setAddCriteriaPopoverVisible(false);
    // if chnage in data source
    setNewDataSource((prev) => {
      // First, update the existing item or add a new item
      const updatedItems = prev.map((item) =>
        item.scorecardId === scorecardId
          ? { scorecardId, newData: [...newRows, ...item.newData] }
          : item
      );

      // If scorecardId doesn't exist, add it
      if (!prev.some((item) => item.scorecardId === scorecardId)) {
        updatedItems.push({
          scorecardId,
          newData: [...newRows],
        });
      }

      return updatedItems;
    });
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
        scorecardType: "in-depth",
        contributors: decisionMakers,
        columns: sanitizeColumns(columns),
      };

      setSaveLoading(true);
      const response = await savePreviousDecision(previousDecisionBody);

      if (response.status === 200) {
        toast.dismiss();
        toast.success("Decision successfully saved");
        removeItem("decision");
        // setDecisionInfo(FORM_DATA);
        removeItem(BLANK_SCORECARDS_TITLE);
        handleCancel();
        //  remove current scorecardId
        setNewDataSource((prev) =>
          prev.filter((item) => item.scorecardId !== scorecardId)
        );
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
        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <AddCandidatePopOver
            addColumn={addColumn}
            newOptionName={newOptionName}
            popoverVisible={popoverVisible}
            setNewOptionName={setNewOptionName}
            setPopoverVisible={setPopoverVisible}
            isWeightingCompleted={isWeightingDisabled}
          />

          <InDepthAddCategoryModal
            addRow={addRow}
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
            disabled={isWeightingDisabled || saveLoading}
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

export default InDepthMultipleContributors;
