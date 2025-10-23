import apiClient from "./client";
import { endPoints } from "./endPoints";

export const createContactUs = (data) =>
  apiClient.post(endPoints.CREATE_CONTACT_US, data);

export const getAllContactUs = () =>
  apiClient.get(endPoints.GET_ALL_CONTACT_US);

export const updateContactUs = (data) =>
  apiClient.put(endPoints.UPDATE_SUB_USER, data);

export const deleteContactUs = (id) =>
  apiClient.delete(`${endPoints.DELETE_CONTACT_US}?id=${id}`);
