import React, { useEffect, useState } from "react";
import { Footer, Header, Spinner } from "../../components";
import useApi from "../../hooks/useApi";
import { addSurvey } from "../../api/survey";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "../../constants";

const DEFAULT_FORM_DATA = {
  userId: "",
  question1: "",
  question2: "",
  question3: "",
  question4: "",
  question5: "",
};
const ExperienceSurvey = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");

  const { data, isSuccess, error, errorMessage, loading, request, clearError } =
    useApi(addSurvey);

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
      if (field === "userId") {
        return errors;
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

  const handleSubmit = () => {
    if (validateFields()) return;
    request(formData);
  };

  useEffect(() => {
    // Show error toast only once
    if (error) {
      toast.error(errorMessage.message);
    }

    if (isSuccess) {
      toast.success(data.message);
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [error, errorMessage, isSuccess, data]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userId,
    }));

    if (!userId) {
      navigate(ROUTES.INDEX);
    }
  }, [userId]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col px-8">
        <div className="max-w-7xl">
          <div>
            <div
              id="welcome-section"
              className="flex mt-5 p-6 flex-col justify-center items-center"
            >
              <h1 className="text-4xl font-bold py-5 w-fit">
                Decidifi User Experience Survey
              </h1>
            </div>
            <div id="welcome-section" className="mt-5 p-6 w-10/12 mx-auto">
              <p className="text-base">
                We value your feedback! Please take a moment to complete this
                5-question survey to help us improve our decision scorecards and
                enhance your overall experience. For each question, please rate
                your experience on a scale from 0 to 10, where 0 means "very
                dissatisfied" and 10 means "extremely satisfied."
              </p>
              <form className="mt-6">
                <div className="space-y-6">
                  <div>
                    <p className="font-semibold">
                      1. How satisfied are you with the variety of decision
                      scorecards currently available on Decidifi?
                    </p>
                    <input
                      type="number"
                      name="question1"
                      min="0"
                      max="10"
                      step="1"
                      className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
                        errors.question1
                          ? "bg-red-50 border border-red-500"
                          : "border border-gray-400"
                      }`}
                      placeholder="Rate from 0 to 10"
                      value={formData.question1}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">
                      2. How well do Decidifi scorecards help you simplify your
                      decision-making process?
                    </p>
                    <input
                      type="number"
                      name="question2"
                      min="0"
                      max="10"
                      step="1"
                      className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
                        errors.question2
                          ? "bg-red-50 border border-red-500"
                          : "border border-gray-400"
                      }`}
                      placeholder="Rate from 0 to 10"
                      value={formData.question2}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">
                      3. How easy is it to navigate and use the Decidifi
                      platform?
                    </p>
                    <input
                      type="number"
                      name="question3"
                      min="0"
                      max="10"
                      step="1"
                      className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
                        errors.question3
                          ? "bg-red-50 border border-red-500"
                          : "border border-gray-400"
                      }`}
                      placeholder="Rate from 0 to 10"
                      value={formData.question3}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">
                      4. How satisfied are you with the level of customization
                      available when using scorecards (e.g., adding criteria,
                      weighting options)?
                    </p>
                    <input
                      type="number"
                      name="question4"
                      min="0"
                      max="10"
                      step="1"
                      className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
                        errors.question4
                          ? "bg-red-50 border border-red-500"
                          : "border border-gray-400"
                      }`}
                      placeholder="Rate from 0 to 10"
                      value={formData.question4}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">
                      5. How likely are you to recommend Decidifi to a friend or
                      colleague who needs help making important work or life
                      decisions?
                    </p>
                    <input
                      type="number"
                      name="question5"
                      min="0"
                      max="10"
                      step="1"
                      className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-primary transition duration-200 ${
                        errors.question5
                          ? "bg-red-50 border border-red-500"
                          : "border border-gray-400"
                      }`}
                      placeholder="Rate from 0 to 10"
                      value={formData.question5}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="mt-6 flex justify-center bg-primary hover:bg-gray-700 text-secondary py-3 px-5 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? <Spinner /> : "Submit Survey"}
                  </button>
                </div>
              </form>
              <p className="text-base mt-6">
                Thank you for your feedback. Your insights help us continue to
                improve Decidifi and support better decision-making for
                everyone.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExperienceSurvey;
