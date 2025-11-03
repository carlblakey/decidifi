import { ConfigProvider } from "antd";
import React from "react";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import useContextHook from "./hooks/useContextHook";
// this routes for logout user
import AuthNavigator from "./navigations/AuthNavigator";
// route for normal login user
import MainNavigator from "./navigations/MainNavigator";
// route for admin
import AdminNavigator from "./navigations/AdminNavigator";
import { getDefaultValUser } from "./utilities/getStatesDefaultValues";

function App() {
  const { isAuthenticated } = useContextHook();

  const user = getDefaultValUser();
  const role = user?.userType || "guest";

  // Role-based navigation logic
  let router;
  if (!isAuthenticated) {
    router = AuthNavigator;
  } else if (role === "Admin") {
    router = AdminNavigator;
  } else {
    router = MainNavigator();
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#133C68",
          fontFamily: "Nunito Sans",
        },
      }}
    >
      <div className="App">
        <RouterProvider router={router} />
        <Toaster
          toastOptions={{
            duration: 10000,
          }}
        />
      </div>
    </ConfigProvider>
  );
}

export default App;
