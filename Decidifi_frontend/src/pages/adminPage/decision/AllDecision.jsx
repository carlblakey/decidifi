import {
  CheckCircleFilled,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { deleteDecision } from "../../../api/admin/decisions";
import { setAuthToken } from "../../../api/client";
import { allDecisionLibrary } from "../../../api/decisionLibrary";
import { AdminDashboardLayout } from "../../../components";
import { ROUTES } from "../../../constants";
import { getToken } from "../../../utilities/localStorageMethods";
import { convertData } from "../../mainPages/MakeADecision";

const AllDecision = () => {
  const navigate = useNavigate();
  const [decisions, setDecisions] = useState([]);
  const [selectedDecisionsLocal, setSelectedDecisionsLocal] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    image: "",
    title: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // category selection and view in model
  const handleCategoryClick = (decisions, selectedCategory) => {
    setIsModalVisible(true);
    setSelectedDecisionsLocal(decisions);
    setSelectedCategory(selectedCategory);
  };

  // get all categories
  const getDecision = async () => {
    try {
      setLoading(true);
      const res = await allDecisionLibrary();
      const convertedData =
        res?.data?.data?.length > 0 ? convertData(res?.data?.data) : [];
      setDecisions(convertedData);

      if (res.data.status === 401) {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error while loading decision");
    } finally {
      setLoading(false);
    }
  };

  // delete the decision
  const handleDeleteDecision = async (id) => {
    try {
      setDeleteLoading(true);
      const res = await deleteDecision(id);
      if (res.data.status === 200) {
        toast.success(res.data.message);
        setIsModalVisible(false);
        setDecisions((prev) => {
          // Ensure `prev` is an array
          if (!prev || !prev.length) return prev;
          const updatedDecisions = prev.map((decision) => {
            return {
              ...decision,
              categories: (decision.categories || []).filter(
                (category) => category._id !== id
              ),
            };
          });
          return updatedDecisions;
        });
      }
      if (res.data.status === 401) {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error deleting decision");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    setAuthToken(getToken());
    getDecision();
  }, []);

  return (
    <AdminDashboardLayout>
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spin size="large" />
        </div>
      ) : (
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold mb-4">Decision Library</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginLeft: 8 }}
              onClick={() => navigate(ROUTES.CREATE_DECISION)}
            >
              Create
            </Button>
          </div>

          <div className="px-10">
            {decisions.length > 0 ? (
              decisions.map((v, k) => (
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
                  <div className="flex flex-row items-center gap-3 flex-wrap justify-center">
                    {v.categories.map((x, y) => (
                      <div
                        className="bg-white card-container border-2 border-primary px-3 box-border py-5 w-[24%] flex flex-col items-center gap-3 mb-5 cursor-pointer"
                        key={y}
                        onClick={() =>
                          handleCategoryClick(x.decisions, {
                            image: x.image,
                            title: x.title,
                            _id: x._id,
                          })
                        } // Pass decisions array
                      >
                        <img
                          src={x.image}
                          alt={x.title}
                          className="w-20 h-20"
                        />
                        <span>{x.title}</span>
                        <span className="text-sm">{x.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="mt-2 text-sm text-center">No decisions found.</p>
            )}
          </div>
        </main>
      )}

      <Modal
        title=""
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="delete"
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteDecision(selectedCategory._id)}
            loading={deleteLoading}
          >
            Delete
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() =>
              navigate(
                `${ROUTES.CREATE_DECISION}?decisionId=${selectedCategory._id}`
              )
            }
          >
            Edit
          </Button>,
        ]}
      >
        <div className="flex flex-col items-center gap-3 justify-center my-4">
          <img src={selectedCategory.image} className="h-28 w-28" alt="image" />
          <h2 className="text-primary text-3xl font-bold">
            {selectedCategory.title}
          </h2>
        </div>
        <ul className="list-none p-0 max-h-[40vh] overflow-auto">
          {selectedDecisionsLocal.map((decision, index) => (
            <li key={index} className="flex items-center gap-2 text-primary">
              <CheckCircleFilled className="text-primary" />

              <span>{decision.title}</span>
            </li>
          ))}
        </ul>
      </Modal>
    </AdminDashboardLayout>
  );
};

export default AllDecision;
