import apiClient from "../client";
import { endPoints } from "../endPoints";

export const createDecision = (data) =>
  apiClient.post(endPoints.CREATE_DECISIONS, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteDecision = (id) =>
  apiClient.delete(`${endPoints.Delete_DECISION}?id=${id}`);

export const updateDecision = ({ id, data }) =>
  apiClient.patch(`${endPoints.UPDATE_DECISION}?id=${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// export const deleteDecision = (id) =>
//   apiClient.delete(`${endPoints.GET_SINGLE_DECISION}?id=${id}`);
