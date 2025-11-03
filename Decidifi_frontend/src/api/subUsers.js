import apiClient from "./client";
import { endPoints } from "./endPoints";

export const createSubUser = (data) =>
  apiClient.post(endPoints.CREATE_SUB_USER, data);

export const getAllSubUsers = () => apiClient.get(endPoints.GET_ALL_SUB_USERS);

export const updateSubUser = (data) =>
  apiClient.put(endPoints.UPDATE_SUB_USER, data);

export const deleteSubUser = (id) =>
  apiClient.delete(`${endPoints.DELETE_SUB_USER}?subUserId=${id}`);
