/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import { getDefaultValUser } from "../utilities/getStatesDefaultValues";
import { DEFAULT_DECISION_MAKERS } from "../config/dummyData";
import {
  getItem,
  getSingleItem,
  getToken,
} from "../utilities/localStorageMethods";
import { BLANK_SCORECARDS_TITLE } from "../utilities/localStorageKeys";

export const AuthContext = createContext();
const token = getToken();
const user = getDefaultValUser();

const blankName = getSingleItem(BLANK_SCORECARDS_TITLE) || "";

export const AuthProvider = ({ children }) => {
  const [scorecardName, setScorecardName] = useState(blankName);
  const [selectedDecision, setSelectedDecision] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(!!user && !!token);
  const [decisionMakers, setDecisionMakers] = useState([]);

  let globalFunctionNdStates = {
    scorecardName,
    decisionMakers,
    isAuthenticated,
    selectedDecision,
    setScorecardName,
    setDecisionMakers,
    setIsAuthenticated,
    setSelectedDecision,
  };

  return (
    <AuthContext.Provider value={globalFunctionNdStates}>
      {children}
    </AuthContext.Provider>
  );
};
