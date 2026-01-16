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
 * Get notifications with pagination
 */
export const getNotifications = async (
  params?: GetNotificationsParams
): Promise<PaginatedResponse<Notification>> => {
  const response = await apiClient.get('/Notification/GetNotifications', { params });
  return response.data;
};

// Note: markAsRead and deleteNotification will be implemented in Phase 2
