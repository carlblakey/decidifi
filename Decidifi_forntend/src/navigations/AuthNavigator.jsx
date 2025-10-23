import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "../constants";
import {
  ForgetPassword,
  Home,
  Login,
  Pricing,
  ResetPassword,
  Signup,
  PrivacyPolicy,
  Disclaimer,
  ManageSubscription,
  ConfirmPayment,
  ExperienceSurvey,
  SubscriptionPlans,
  ScoreCard,
  UnsubscribeEmail,
  PageNotFound,
} from "../pages";

const AuthNavigator = createBrowserRouter([
  {
    path: ROUTES.INDEX,
    element: <Home />,
  },
  {
    path: ROUTES.SIGIN,
    element: <Login />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <Signup />,
  },
  {
    path: ROUTES.FORGET_PASSWORD,
    element: <ForgetPassword />,
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPassword />,
  },
  {
    path: ROUTES.PRICING,
    element: <Pricing />,
  },
  {
    path: ROUTES.PRIVACY_POLICY,
    element: <PrivacyPolicy />,
  },
  {
    path: ROUTES.DISCLAIMER,
    element: <Disclaimer />,
  },
  {
    path: ROUTES.MANAGE_SUBSCRIPTION,
    element: <ManageSubscription />,
  },
  {
    path: ROUTES.SUBSCRIPTION_PLANS,
    element: <SubscriptionPlans />,
  },
  {
    path: ROUTES.CONFIRM_PAYMENT,
    element: <ConfirmPayment />,
  },
  {
    path: ROUTES.SURVEY,
    element: <ExperienceSurvey />,
  },
  {
    path: ROUTES.SCORECARDS,
    element: <ScoreCard />,
  },
  {
    path: ROUTES.UNSUBSCRIBE_EMAILS,
    element: <UnsubscribeEmail />,
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <Navigate to={ROUTES.INDEX} replace />,
  },
]);

export default AuthNavigator;
