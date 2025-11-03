import apiClient from "./client";
import { endPoints } from "./endPoints";

export const getAllPreviousDecisions = () =>
  apiClient.get(endPoints.GET_ALL_PREVIOUS_DECISIONS);

export const getPreviousDecisionById = (id) =>
  apiClient.get(endPoints.GET_PREVIOUS_DECISION, {id});

export const savePreviousDecision = (body) =>
  apiClient.post(endPoints.SAVE_PREVIOUS_DECISIONS, body);