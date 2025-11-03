import React, { useEffect, useState } from "react";
import { AdminDashboardLayout } from "../../components";
import UsersTable from "../../components/MakeADecision/UsersTable";
import { USERS } from "../../config/dummyData";
import useApi from "../../hooks/useApi";
import { getAllSubUsers } from "../../api/subUsers";
import { getToken } from "../../utilities/localStorageMethods";
import { setAuthToken } from "../../api/client";
import toast from "react-hot-toast";
import { getAllUsers } from "../../api/user";
import { Spin } from "antd";

const Users = () => {
  const [initialData, setInitialData] = useState([]);
  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(getAllUsers);

  // set user token
  useEffect(() => {
    setAuthToken(getToken());
    request();
  }, []);

  useEffect(() => {
    // Show error toast only once
    if (error) {
      toast.error(errorMessage.message);
      clearError();
    }

    if (isSuccess && data?.data?.length) {
      const modifiedData = data.data.map((item) => {
        const purchasedScorecards = item.purchasedScorecards.filter(
          (scorecard) => scorecard.currentStatus === "active"
        );

        const currentStatus =
          item?.subscription?.planId?.toUpperCase() === "SINGLE_SCORECARD"
            ? purchasedScorecards.length > 0
              ? "active"
              : "cancelled"
            : item.subscription.currentStatus;

        return {
          ...item,
          key: item._id, // Add key property from _id
          subscription: { ...item.subscription, currentStatus },
        };
      });
      setInitialData(modifiedData); // Update state with modified data
    }
  }, [error, errorMessage, isSuccess, data]);

  return (
    <AdminDashboardLayout>
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spin size="large" />
        </div>
      ) : (
        <main className="flex-1 p-6">
          {USERS.length > 0 && (
            <div className="text-lg text-black font-bold">All Users</div>
          )}

          {USERS.length > 0 && (
            <UsersTable
              initialData={initialData}
              title="Add User"
              role="admin"
            />
          )}
        </main>
      )}
    </AdminDashboardLayout>
  );
};

export default Users;
