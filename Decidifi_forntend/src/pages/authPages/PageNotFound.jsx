import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
const PageNotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(ROUTES.INDEX);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[rgb(19,60,104)] text-white text-center p-4">
      <h1 className="text-9xl font-extrabold drop-shadow-lg">404</h1>
      <p className="text-2xl mt-4 font-semibold">
        Oops! The page you're looking for doesn't exist.
      </p>
      <p className="mt-2 text-lg">It might have been moved or deleted.</p>
      <Link
        to="/"
        className="mt-6 px-8 py-3 bg-white text-primary font-bold text-lg rounded-full shadow-lg hover:bg-gray-200 transition duration-300 ease-in-out"
      >
        Go to Home
      </Link>
      <div className="absolute bottom-10 text-sm opacity-75">
        &copy; 2024 Decidifi. All rights reserved.
      </div>
    </div>
  );
};

export default PageNotFound;
