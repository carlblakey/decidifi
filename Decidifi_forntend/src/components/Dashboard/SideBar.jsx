// Sidebar.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";
import useContextHook from "../../hooks/useContextHook";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";

const SideBar = () => {
  const user = getDefaultValUser();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const { isAuthenticated, setIsAuthenticated } = useContextHook();

  const [activeRoute, setActiveRoute] = useState(location.pathname); // Set initial active route

  const handleOnClick = (route) => {
    setActiveRoute(route); // Update active route
    navigate(route); // Navigate to the selected route
  };

  return (
    <nav className="bg-primary text-white w-64 h-full p-5">
      {/* <h2 className="text-2xl font-bold mb-6">Navigation</h2> */}
      <ul>
        {/* <li className="mb-4">
          <button
            onClick={() => handleOnClick(ROUTES.INDEX)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.INDEX
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Decision Stats
          </button>
        </li> */}

        <li className={`${user?.parentUserId && "hidden"} mb-4`}>
          <button
            onClick={() => handleOnClick(ROUTES.INDEX)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.INDEX ||
              activeRoute === ROUTES.SCORECARD ||
              activeRoute === ROUTES.SIMPLIFIED_SCORECARD ||
              activeRoute === ROUTES.DETAILED_SCORECARD
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Scorecard Library
          </button>
        </li>
        <li className={`${user?.parentUserId && "hidden"} mb-4`}>
          <button
            onClick={() => handleOnClick(ROUTES.HOW_TO_USE)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.HOW_TO_USE
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            How Decidifi Works
          </button>
        </li>
        <li className={`${user?.parentUserId && "hidden"} mb-4`}>
          <button
            onClick={() => handleOnClick(ROUTES.MY_SCORECARDS)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.MY_SCORECARDS
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            My Scorecards
          </button>
        </li>
        <li className={`${!user?.parentUserId && "hidden"} mb-4`}>
          <button
            onClick={() => handleOnClick(ROUTES.MY_CONTRIBUTIONS)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.MY_CONTRIBUTIONS
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            My Contributions
          </button>
        </li>
        {/* <li className="mb-4">
          <button
            onClick={() => handleOnClick(ROUTES.PREVIOUS_DECISIONS)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.PREVIOUS_DECISIONS
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Previous Decisions
          </button>
        </li> */}
        <li className={`${user?.parentUserId && "hidden"} mb-4`}>
          <button
            onClick={() => handleOnClick(ROUTES.MANAGE_SUBSCRIPTION)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.MANAGE_SUBSCRIPTION ||
              activeRoute === ROUTES.CONFIRM_PAYMENT
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Manage Subscription
          </button>
        </li>
        <li className={`${user?.parentUserId && "hidden"} mb-4`}>
          <button
            onClick={() => handleOnClick(ROUTES.USERS)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.USERS
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Invite Decision Makers
          </button>
        </li>
        {/* <li className={`${user?.parentUserId && "hidden"} mb-4`}>
          <button
            onClick={() => handleOnClick(ROUTES.PROFILE)}
            className={`w-full text-left py-2 px-3 rounded-md hover:bg-gray-500 ${
              activeRoute === ROUTES.PROFILE
                ? "bg-gray-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Profile
          </button>
        </li> */}
        <li className={`${user?.parentUserId && "hidden"} mb-4`}>
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

export default SideBar;
