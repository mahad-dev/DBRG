import apiClient from './apiClient';
import type { ApiResponse } from '../types/cms';
import type { Notification } from '../types/notification';

/**
 * Get admin top cards (Admin dashboard statistics)
 */
export const getAdminTopCards = async (): Promise<ApiResponse<any>> => {
  const response = await apiClient.get('/Dashboard/GetAdminTopCards');
  return response.data;
};

/**
 * Get upcoming events for dashboard
 */
export const getDashboardUpcomingEvents = async (): Promise<ApiResponse<any>> => {
  const response = await apiClient.get('/Dashboard/GetUpcomingEvents');
  return response.data;
};

/**
 * Get recently uploaded events
 */
export const getRecentlyUploadedEvents = async (): Promise<ApiResponse<any>> => {
  const response = await apiClient.get('/Dashboard/GetRecentlyUploadedEvents');
  return response.data;
};

/**
 * Get dashboard notifications (for the notification widget on dashboard)
 */
export const getDashboardNotifications = async (params?: {
  PageNumber?: number;
  PageSize?: number;
}): Promise<ApiResponse<Notification[]>> => {
  const response = await apiClient.get('/Dashboard/GetNotifications', { params });
  return response.data;
};
