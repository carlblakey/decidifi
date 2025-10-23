import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth";
import { Spinner } from "../../components";
import ConfirmOTP from "../../components/model/ConfirmOTP";
import Disclaimer from "../../components/model/Disclaimer";
import PrivacyPolicy from "../../components/model/PrivacyPolicy";
import TermsConditions from "../../components/model/TermsConditions";
import { IMGS, ROUTES } from "../../constants";
import { EMAIL_KEY, OTP_TIMER_KEY } from "../../utilities/localStorageKeys";
import { setItem } from "../../utilities/localStorageMethods";
import ContactUs from "../../components/model/ContactUs";

const DEFAULT_FORM_DATA = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Signup = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);
  const [openDisclaimer, setOpenDisclaimer] = useState(false);
  const [openContactUs, setOpenContactUs] = useState(false);

  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [isModalOpenOTP, setIsModalOpenOTP] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [loading, setLoading] = useState(false);

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
  };

  const validateFields = () => {
    const newErrors = Object.keys(formData).reduce((errors, field) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        errors.email = "Invalid email address";
      }

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

  const handleRegister = async () => {
    if (validateFields()) return;
    try {
      setLoading(true);
      const res = await registerUser(formData);

      if (res.data.status === 200) {
        toast.dismiss();
        toast.success("Account successfully registered");
        setItem(EMAIL_KEY, formData.email);
        setItem(OTP_TIMER_KEY, 180);
        setIsModalOpenOTP(true);
      }

      if (res.data.status === 400) {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        "Registration failed due to an unexpected error. Please retry"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleOnClick = (route) => {
    navigate(route);
  };

  const handleToggleModel = (name) => {
    if (name === "Terms") {
      setIsModalOpen((prev) => !prev);
    }
    if (name === "Privacy") {
      setOpenPrivacyPolicy((prev) => !prev);
      setIsModalOpen(false);
    }
    if (name === "Disclaimer") {
      setOpenDisclaimer((prev) => !prev);
      setIsModalOpen(false);
    }
    if (name === "contact") {
      setOpenContactUs((prev) => !prev);
      setIsModalOpen(false);
      setOpenPrivacyPolicy(false);
    }
  };

  return (
    <>
      <div
        className="bg-no-repeat bg-cover bg-center relative"
        style={{
          backgroundImage: `url('/./assets/images/hero-banner.jpg')`,
        }}
      >
        <div className="absolute bg-gradient-to-b from-black to-gray-800 opacity-75 inset-0 z-0 hidden md:block"></div>
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
        <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
          {/* <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
            <div className="self-start hidden lg:flex flex-col text-white">
              <h1 className="mb-3 font-bold text-5xl">Decidifi</h1>
              <p className="pr-3">
                Sign up to start making informed decisions with confidence. Our
                platform is designed to help you navigate every choice
                seamlessly.
              </p>
            </div>
          </div> */}
          <div className="flex justify-center self-center z-10">
            <div className="p-8 bg-white mx-auto rounded-2xl w-100 shadow-lg">
              <div className="mb-4">
                <h3 className="font-semibold text-2xl text-gray-800">
                  Sign Up
                </h3>
                <p className="text-gray-500">Create your account.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Full Name{" "}
                    <span className="text-red-700 dark:text-red-500">*</span>{" "}
                  </label>
                  <input
                    className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
                      errors.name
                        ? "bg-red-50 border border-red-500"
                        : "border border-gray-300"
                    }`}
                    type="text"
                    placeholder="John Doe"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {/* {errors.name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.name}
                  </p>
                )} */}
                </div>
                <div className="space-y-1">
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
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Password{" "}
                    <span className="text-red-700 dark:text-red-500">*</span>
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
                    Confirm Password{" "}
                    <span className="text-red-700 dark:text-red-500">*</span>
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
                {/* <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Select a subscription plan that suits your needs{" "}
                    <span className="text-red-700 dark:text-red-500">*</span>
                  </label>
                  {sub.map((item, i) => (
                    <div className="flex items-center space-x-3" key={i}>
                      <input
                        type="radio"
                        id="small"
                        name="subscribtion"
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="small" className="text-gray-700">
                        <span className="font-medium">{item.label}</span>
                        <br />
                        <span className="text-sm">{item.label2}</span>
                      </label>
                    </div>
                  ))}
                </div>*/}

                <div className="pt-5 text-gray-600 text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label className="text-gray-600 text-sm">
                    <span>
                      {" "}
                      I agree to Decidifi’s{" "}
                      <Link
                        to=""
                        onClick={() => handleToggleModel("Terms")}
                        className="text-primary hover:text-gray-700"
                      >
                        subscription policies.
                      </Link>
                    </span>
                  </label>
                </div>
                <div>
                  <button
                    onClick={handleRegister}
                    type="button"
                    className="w-full flex justify-center bg-primary hover:bg-gray-700 text-secondary p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                    disabled={loading || !isChecked}
                  >
                    {loading ? <Spinner /> : "Sign Up"}
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

      {/* model */}
      {isModalOpen && (
        <TermsConditions
          isModalOpen={isModalOpen}
          handleToggleModel={handleToggleModel}
          openPrivacyPolicy={openPrivacyPolicy}
          openDisclaimer={openDisclaimer}
        />
      )}
      {openPrivacyPolicy && (
        <PrivacyPolicy
          isModalOpen={openPrivacyPolicy}
          handleCancel={() => handleToggleModel("Privacy")}
          handleToggleModel={handleToggleModel}
        />
      )}
      {openDisclaimer && (
        <Disclaimer
          isModalOpen={openDisclaimer}
          handleCancel={() => handleToggleModel("Disclaimer")}
        />
      )}

      {isModalOpenOTP && (
        <ConfirmOTP
          isModalOpen={isModalOpenOTP}
          handleCancel={() => setIsModalOpenOTP(false)}
          redirect={ROUTES.MANAGE_SUBSCRIPTION}
        />
      )}

      {openContactUs && (
        <ContactUs
          isModalOpen={openContactUs}
          handleCancel={() => setOpenContactUs(false)}
        />
      )}
    </>
  );
};

export default Signup;
