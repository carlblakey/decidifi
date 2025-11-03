import { useState, useRef, useEffect } from "react";
import { IMGS, ROUTES } from "../../constants";
import { Link, useNavigate } from "react-router-dom";
import { EMAIL_KEY, OTP_TIMER_KEY } from "../../utilities/localStorageKeys";
import {
  getSingleItem,
  removeItem,
  setItem,
} from "../../utilities/localStorageMethods";
import { confirmOtp, sendotp } from "../../api/auth";
import toast from "react-hot-toast";
import { Spinner } from "../../components";
import useApi from "../../hooks/useApi";
import { Button } from "antd";

const DEFAULT_FORM_DATA = {
  otp1: "",
  otp2: "",
  otp3: "",
  otp4: "",
};

const OtpConfirmation = () => {
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
      toast.error(errorMessage.message);
    }

    if (isSuccess) {
      removeItem(EMAIL_KEY);
      toast.success(data.message);
      navigate(ROUTES.SIGIN);
    }
  }, [error, errorMessage, isSuccess, data]);

  useEffect(() => {
    // Show error toast only once
    if (errorSendotp) {
      toast.error(errorMessageSendotp.message);
    }

    if (isSuccessSendotp) {
      toast.success(sendotpData.message);
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleOnClick = (route) => {
    navigate(route);
  };

  return (
    <div
      className="bg-no-repeat bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/./assets/images/hero-banner.jpg')`,
      }}
    >
      <div className="absolute bg-gradient-to-b from-black to-gray-800 opacity-75 inset-0 z-0"></div>
      <div className="absolute top-8 left-16 hidden md:block">
        <img
          src={IMGS.LOGO}
          alt="logo"
          className="cursor-pointer"
          onClick={() => handleOnClick(ROUTES.INDEX)}
          height={50}
          width={70}
        />
      </div>
      <div className="min-h-screen flex sm:flex-row mx-0 justify-center">
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-2xl w-1/2">
            <div className="mb-4">
              <h3 className="font-semibold text-2xl text-gray-800">
                Verify OTP
              </h3>
              <p className="text-gray-500">
                Enter the OTP sent to your email to confirm your identity.
              </p>
            </div>
            <div className="space-y-5">
              <div className=" flex justify-between">
                {["otp1", "otp2", "otp3", "otp4"].map((otpField, index) => (
                  <div key={index} className="w-1/6">
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
            <div className="pt-5 text-center text-gray-600 text-xs">
              <span>
                Already have an account?{" "}
                <Link
                  to={ROUTES.SIGIN}
                  className="text-primary hover:text-gray-700"
                >
                  Sign In
                </Link>
              </span>
            </div>
            <div className="pt-5 text-center text-gray-600 text-xs">
              <span>
                Copyright © 2024-{new Date().getFullYear()}{" "}
                <Link
                  to={ROUTES.INDEX}
                  className="text-primary hover:text-gray-700"
                >
                  Decidifi
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpConfirmation;
