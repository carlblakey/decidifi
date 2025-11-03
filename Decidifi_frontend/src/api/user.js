import apiClient from "./client";
import { endPoints } from "./endPoints";

export const getEmailSubscription = (id) =>
  apiClient.get(`${endPoints.GET_EMAIL_SUBSCRIPTION}?id=${id}`);

export const updateEmailSubscription = (id) =>
  apiClient.put(`${endPoints.UPDATE_EMAIL_SUBSCRIPTION}?id=${id}`);

// Admin - User Management
export const getAllUsers = () => apiClient.get(endPoints.GET_ADMIN_USERS);
export const updateUsers = ({ id, data }) =>
  apiClient.put(`${endPoints.UPDATE_ADMIN_USERS}?id=${id}`, data);

export const deleteUser = (id) =>
  apiClient.delete(`${endPoints.DELETE_ADMIN_USER}?id=${id}`);
