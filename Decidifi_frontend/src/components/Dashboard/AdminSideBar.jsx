// Sidebar.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";

const AdminSideBar = () => {
  const user = getDefaultValUser();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const [activeRoute, setActiveRoute] = useState(location.pathname); // Set initial active route

  const handleOnClick = (route) => {
    setActiveRoute(route); // Update active route
    navigate(route); // Navigate to the selected route
  };

  return (
    <nav className="bg-primary text-white w-64 h-full p-5">
      <ul>
        {/* <li className="mb-4">
          <button
            onClick={() => handleOnClick(ROUTES.INDEX)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.INDEX ||
              activeRoute === ROUTES.SCORECARD_CREATE
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            My Scorecards
          </button>
        </li> */}

        {/* <li className="mb-4">
          <button
            onClick={() => handleOnClick(ROUTES.DECISIONS)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.DECISIONS ||
              activeRoute === ROUTES.CREATE_DECISION
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Decision Library
          </button>
        </li> */}

        <li className="mb-4">
          <button
            onClick={() => handleOnClick(ROUTES.INDEX)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.INDEX
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Users
          </button>
        </li>

        <li className="mb-4">
          <button
            onClick={() => handleOnClick(ROUTES.CONTACT_US)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.CONTACT_US
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Contact Us
          </button>
        </li>

        <li className="mb-4">
          <button
            onClick={() => handleOnClick(ROUTES.EMAIL_TEMPLATES)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.EMAIL_TEMPLATES
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Email Templates
          </button>
        </li>
        <li className="mb-4">
          <button
            onClick={() => handleOnClick(ROUTES.SNED_EMAIL)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.SNED_EMAIL
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Scorecard Email Manager
          </button>
        </li>

        <li className="mb-4">
          <button
            onClick={() => handleOnClick(ROUTES.CHANGE_PASSWORD)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.CHANGE_PASSWORD
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Change Password
          </button>
        </li>

        {/* Add more links as needed */}
      </ul>
    </nav>
  );
};

export default AdminSideBar;
