import { Input, Select, Table, notification } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";

const { Option } = Select;
const { Summary } = Table;

const DynamicEditableTable = ({ initialData }) => {
  const initialColumns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Criteria",
      dataIndex: "criteria",
      key: "criteria",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (text, record) => (
        <Select
          value={text}
          // onChange={(value) =>
          //   handleCellChange(value, record.key, newColumnKey)
          // }
          className="text-center"
          style={{ width: "100px" }}
          listHeight={400}
          virtual={false}
        >
          <Option value="yes">Yes</Option>
          <Option value="no">No</Option>
        </Select>
      ),
    },
  ];

  const [optionNames, setOptionNames] = useState({});
  const [columns, setColumns] = useState([...initialColumns]);
  const [dataSource, setDataSource] = useState(initialData);

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
  };

  const calculateTotals = () => {
    const totals = {};
    columns.forEach((col) => {
      if (col.dataIndex === "weighting") {
        totals[col.dataIndex] = dataSource.reduce((sum, row) => {
          const value = parseFloat(row[col.dataIndex]);
          return sum + (isNaN(value) ? 0 : value);
        }, 0);
      } else if (col.dataIndex.startsWith("total")) {
        totals[col.dataIndex] = dataSource.reduce((sum, row) => {
          const value = parseFloat(
            row[`${col.dataIndex.split("-")[1]}-${col.dataIndex.split("-")[2]}`]
          );
          return sum + (isNaN(value) ? 0 : (row["weighting"] / 100) * value);
        }, 0);
      }
    });

    return totals;
  };

  const validateTotalWeighting = (source) => {
    const allItemsHaveValue = source.every(
      (item) =>
        item.weighting !== undefined &&
        item.weighting !== null &&
        item.weighting != 0
    );

    if (!allItemsHaveValue) {
      return;
    }

    const totalWeighting = source.reduce((total, item) => {
      const weightValue = parseFloat(item.weighting);
      return total + (isNaN(weightValue) ? 0 : weightValue);
    }, 0);

    if (totalWeighting > 100) {
      toast.dismiss();
      toast.error("Weighting must equal 100%");
      // notification.error({
      //   message: "Weighting Validation",
      //   description: "The total weighting must equal 100%",
      // });
    } else if (totalWeighting === 100) {
      toast.dismiss();
      toast.success("Total weighting is 100%");
      // notification.success({
      //   message: "Weighting Validation",
      //   description: "The total weighting is 100%",
      // });
    } else {
      toast.dismiss();
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "15px auto",
        }}
      >
        {/* <div className="flex flex-row items-center justify-between mb-4">
          <div className="text-lg text-black font-bold">
            Quick-View Scorecard
          </div>
        </div> */}

        <Table
          className="shadow-sm overflow-auto dynamic-table"
          tableLayout="auto"
          columns={columns}
          dataSource={dataSource}
          // scroll={{ x: columns.length * 150, y: "auto" }}
          pagination={false}
          bordered
          rowClassName={() => "custom-row-height"}
        />
      </div>
    </>
  );
};

export default DynamicEditableTable;
