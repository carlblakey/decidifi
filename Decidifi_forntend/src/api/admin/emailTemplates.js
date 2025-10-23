import apiClient from "../client";
import { endPoints } from "../endPoints";

export const createEmailTemplate = (data) =>
  apiClient.post(endPoints.CREATE_EMIAL_TEMPLATE, data);

export const getEmailTemplate = (id) =>
  apiClient.get(endPoints.GET_EMIAL_TEMPLATES);

export const getEmailTemplateById = (id) =>
  apiClient.get(`${endPoints.GET_BY_ID_EMIAL_TEMPLATE}?id=${id}`);

export const updateEmailTemplate = ({ id, data }) =>
  apiClient.patch(`${endPoints.UPDATE_EMIAL_TEMPLATE}?id=${id}`, data);

export const deleteEmailTemplate = (id) =>
  apiClient.delete(`${endPoints.DELETE_EMIAL_TEMPLATE}?id=${id}`);
