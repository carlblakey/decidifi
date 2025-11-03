import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "../constants";
import {
  AdminChangePassword,
  AllDecision,
  AllUsers,
  ContactUs,
  CreateDecision,
  CreateScorecard,
  MyScorecards,
  PageNotFound,
} from "../pages";
import SendEmail from "../pages/adminPage/SendEmail";
import EmailTemplates from "../pages/adminPage/templates/EmailTemplates";
import AddEmailTemplate from "../pages/adminPage/templates/AddEmailTemplate";

const AdminNavigator = createBrowserRouter([
  {
    path: ROUTES.INDEX,
    Component: MyScorecards,
  },
  {
    path: ROUTES.DECISIONS,
    Component: AllDecision,
  },
  {
    path: ROUTES.CREATE_DECISION,
    Component: CreateDecision,
  },
  {
    path: ROUTES.SCORECARD_CREATE,
    Component: CreateScorecard,
  },
  {
    path: ROUTES.ADMIN_USERS,
    Component: AllUsers,
  },
  {
    path: ROUTES.CHANGE_PASSWORD,
    Component: AdminChangePassword,
  },
  {
    path: ROUTES.CONTACT_US,
    Component: ContactUs,
  },
  {
    path: ROUTES.SNED_EMAIL,
    Component: SendEmail,
  },
  {
    path: ROUTES.EMAIL_TEMPLATES,
    Component: EmailTemplates,
  },
  {
    path: ROUTES.EMAIL_TEMPLATES_ADD,
    Component: AddEmailTemplate,
  },
  {
    path: `${ROUTES.EMAIL_TEMPLATES_EDIT}/:id`,
    Component: AddEmailTemplate,
  },
  {
    path: ROUTES.NOT_FOUND,
    Component: <Navigate to={ROUTES.INDEX} replace />,
  },
]);

export default AdminNavigator;
