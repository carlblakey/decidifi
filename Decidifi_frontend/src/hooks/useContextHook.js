/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useContextHook = () => {
  const context = useContext(AuthContext);

  return context;
};

export default useContextHook;
