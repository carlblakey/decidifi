import { useState } from "react";

const useApi = (apiFunc) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoading] = useState(false);

  const request = async (...args) => {
    setLoading(true);
    const response = await apiFunc(...args);
    setLoading(false);

    if (!response.ok) {
      setError(true);
      setErrorMessage(response.data || "Something went wrong!");
      return;
    }

    setError(false);
    setErrorMessage({});
    setData(response.data);
    setIsSuccess(true);
  };

  // Function to clear error after showing the toast
  const clearError = () => {
    setError(false);
    setErrorMessage({}); // Reset the error toast tracking
  };

  return {
    data,
    isSuccess,
    error,
    errorMessage,
    loading,
    request,
    clearError,
  };
};

export default useApi;
