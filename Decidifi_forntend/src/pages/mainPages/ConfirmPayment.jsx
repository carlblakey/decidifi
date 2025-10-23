import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmPayment } from "../../api/payment";
import { DashboardLayout, Spinner } from "../../components";
import useApi from "../../hooks/useApi";

import { Typography } from "antd";
import toast from "react-hot-toast";
import { ROUTES } from "../../constants";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";
import { SUBSCRIPTION_PLAN, USER_KEY } from "../../utilities/localStorageKeys";
import {
  getItem,
  removeItem,
  setObjectInLocalStorage,
} from "../../utilities/localStorageMethods";
const { Text } = Typography;
const ConfirmPayment = () => {
  const user = getDefaultValUser();
  const plan = getItem(SUBSCRIPTION_PLAN);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const session_id = searchParams.get("session_id");

  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(confirmPayment);

  const handlePaymentConfirm = () => {
    request({ session_id, email: user.email });
  };

  useEffect(() => {
    // Show error toast only once
    if (error) {
      toast.dismiss();
      toast.error(
        "We couldn't activate your subscription. Please verify your payment details and try again"
      );
      clearError();
    }
    const currentStatus =
      plan.id.toUpperCase() === "UNLIMITED" ? "active" : "cancelled";

    const purchasedScorecards =
      plan.id.toUpperCase() === "SINGLE_SCORECARD"
        ? plan.purchasedScorecards
        : [];

    if (isSuccess) {
      setObjectInLocalStorage(USER_KEY, {
        ...user,
        subscription: plan.id.toLowerCase(),
        purchasedScorecards: purchasedScorecards,
        currentStatus,
      });
      toast.dismiss();
      toast.success("Payment processed successfully and subscription assigned");
      removeItem(SUBSCRIPTION_PLAN);
      navigate(ROUTES.MANAGE_SUBSCRIPTION);
    }
  }, [error, errorMessage, isSuccess, data]);

  useEffect(() => {
    if (session_id) {
      handlePaymentConfirm();
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Subscription</h2>

        <Text
          type="secondary"
          style={{ textAlign: "left", display: "block" }}
          className="mb-4"
        >
          Select a subscription plan that suits your needs:
        </Text>

        <main className="flex-grow flex flex-col px-8">
          <div className="max-w-7xl mx-auto">
            <div>
              <div
                id="welcome-section"
                className="flex mt-5 p-6 flex-col justify-center items-center"
              >
                <h1 className="text-4xl font-bold py-5 w-fit">
                  Payment Completed
                </h1>
                <p className="text-lg text-gray-600">
                  Thank you for your purchase! Your subscription is now active.
                </p>
              </div>
              <div className="mt-5 p-6 w-10/12 mx-auto">
                <h2 className="text-2xl font-semibold mb-4">
                  Subscription Details
                </h2>
                <div className="border border-gray-200 rounded-lg shadow-lg p-6 bg-white">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-500 flex items-center justify-center rounded-full mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 10h11M9 21V3m7 7 4-4m-4 4 4 4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Plan: {plan?.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-lg">
                    <strong>Price:</strong> ${plan?.price}
                  </p>
                  <p className="text-gray-600 text-lg">
                    <strong>Duration:</strong> 1 Year
                  </p>
                  <div className="mt-4">
                    {/* <button
                      onClick={handlePaymentConfirm}
                      className="w-full flex justify-center bg-primary hover:bg-gray-700 text-secondary p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                      disabled={loading}
                    >
                      {loading ? <Spinner /> : "Go to Dashboard"}
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default ConfirmPayment;
