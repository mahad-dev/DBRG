import apiClient from './apiClient';
import type {
  Notification,
  CreateNotificationRequest,
  GetNotificationsParams,
  ApiResponse,
  PaginatedResponse,
} from '../types/notification';

/**
 * Create and send a new notification
 */
export const createNotification = async (
  data: CreateNotificationRequest
): Promise<ApiResponse<string>> => {
  const response = await apiClient.post('/Notification/CreateNotification', data);
  return response.data;
};

/**
 * Get notifications with pagination (Admin)
 */
export const getNotifications = async (
  params?: GetNotificationsParams
): Promise<PaginatedResponse<Notification>> => {
  const response = await apiClient.get('/Notification/GetNotifications', { params });
  return response.data;
};

/**
 * Get user notifications (Member)
 */
export const getUserNotifications = async (
  params?: GetNotificationsParams
): Promise<ApiResponse<Notification[]>> => {
  const response = await apiClient.get('/Notification/GetUserNotifications', { params });
  return response.data;
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (
  notificationId: number
): Promise<ApiResponse<string>> => {
  const response = await apiClient.put('/Notification/MarkNotificationsAsRead', null, {
    params: { notificationId }
  });
  return response.data;
};

/**
 * Delete a user notification
 */
export const deleteUserNotification = async (
  notificationId: number
): Promise<ApiResponse<string>> => {
  const response = await apiClient.delete('/Notification/DeleteUserNotification', {
    params: { notificationId }
  });
  return response.data;
};
