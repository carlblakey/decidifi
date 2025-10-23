import apiClient from "./client";
import { endPoints } from "./endPoints";

// with token
export const allDecisionLibrary = () =>
  apiClient.get(endPoints.GET_ALL_LIBRARIES);

// without token
export const allLibrary = () => apiClient.get(endPoints.ALL_LIBRARIES);
