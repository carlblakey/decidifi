import { useEffect, useState } from "react";
import { IMGS, ROUTES } from "../../constants";
import { resetpassword, resetpasswordotp } from "../../api/auth";
import useApi from "../../hooks/useApi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Spinner } from "../../components";
import {
  getSingleItem,
  removeItem,
  setItem,
} from "../../utilities/localStorageMethods";
import { EMAIL_KEY, OTP_TIMER_KEY } from "../../utilities/localStorageKeys";
import { Button } from "antd";

const DEFAULT_FORM_DATA = {
  email: "",
  otp: "",
  password: "",
  confirmPassword: "",
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(resetpassword);

  const {
    data: otpdata,
    isSuccess: isSuccessOtpdata,
    error: errorOtpdata,
    errorMessage: errorMessageOtpdata,
    loading: loadingOtpdata,
    request: requestOtpdata,
    clearError: clearErrorOtpdata,
  } = useApi(resetpasswordotp);

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
    if (error) {
      clearError();
    }
    if (errorOtpdata) {
      clearErrorOtpdata();
    }
  };

  const validateFields = () => {
    const newErrors = Object.keys(formData).reduce((errors, field) => {
      if (formData.password && formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters long"; // Check for password length
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match"; // Adjusted error message
      }
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

  const handleRegister = () => {
    if (validateFields()) return;
    request(formData);
  };

  const handleSendOTP = () => {
    requestOtpdata({ email: formData.email });
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
    if (errorOtpdata) {
      toast.error(errorMessageOtpdata.message);
    }
    if (isSuccessOtpdata) {
      toast.success(otpdata.message);
      setTimeLeft(180);
    }
  }, [error, errorMessageOtpdata, isSuccessOtpdata, otpdata]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: getSingleItem(EMAIL_KEY),
    }));
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
      <div className="absolute top-8 left-16">
        <img
          src={IMGS.LOGO}
          alt="logo"
          className="cursor-pointer"
          onClick={() => handleOnClick(ROUTES.INDEX)}
          height={50}
          width={50}
        />
      </div>
      <div className="min-h-screen flex sm:flex-row mx-0 justify-center">
        {/* <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
          <div className="self-start hidden lg:flex flex-col text-white">
            <h1 className="mb-3 font-bold text-5xl">Decidifi</h1>
            <p className="pr-3">
              Make informed decisions effortlessly. Our platform guides you
              through every choice, ensuring you feel confident in your
              selections. Let's streamline your decision-making process
              together!
            </p>
          </div>
        </div> */}
        <div className="flex justify-center self-center z-10">
          <div className="p-8 bg-white mx-auto rounded-2xl w-100 shadow-lg">
            <div className="mb-4">
              <h3 className="font-semibold text-2xl text-gray-800">
                Change Password
              </h3>
              <p className="text-gray-500">Reset your Password.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  Password
                </label>
                <input
                  className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
                    errors.password
                      ? "bg-red-50 border border-red-500"
                      : "border border-gray-300"
                  }`}
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  Confirm Password
                </label>
                <input
                  className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
                    errors.confirmPassword
                      ? "bg-red-50 border border-red-500"
                      : "border border-gray-300"
                  }`}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  OTP
                </label>
                <input
                  className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
                    errors.otp
                      ? "bg-red-50 border border-red-500"
                      : "border border-gray-300"
                  }`}
                  type="text"
                  name="otp"
                  placeholder="Enter your OTP"
                  value={formData.otp}
                  onChange={handleChange}
                />
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
                        disabled={loadingOtpdata}
                      >
                        {loadingOtpdata ? (
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
                  onClick={handleRegister}
                  type="button"
                  className="w-full flex justify-center bg-primary hover:bg-gray-700 text-secondary p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                  disabled={loading}
                >
                  {loading ? <Spinner /> : "Reset Password"}
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

export default ResetPassword;
