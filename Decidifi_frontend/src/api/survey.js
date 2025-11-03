import apiClient from "./client";
import { endPoints } from "./endPoints";

export const addSurvey = (data) => apiClient.post(endPoints.ADD_SURVEY, data);
