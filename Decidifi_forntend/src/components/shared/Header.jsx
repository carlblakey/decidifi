// Header.js
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // Import the user icon from react-icons
import { Link, useNavigate } from "react-router-dom";
import { IMGS, ROUTES } from "../../constants";
import useContextHook from "../../hooks/useContextHook";
import { getDefaultValUser } from "../../utilities/getStatesDefaultValues";
import { USER_KEY } from "../../utilities/localStorageKeys";
import { removeItem, removeToken } from "../../utilities/localStorageMethods";

const Header = ({ isLoggedIn }) => {
  const user = getDefaultValUser();

  const navigate = useNavigate();
  const { setIsAuthenticated, isAuthenticated } = useContextHook();
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State for controlling dropdown visibility

  const handleOnClick = (route) => {
    navigate(route);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const handleLogout = () => {
    removeToken();
    removeItem(USER_KEY);
    setIsAuthenticated(false);
    handleOnClick(ROUTES.INDEX);
  };

  return (
    <header className="bg-white z-50 sticky text-black py-4 px-8 border-b border-blue-50 shadow-md flex flex-row justify-between items-center">
      <img
        src={IMGS.LOGO}
        alt="logo"
        className="cursor-pointer"
        onClick={() => handleOnClick(ROUTES.INDEX)}
        height={50}
        width={50}
      />

      <div className="relative flex items-center">
        {isAuthenticated ? (
          <>
            <div
              className="flex items-center cursor-pointer"
              onClick={toggleDropdown}
            >
              <FaUserCircle className="text-3xl text-gray-600" />
              <span className="ml-2 text-lg font-semibold">{user?.name}</span>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-32 w-48 bg-white shadow-lg rounded-md z-10">
                <ul className="py-2">
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => handleOnClick(ROUTES.SIGIN)}
              className="px-4 py-2"
            >
              Login
            </button>
            <button
              onClick={() => handleOnClick(ROUTES.SIGNUP)}
              className="bg-primary text-white px-4 py-2 rounded-md ml-2"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
