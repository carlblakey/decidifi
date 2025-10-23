import { useEffect, useState } from "react";
import { IMGS, ROUTES } from "../../constants";
import useContextHook from "../../hooks/useContextHook";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import useApi from "../../hooks/useApi";
import { loginUser } from "../../api/auth";
import { Spinner } from "../../components";
import {
  EMAIL_KEY,
  OTP_TIMER_KEY,
  SCORECARDS_ID_TYPE,
  USER_KEY,
} from "../../utilities/localStorageKeys";
import {
  setItem,
  setObjectInLocalStorage,
  setToken,
} from "../../utilities/localStorageMethods";
import ConfirmOTP from "../../components/model/ConfirmOTP";

const DEFAULT_FORM_DATA = {
  email: "",
  password: "",
};

const Login = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const location = useLocation();
  const subscriptionPage = location.state?.subscriptionPage || "";

  const navigate = useNavigate();
  const [isModalOpenOTP, setIsModalOpenOTP] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const { isAuthenticated, setIsAuthenticated } = useContextHook();

  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(loginUser);

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

  const handleClickLogin = () => {
    if (validateFields()) return;
    request(formData);
  };

  useEffect(() => {
    // Show error toast only once
    if (error) {
      toast.dismiss();
      console.log(errorMessage);
      if (errorMessage.status === 401) {
        setItem(EMAIL_KEY, formData.email);
        setItem(OTP_TIMER_KEY, 180);
        setIsModalOpenOTP(true);
        toast.success("OTP sent to your email");
      } else {
        toast.error(errorMessage.message || errorMessage);
      }
    }

    if (isSuccess) {
      toast.dismiss();
      toast.success("Login successful");
      setIsAuthenticated(true);
      let currentStatus = "";

      if (subscriptionPage !== "yes") {
        currentStatus =
          data?.data?.subscription?.toUpperCase() === "SINGLE_SCORECARD"
            ? "cancelled"
            : data?.data?.currentStatus;
      }

      setObjectInLocalStorage(USER_KEY, {
        ...data.data,
        currentStatus,
        token: data.token,
      });
      setToken(data.token);

      if (id && type) {
        setObjectInLocalStorage(SCORECARDS_ID_TYPE, { id, type });
      }

      if (subscriptionPage === "yes") {
        navigate(ROUTES.MANAGE_SUBSCRIPTION);
      } else {
        navigate(ROUTES.INDEX);
      }
    }
  }, [error, errorMessage, isSuccess, data, id, type]);

  const handleOnClick = (route) => {
    navigate(route);
  };

  return (
    <>
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
            width={50}
          />
        </div>
        <div className="min-h-screen flex sm:flex-row mx-0 justify-center">
          {/* <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
            <div className="self-start hidden lg:flex flex-col text-white">
              <h1 className="mb-3 font-bold text-5xl">
                Hi? Welcome Back to Decidifi
              </h1>
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
                  Sign In
                </h3>
                <p className="text-gray-500">Please sign in to your account.</p>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Email
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
                    <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
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
                    onChange={handleChange}
                    value={formData.password}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link
                      to={ROUTES.FORGET_PASSWORD}
                      className="text-primary hover:text-gray-700"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleClickLogin}
                    className="w-full flex justify-center bg-primary hover:bg-gray-700 text-secondary p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                    disabled={loading}
                  >
                    {loading ? <Spinner /> : "Sign in"}
                  </button>
                </div>
              </div>
              <div className="pt-5 text-center text-gray-600 text-xs">
                <span>
                  Don't have an account?{" "}
                  <Link
                    to={ROUTES.SIGNUP}
                    className="text-primary hover:text-gray-700"
                  >
                    Sign up now!
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

      {isModalOpenOTP && (
        <ConfirmOTP
          isModalOpen={isModalOpenOTP}
          handleCancel={() => setIsModalOpenOTP(false)}
          redirect={ROUTES.MANAGE_SUBSCRIPTION}
        />
      )}
    </>
  );
};

export default Login;
