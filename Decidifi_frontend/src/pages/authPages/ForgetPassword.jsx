import { useEffect, useState } from "react";
import { IMGS, ROUTES } from "../../constants";
import useContextHook from "../../hooks/useContextHook";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import toast from "react-hot-toast";
import { EMAIL_KEY, OTP_TIMER_KEY } from "../../utilities/localStorageKeys";
import { resetpasswordotp } from "../../api/auth";
import { Spinner } from "../../components";
import { setItem } from "../../utilities/localStorageMethods";

const DEFAULT_FORM_DATA = {
  email: "",
};

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(resetpasswordotp);

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

    if (error) {
      clearError();
    }
  };

  const validateFields = () => {
    const newErrors = Object.keys(formData).reduce((errors, field) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        errors.email = "Invalid email address";
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

  const handleSendOtp = () => {
    if (validateFields()) return;
    request(formData);
  };

  useEffect(() => {
    if (error) {
      toast.error(errorMessage.message);
    }

    if (isSuccess) {
      setItem(EMAIL_KEY, formData.email);
      toast.success(data.message);
      setItem(OTP_TIMER_KEY, 180);
      navigate(ROUTES.RESET_PASSWORD);
    }
  }, [error, errorMessage, isSuccess, data]);

  const handleOnClick = (route) => {
    navigate(route);
  };

  return (
    <div
      className="bg-no-repeat bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/./assets/images/hero-banner.jpg')`,
        // backgroundImage: `url(https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1951&q=80)`,
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
          <div className="p-12 bg-white mx-auto rounded-2xl w-100">
            <div className="mb-4">
              <h3 className="font-semibold text-2xl text-gray-800">
                Forgot Your Password
              </h3>
              <p className="text-gray-500">
                Enter your email to receive an OTP and reset your password.
              </p>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  Email{" "}
                  <span className="text-red-700 dark:text-red-500">*</span>
                </label>
                <input
                  className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
                    errors.email
                      ? "bg-red-50 border border-red-500"
                      : "border border-gray-300"
                  }`}
                  type="email"
                  placeholder="mail@gmail.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full flex justify-center bg-primary hover:bg-gray-700 text-secondary p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                  disabled={loading}
                >
                  {loading ? <Spinner /> : "Send OTP"}
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

export default ForgetPassword;
