import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { setAuthToken } from "../../api/client";
import { getAllContactUs } from "../../api/contactUs";
import { AdminDashboardLayout } from "../../components";
import { USERS } from "../../config/dummyData";
import useApi from "../../hooks/useApi";
import { getToken } from "../../utilities/localStorageMethods";
import ContactUsTable from "../../components/admin/ContactUsTable";

const ContactUs = () => {
  const [initialData, setInitialData] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(getAllContactUs);

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
      const modifiedData = data.data.map((item) => ({
        ...item,
        key: item._id, // Add key property from _id
      }));

      setInitialData(modifiedData); // Update state with modified data
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
          {USERS.length > 0 && (
            <div className="text-lg text-black font-bold">Contact Us</div>
          )}

          {USERS.length > 0 && <ContactUsTable initialData={initialData} />}
        </main>
      )}
    </AdminDashboardLayout>
  );
};

export default ContactUs;
