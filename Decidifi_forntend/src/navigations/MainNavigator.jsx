import { ROUTES } from "../constants";
import { createBrowserRouter, Navigate } from "react-router-dom";
import HowToUse from "../pages/mainPages/HowToUse";
import Profile from "../pages/mainPages/Profile";
import ManageSubscription from "../pages/mainPages/ManageSubscription";
import {
  ChangePassword,
  Dashboard,
  DetailedScoreCard,
  ExperienceSurvey,
  MakeADecision,
  PageNotFound,
  PreviousDecisions,
  ScoreCard,
  Scorecard,
  SimplifiedScoreCard,
  UnsubscribeEmail,
  Users,
} from "../pages";
import MyScorecards from "../pages/mainPages/MyScorecards";
import ConfirmPayment from "../pages/mainPages/ConfirmPayment";
import { getDefaultValUser } from "../utilities/getStatesDefaultValues";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import HowWorks from "../pages/mainPages/HowWorks";

const MainNavigator = () => {
  const user = getDefaultValUser();
  return createBrowserRouter([
    // {
    //   path: ROUTES.INDEX,
    //   Component: HowToUse,
    // },
    {
      path: ROUTES.INDEX,
      element: (
        <ProtectedRoute
          isAllowed={!user?.parentUserId}
          redirectTo={ROUTES.MY_CONTRIBUTIONS}
        >
          <MakeADecision />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTES.SIMPLIFIED_SCORECARD,
      element: <SimplifiedScoreCard />,
    },
    {
      path: ROUTES.DETAILED_SCORECARD,
      element: <DetailedScoreCard />,
    },
    {
      path: ROUTES.SCORECARDS,
      element: <ScoreCard />,
    },
    {
      path: ROUTES.SCORECARD,
      element: (
        <ProtectedRoute
          isAllowed={!user?.parentUserId}
          redirectTo={ROUTES.MY_CONTRIBUTIONS}
        >
          <Scorecard />,
        </ProtectedRoute>
      ),
    },
    // {
    //   path: ROUTES.PROFILE,
    //   element: (
    //     <ProtectedRoute
    //       isAllowed={!user?.parentUserId}
    //       redirectTo={ROUTES.MY_CONTRIBUTIONS}
    //     >
    //       <Profile />
    //     </ProtectedRoute>
    //   ),
    // },
    {
      path: ROUTES.USERS,
      element: (
        <ProtectedRoute
          isAllowed={!user?.parentUserId}
          redirectTo={ROUTES.MY_CONTRIBUTIONS}
        >
          <Users />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTES.CHANGE_PASSWORD,
      element: (
        <ProtectedRoute
          isAllowed={!user?.parentUserId}
          redirectTo={ROUTES.MY_CONTRIBUTIONS}
        >
          <ChangePassword />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTES.MANAGE_SUBSCRIPTION,
      element: (
        <ProtectedRoute
          isAllowed={!user?.parentUserId}
          redirectTo={ROUTES.MY_CONTRIBUTIONS}
        >
          <ManageSubscription />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTES.MY_SCORECARDS,
      element: (
        <ProtectedRoute
          isAllowed={!user?.parentUserId}
          redirectTo={ROUTES.MY_CONTRIBUTIONS}
        >
          <MyScorecards />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTES.HOW_TO_USE,
      element: (
        <ProtectedRoute
          isAllowed={!user?.parentUserId}
          redirectTo={ROUTES.MY_CONTRIBUTIONS}
        >
          <HowToUse />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTES.MY_CONTRIBUTIONS,
      element: <MyScorecards />,
    },
    {
      path: ROUTES.SURVEY,
      element: <ExperienceSurvey />,
    },
    {
      path: ROUTES.CONFIRM_PAYMENT,
      element: (
        <ProtectedRoute
          isAllowed={!user?.parentUserId}
          redirectTo={ROUTES.MY_CONTRIBUTIONS}
        >
          <ConfirmPayment />
        </ProtectedRoute>
      ),
    },
    {
      path: ROUTES.UNSUBSCRIBE_EMAILS,
      element: <UnsubscribeEmail />,
    },
    {
      path: ROUTES.NOT_FOUND,
      element: <Navigate to={ROUTES.INDEX} replace />,
    },
    // {
    //   path: ROUTES.PREVIOUS_DECISIONS,
    //   element: <PreviousDecisions />,
    // },
  ]);
};

export default MainNavigator;
