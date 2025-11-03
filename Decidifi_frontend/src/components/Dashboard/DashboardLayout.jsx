// Dashboard.js
import React, { useEffect } from "react";
import { Header, SideBar } from "..";
import useContextHook from "../../hooks/useContextHook";
import { useSearchParams } from "react-router-dom";
import { removeItem } from "../../utilities/localStorageMethods";
import { BLANK_SCORECARDS_TITLE } from "../../utilities/localStorageKeys";

const DashboardLayout = ({ children }) => {
  const { setScorecardName } = useContextHook();
  const [searchParams] = useSearchParams();
  const isBlank = searchParams.get("isblank");

  useEffect(() => {
    if (isBlank === "false") {
      removeItem(BLANK_SCORECARDS_TITLE);
      setScorecardName("");
    }
  }, [isBlank]);
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <SideBar />
        <div className="flex-1 overflow-y-auto bg-gray-100">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
