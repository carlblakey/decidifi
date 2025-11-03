import apiClient from "./client";
import { endPoints } from "./endPoints";

export const createScoreCard = (data) =>
  apiClient.post(endPoints.CREATE_SCORECARD, data);

export const getAllScoreCard = () => apiClient.get(endPoints.GET_ALL_SCORECARD);

export const getCompleteScoreById = ({ id }) =>
  apiClient.get(`${endPoints.COMPLETE_SCORECARD_BY_ID}?id=${id}`);
export const getScoreById = ({ id, scorecardType }) =>
  apiClient.get(
    `${endPoints.SCORECARD_BY_ID}?id=${id}&scorecardType=${scorecardType}`
  );
export const updateScoreCard = ({ id, data }) =>
  apiClient.patch(`${endPoints.UPDATE_SCORECARD}?id=${id}`, data);

export const deleteScoreCard = (id) =>
  apiClient.delete(`${endPoints.DELETE_SCORECARD}?id=${id}`);

// for blank scorescrad
export const createBlankScoreCard = (data) =>
  apiClient.post(endPoints.CREATE_BLANK_SCORECARD, data);

export const getAllBlankScoreCard = () =>
  apiClient.get(endPoints.GET_ALL_BLANK_SCORECARD);

export const deleteBlankScoreCard = (id) =>
  apiClient.delete(`${endPoints.DELETE_BLANK_SCORECARD}?id=${id}`);

export const updateBlankScoreCard = ({ id, data }) =>
  apiClient.patch(`${endPoints.UPDATE_BLANK_SCORECARD}?id=${id}`, data);

export const SendScoreCardEmail = (data) =>
  apiClient.post(endPoints.SEND_SCORECARD_EMAIL, data);
