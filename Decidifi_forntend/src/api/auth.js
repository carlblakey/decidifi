import apiClient from "./client";
import { endPoints } from "./endPoints";

export const loginUser = (credentials) =>
  apiClient.post(endPoints.LOGIN, credentials);

export const registerUser = (credentials) =>
  apiClient.post(endPoints.REGISTER, credentials);

export const confirmOtp = (credentials) =>
  apiClient.post(endPoints.CONFIRM_OTP, credentials);

export const resetpasswordotp = (credentials) =>
  apiClient.post(endPoints.RESET_PASSWORD_OTP, credentials);

export const resetpassword = (credentials) =>
  apiClient.post(endPoints.RESET_PASSWORD, credentials);

export const sendotp = (credentials) =>
  apiClient.post(endPoints.RESEND_OTP, credentials);

export const changePassword = (credentials) =>
  apiClient.put(endPoints.CHANGE_PASSWORD, credentials);
