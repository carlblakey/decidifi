import Cookies from "js-cookie";
import { TOKEN_KEY } from "./localStorageKeys";

const setItem = (key, value) => {
  localStorage.setItem(key, value);
};

const setObjectInLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key) => {
  let val = localStorage.getItem(key);
  let parsedVal = val ? JSON.parse(val) : null;
  return parsedVal;
};

const getSingleItem = (key) => {
  return localStorage.getItem(key);
};

const removeItem = (key) => {
  localStorage.removeItem(key);
};

const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: 1 });
};
const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export {
  setItem,
  getItem,
  getSingleItem,
  setObjectInLocalStorage,
  removeItem,
  setToken,
  getToken,
  removeToken,
};
