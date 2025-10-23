import { USER_KEY } from "./localStorageKeys";
import { getItem } from "./localStorageMethods";

const getDefaultValUser = () => {
  return getItem(USER_KEY);
};

export { getDefaultValUser };
