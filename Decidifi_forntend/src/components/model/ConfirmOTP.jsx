import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { Button, Modal } from "antd";
import { confirmOtp, sendotp } from "../../api/auth";
import useApi from "../../hooks/useApi";
import {
  getSingleItem,
  removeItem,
  setItem,
  setObjectInLocalStorage,
  setToken,
} from "../../utilities/localStorageMethods";
import {
  EMAIL_KEY,
  OTP_TIMER_KEY,
  USER_KEY,
} from "../../utilities/localStorageKeys";
import { ROUTES } from "../../constants";
import { Spinner } from "..";

const DEFAULT_FORM_DATA = {
  otp1: "",
  otp2: "",
  otp3: "",
  otp4: "",
};

const ConfirmOTP = ({ isModalOpen, handleCancel, redirect = null }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [email, setEmail] = useState("");

  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(confirmOtp);

  const {
    data: sendotpData,
    isSuccess: isSuccessSendotp,
    error: errorSendotp,
    errorMessage: errorMessageSendotp,
    loading: loadingSendotp,
    request: requestSendotp,
    clearError: clearErrorSendotp,
  } = useApi(sendotp);

  const otpInputs = useRef([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: !value ? true : false,
    }));

    // Clear error on input change
    if (errorSendotp) {
      clearErrorSendotp();
    }
    if (error) {
      clearError();
    }

    // Move to the next input if the current input is filled
    if (value && name !== "otp4") {
      const nextInput =
        otpInputs.current[Object.keys(formData).indexOf(name) + 1];
      nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && formData[`otp${index + 1}`] === "") {
      // Focus previous input if backspace is pressed and the current input is empty
      if (index > 0) {
        const prevInput = otpInputs.current[index - 1];
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e) => {
    // Prevent the default paste action
    e.preventDefault();

    // Get the pasted text
    const pastedText = e.clipboardData.getData("Text");

    // Distribute the pasted text into the OTP fields
    const otpValues = pastedText.split("").slice(0, 4);

    // Update the state for each OTP input
    setFormData((prev) => ({
      otp1: otpValues[0] || "",
      otp2: otpValues[1] || "",
      otp3: otpValues[2] || "",
      otp4: otpValues[3] || "",
    }));

    // Focus the next available field after pasting
    if (otpValues.length > 0) otpInputs.current[1].focus();
    if (otpValues.length > 1) otpInputs.current[2].focus();
    if (otpValues.length > 2) otpInputs.current[3].focus();

    otpValues.map((_, i) =>
      setErrors((prev) => ({
        ...prev,
        [`otp${i + 1}`]: false,
      }))
    );
  };

  const validateFields = () => {
    const newErrors = Object.keys(formData).reduce((errors, field) => {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && !formData[field].trim())
      ) {
        errors[field] = true;
      }
      return errors;
    }, {});

    setErrors(newErrors);
    return Object.keys(newErrors).length !== 0;
  };
  const handleSubmit = () => {
    if (validateFields()) return;
    const otp = `${formData.otp1}${formData.otp2}${formData.otp3}${formData.otp4}`;

    request({
      email,
      otp,
    });
  };

  const handleSendOTP = () => {
    requestSendotp({ email });
  };

  useEffect(() => {
    // Show error toast only once
    if (error) {
      toast.dismiss();
      toast.error(errorMessage.message);
    }

    if (isSuccess) {
      redirect && navigate(redirect);
      toast.dismiss();
      toast.success("Email verified");
      setTimeLeft(0);
      handleCancel();
      setObjectInLocalStorage(USER_KEY, { ...data.data, token: data.token });
    }
  }, [error, errorMessage, isSuccess, data]);

  useEffect(() => {
    // Show error toast only once
    if (errorSendotp) {
      toast.error(errorMessageSendotp.message);
    }

    if (isSuccessSendotp) {
      toast.dismiss();
      toast.success("OTP sent to your email");
      setTimeLeft(180);
    }
  }, [errorSendotp, errorMessageSendotp, isSuccessSendotp, sendotpData]);

  useEffect(() => {
    setEmail(getSingleItem(EMAIL_KEY));
  }, []);

  useEffect(() => {
    const savedTime = getSingleItem(OTP_TIMER_KEY);
    if (savedTime) {
      setTimeLeft(parseInt(savedTime));
    }
    return () => {
      removeItem(OTP_TIMER_KEY);
    };
  }, []);

  // timer
  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        setItem(OTP_TIMER_KEY, newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);
  // format time
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Modal
      title="Verify OTP"
      open={isModalOpen}
      onOk={handleCancel}
      onCancel={handleCancel}
      //   width={"60%"}
      footer={false}
      maskClosable={false}
      //   style={{ top: 20 }} // Position the modal closer to the top
      //   styles={{
      //     body: {
      //       maxHeight: "640px", // Set a max height for the modal content
      //       overflowY: "auto", // Enable vertical scrolling
      //     },
      //   }}
    >
      <div className="flex justify-center self-center z-10">
        <div className="p-12 bg-white mx-auto rounded-2xl ">
          <div className="mb-4">
            <p className="text-gray-500">
              Enter the OTP sent to your email to confirm your identity.
            </p>
          </div>
          <div className="space-y-5">
            <div className=" flex justify-between">
              {["otp1", "otp2", "otp3", "otp4"].map((otpField, index) => (
                <div key={index} className="w-1/5">
                  {/* <label className="text-sm font-medium text-gray-700 tracking-wide">
                      OTP {index + 1}
                    </label> */}
                  <input
                    ref={(el) => (otpInputs.current[index] = el)} // Storing references
                    className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
                      errors[otpField]
                        ? "bg-red-50 border border-red-500"
                        : "border border-gray-300"
                    }`}
                    type="text"
                    maxLength="1"
                    name={otpField}
                    value={formData[otpField]}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace
                    onPaste={handlePaste} // Handle paste event
                  />
                </div>
              ))}
            </div>
            <div className="space-y-5">
              <div className="form-group text-center">
                <span className="or">
                  {timeLeft > 0 ? (
                    formatTime(timeLeft)
                  ) : (
                    <Button
                      sx={{ padding: "0" }}
                      onClick={handleSendOTP}
                      disabled={loadingSendotp}
                    >
                      {loadingSendotp ? (
                        <Spinner color="black" />
                      ) : (
                        "Resend OTP"
                      )}
                    </Button>
                  )}
                </span>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full flex justify-center bg-primary hover:bg-gray-700 text-secondary p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                disabled={loading}
              >
                {loading ? <Spinner /> : " Verify OTP"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmOTP;
