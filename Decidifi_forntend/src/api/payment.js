import apiClient from "./client";
import { endPoints } from "./endPoints";

export const payment = (data) => apiClient.post(endPoints.CHECKOUT, data);
export const cancelSubscription = (data) =>
  apiClient.post(endPoints.CANCEL_SUBSCRIPTION, data);

export const cancelSingleSubscription = (data) =>
  apiClient.post(endPoints.CANCEL_SINGLE_SUBSCRIPTION, data);
export const confirmPayment = ({ session_id }) =>
  apiClient.post(`${endPoints.PAYMENT_COMPLETE}?session_id=${session_id}`);

export const activateFreeTrial = ({ email }) =>
  apiClient.patch(`${endPoints.FREE_TRIAL}?email=${email}`);
