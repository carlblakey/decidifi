import Tour from "reactour";
import { v4 as uuidv4 } from "uuid";
import { ROUTES } from "../../constants";
import {
  Button,
  Modal,
  Form,
  message,
  Input,
  notification,
  Select,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { CiLock, CiUnlock } from "react-icons/ci";
import { DashboardLayout } from "../../components";
import useContextHook from "../../hooks/useContextHook";
import {
  DEFAULT_DECISION_MAKERS,
  INITIAL_DATA_COMPLEX,
  INITIAL_DATA_SIMPLE,
  TOURS,
} from "../../config/dummyData";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";
import DecisionMakersModal from "../../components/MakeADecision/DecisionMakersModal";
import { savePreviousDecision } from "../../api/previousDecisions";
import { DeleteOutlined, EditFilled } from "@ant-design/icons";
import toast from "react-hot-toast";
import NameScorecardModal from "../../components/MakeADecision/NameScorecardModal";
import { getItem, removeItem } from "../../utilities/localStorageMethods";

const Scorecard = () => {
  const decision = getItem("decision");
  const user = getDefaultValUser();
  const [saveLoading, setSaveLoading] = useState(false);
  const [isInitialModalVisible, setIsInitialModalVisible] = useState(false);
  const [scorecardId, setscorecardId] = useState("");
  const [scorecardType, setscorecardType] = useState("");
  const [activeCardRoute, setActiveCardRoute] = useState(
    ROUTES.SIMPLIFIED_SCORECARD
  );

  const [isDecisionMakersModalVisible, setIsDecisionMakersModalVisible] =
    useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [defaultUser, setdefaultUser] = useState({});
  const { decisionMakers, setDecisionMakers, scorecardName } = useContextHook();
  const [scoreCount, setScoreCount] = useState(0);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isScordcardName, setisScordcardName] = useState(false);
  const [scordcardNameModel, setScordcardNameModel] = useState(false);
  const [scoreCardData, setScoreCardData] = useState({
    title: "",
    description: "",
    decision: { id: "", title: "" },
  });

  const [searchParams] = useSearchParams();

  const isBlank = searchParams.get("isblank");
  // const id = searchParams.get("id");

  useEffect(() => {
    if (decision) {
      setScoreCardData((prev) => ({ ...prev, decision }));
    }
    if (isBlank && scorecardName) {
      setScoreCardData((prev) => ({
        ...prev,
        title: scorecardName.title,
        description: scorecardName.description,
      }));
      // setScordcardNameModel(true);
    }
  }, []);

  useEffect(() => {
    const defaultUser = [
      {
        entityId: user.id,
        name: user.name,
        entityType: "user",
        contribution: 100,
      },
    ];
    setdefaultUser(defaultUser);
    setDecisionMakers(defaultUser);
    form.setFieldsValue({ decisionMakers: defaultUser });
  }, []);

  useEffect(() => {
    scorecardType === "quick-view"
      ? setDataSource(INITIAL_DATA_SIMPLE)
      : setDataSource(INITIAL_DATA_COMPLEX);
  }, [scorecardType]);

  // Stable quick-view column generators with useCallback
  const generateWeightingColumns = useCallback(
    (decisionMakers) => {
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
    },
    [decisionMakers]
  );

  // Stable quick-view column generators with useCallback
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
      // ...generateWeightingColumns(decisionMakers),
    ];
  }, [generateWeightingColumns]);

  // Stable in-depth column generators with useCallback
  const generateIndepthWeightingColumns = useCallback(
    (decisionMakers) => {
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
    },
    [decisionMakers]
  );
  // Stable in-depth column generators with useCallback
  const generateIndepthInitialColumns = useCallback(() => {
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
      ...generateIndepthWeightingColumns(decisionMakers),
    ];
  }, [generateIndepthWeightingColumns]);

  const [columns] = useState(generateInitialColumns);
  const [columns2] = useState(generateIndepthInitialColumns);

  const deleteRow = (key) => {
    setDataSource((prevDataSource) =>
      prevDataSource.filter((item) => item.key !== key)
    );
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
  };

  const validateTotalWeighting = (source, column) => {
    // Check if all items have a value for the specified column
    const allItemsHaveValue = source.every(
      (item) => item[column] !== undefined && item[column] !== null
    );

    if (!allItemsHaveValue) {
      return;
    }

    // Calculate total weighting
    const totalWeighting = source.reduce((total, item) => {
      const weightValue = parseFloat(item[column]);
      return total + (isNaN(weightValue) ? 0 : weightValue);
    }, 0);
    // Validate the total weighting
    if (totalWeighting > 100) {
      notification.error({
        message: "Weighting Validation",
        description: `The total weighting must equal 100% for ${
          decisionMakers[parseInt(column.split("-")[1])].name
        }`,
      });
    } else if (totalWeighting === 100) {
      notification.success({
        message: "Weighting Validation",
        description: `The total weighting is 100% for ${
          decisionMakers[parseInt(column.split("-")[1])].name
        }`,
      });
    }
  };

  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const navigate = useNavigate();

  const hasAccessToSimple = true;
  const hasAccessToComplex = true;

  const handleClick = (type) => {
    const id = uuidv4();
    const path =
      type === "quick-view"
        ? `${ROUTES.SIMPLIFIED_SCORECARD}?isblank=${isBlank}&scorecardId=${id}`
        : `${ROUTES.DETAILED_SCORECARD}?isblank=${isBlank}&scorecardId=${id}`;

    setscorecardType(type);
    setscorecardId(id);
    setActiveCardRoute(path);
    setIsInitialModalVisible(true);
  };

  const handleInitialModalOk = () => {
    setIsInitialModalVisible(false);
    setIsDecisionMakersModalVisible(true);
  };

  const handleInitialModalCancel = () => {
    setIsInitialModalVisible(false);
    navigate(activeCardRoute); // or use the path dynamically as needed
  };

  const handleAddDecisionMaker = () => {
    setDecisionMakers([
      ...decisionMakers,
      { name: "", contribution: 0, entityType: "subUser" },
    ]);
  };

  const handleRemoveDecisionMaker = (index) => {
    setDecisionMakers(decisionMakers.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setDecisionMakers([]);
    setIsDecisionMakersModalVisible(false);
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

  const handleClickOnSave = async (id, decisionMakers) => {
    const { data, newCol } = addColumn(decisionMakers);
    const { data: inDepthData, newCol: inDepthCol } =
      addIndepthColumn(decisionMakers);

    const newWeightingColumns = generateWeightingColumns(decisionMakers);
    const newIndepthWeightingColumns =
      generateIndepthWeightingColumns(decisionMakers);

    const updatedColumns = [
      ...columns.slice(0, 3),
      ...newWeightingColumns,
      ...newCol,
    ];
    const updatedIndepthColumns = [
      ...columns2.slice(0, 3),
      ...newIndepthWeightingColumns,
      ...inDepthCol,
    ];

    try {
      setSaveLoading(true);

      // Prepare decision body
      const prepareDecisionBody = (data, columns, scorecardType) => ({
        _id: id,
        dataSource: isBlank === "true" ? [] : data,
        title: scoreCardData.title,
        description: scoreCardData.description,
        decision: scoreCardData?.decision?.id || null,
        scorecardType,
        contributors: decisionMakers,
        columns: sanitizeColumns(columns),
      });

      // Decide which decision body to use
      const decisionBody =
        scorecardType === "quick-view"
          ? prepareDecisionBody(data, updatedColumns, "quick-view")
          : prepareDecisionBody(inDepthData, updatedIndepthColumns, "in-depth");

      const response = await savePreviousDecision(decisionBody);

      if (response.status === 200) {
        toast.dismiss();
        toast.success(
          "Invitation sent. The decision maker has been invited to collaborate"
        );
        setIsDecisionMakersModalVisible(false);
        removeItem("decision");

        setisScordcardName(false);
        setScordcardNameModel(false);

        setTimeout(() => {
          navigate(activeCardRoute, { replace: true });
          window.location.reload();
        }, 1000);

        return;
      }
      toast.dismiss();
      toast.error("Error occurred while sent invitation");
    } catch (error) {
      toast.dismiss();
      toast.error("Error occurred while sent invitation");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const totalContribution = values.decisionMakers.reduce(
        (acc, curr) => acc + curr.contribution,
        0
      );

      if (totalContribution === 100) {
        setDecisionMakers(values.decisionMakers);
        if (!scoreCardData.title.trim()) {
          setisScordcardName(true);
          return;
        }
        // handleClickOnSave(scorecardId, values.decisionMakers);
      } else {
        toast.dismiss();
        toast.error("Total contribution must add up to 100%");
      }
    });
  };

  const handleEditClick = (name, key, newColumnKey) => {};

  const addColumn = (decisionMakers) => {
    const newColumnKey = `total-0`;
    const scoreColumnKey = `score-0`;
    const newColumnTitle = "Option 1";

    const newColumns = decisionMakers.map((curElem, index) => ({
      title: `${curElem.name}'s Score`,
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

    const data = dataSource.map((row) => ({
      ...row,
      ...newColumns.reduce((acc, col) => ({ ...acc, [col.key]: 0 }), {}),
    }));

    const newCol = [
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
    ];

    return { newCol, data };
  };

  const addIndepthColumn = (decisionMakers) => {
    const newColumnKey = `total-0`;
    const scoreColumnKey = `score-0`;
    const newColumnTitle = "Option 1";

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
        let comaprsionSource = localDataSource || dataSource;

        if (localDataSource) {
          comaprsionSource = JSON.parse(comaprsionSource);
        }

        const filteredCategoryRecords = comaprsionSource.filter(
          (v) => v.category == record.category
        );

        const total = decisionMakers.reduce((acc, decisionMaker, idx) => {
          // Retrieve the contribution percentage from the decisionMakers array
          const contributionPercentage =
            parseFloat(decisionMaker.contribution || 0) / 100;

          // Criteria weighting (percentage) from the record
          const weighting =
            parseFloat(
              filteredCategoryRecords[0]
                ? filteredCategoryRecords[0][`weighting-${idx}`] /
                    filteredCategoryRecords.length
                : 0
            ) / 100;

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

    const newCol = [
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
    ];

    const data = dataSource.map((row) => ({
      ...row,
      ...newColumns.reduce((acc, col) => ({ ...acc, [col.key]: 0 }), {}),
    }));

    localStorage.setItem("dataSourceComplex", JSON.stringify(data));

    return { newCol, data };
  };

  // for name of score card
  const handleChange = (e) => {
    const { name, value } = e.target;
    setScoreCardData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCancel = () => {
    setisScordcardName(false);
    setScoreCardData((prev) => ({ ...prev, title: "", description: "" }));
  };

  const handleProceed = () => {
    handleClickOnSave(scorecardId, decisionMakers);
  };

  return (
    <DashboardLayout>
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Make A Decision</h2>
        <p className="mb-5">Select the scorecard you'd like to use:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Simple Scorecard */}
          <div className="quick-view-card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-between">
            <h3 className="text-xl font-bold mb-4">Quick-View Scorecard</h3>
            <p className="mb-4">
              Opt for a Quick-View scorecard for fast insights.
            </p>

            {hasAccessToSimple ? (
              <CiUnlock className="h-16 w-16 text-green-500 mb-4" />
            ) : (
              <CiLock className="h-16 w-16 text-red-500 mb-4" />
            )}
            <Button
              className={`text-white py-5 rounded ${
                hasAccessToSimple
                  ? "bg-primary hover:bg-primary"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              disabled={!hasAccessToSimple}
              type="primary"
              block
              onClick={() => handleClick("quick-view")}
            >
              {hasAccessToSimple ? "Access Quick-View Scorecard" : "Locked"}
            </Button>
          </div>

          {/* Complex Scorecard */}
          <div className="in-depth-card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-between">
            <h3 className="text-xl font-bold mb-4">In-Depth Scorecard</h3>
            <p className="mb-4">
              Opt for an In-Depth scorecard for detailed analysis.
            </p>

            {hasAccessToComplex ? (
              <CiUnlock className="h-16 w-16 text-green-500 mb-4" />
            ) : (
              <CiLock className="h-16 w-16 text-red-500 mb-4" />
            )}
            <Button
              className={`text-white py-5 rounded ${
                hasAccessToComplex
                  ? "bg-primary hover:bg-primary"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              disabled={!hasAccessToComplex}
              type="primary"
              block
              onClick={() => handleClick("in-depth")}
            >
              {hasAccessToComplex ? "Access In-Depth Scorecard" : "Locked"}
            </Button>
          </div>
        </div>

        {/* Initial Modal */}
        <Modal
          title="Add Decision Makers"
          open={isInitialModalVisible}
          onOk={handleInitialModalOk}
          onCancel={handleInitialModalCancel}
          okText="Yes"
          cancelText="No"
        >
          <p>Would you like to include additional decision makers?</p>
        </Modal>

        {/* Decision Makers Modal */}
        <DecisionMakersModal
          form={form}
          handleClose={handleClose}
          handleModalOk={handleModalOk}
          isModalVisible={isDecisionMakersModalVisible}
          handleAddDecisionMaker={handleAddDecisionMaker}
          handleRemoveDecisionMaker={handleRemoveDecisionMaker}
          defaultUser={defaultUser}
          saveLoading={saveLoading}
          form2={form2}
        />

        <Tour
          isOpen={isTourOpen}
          steps={TOURS.SCORECARD}
          onRequestClose={() => setIsTourOpen(false)}
        />
      </main>

      <NameScorecardModal
        isVisible={isScordcardName}
        onCancel={handleCancel}
        handleChange={handleChange}
        decisionInfo={scoreCardData}
        onProceed={handleProceed}
        loading={saveLoading}
        isBlank={isBlank}
      />
    </DashboardLayout>
  );
};

export default Scorecard;
