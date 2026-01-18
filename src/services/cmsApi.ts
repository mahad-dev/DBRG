import apiClient from './apiClient';
import type {
  CmsItem,
  CreateCmsRequest,
  UpdateCmsRequest,
  CmsFilterParams,
  ResourceFilterParams,
  ApiResponse,
  PaginatedResponse,
} from '../types/cms';

/**
 * Create a new CMS item (News, Event, or Resource)
 */
export const createCms = async (
  data: CreateCmsRequest
): Promise<ApiResponse<string>> => {
  const response = await apiClient.post('/Cms/CreateCms', data);
  return response.data;
};

/**
 * Update an existing CMS item
 */
export const updateCms = async (
  data: UpdateCmsRequest
): Promise<ApiResponse<string>> => {
  const response = await apiClient.put('/Cms/UpdateCms', data);
  return response.data;
};

/**
 * Get all CMS items (Admin only) - with filters and pagination
 */
export const getAllCms = async (
  params?: CmsFilterParams
): Promise<PaginatedResponse<CmsItem>> => {
  const response = await apiClient.get('/Cms/GetAllCms', { params });
  return response.data;
};

/**
 * Get all published CMS items for members - with filters and pagination
 */
export const getAllCmsForMembers = async (
  params?: CmsFilterParams
): Promise<PaginatedResponse<CmsItem>> => {
  const response = await apiClient.get('/Cms/GetAllCmsForMembers', {
    params,
  });
  return response.data;
};

/**
 * Get a single CMS item by ID
 */
export const getCmsById = async (
  id: number
): Promise<ApiResponse<CmsItem>> => {
  const response = await apiClient.get('/Cms/GetCmsById', {
    params: { id },
  });
  return response.data;
};

/**
 * Get upcoming events with pagination
 */
export const getUpcomingEvents = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<CmsItem>> => {
  const response = await apiClient.get('/Cms/GetUpcomingEvents', {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return response.data;
};

/**
 * Get resources with filters and pagination
 */
export const getResources = async (
  params?: ResourceFilterParams
): Promise<PaginatedResponse<CmsItem>> => {
  const response = await apiClient.get('/Cms/GetResources', { params });
  return response.data;
};

/**
 * Get public news with filters and pagination (no authentication required)
 */
export const getPublicNews = async (
  params?: ResourceFilterParams
): Promise<PaginatedResponse<CmsItem>> => {
  const response = await apiClient.get('/Cms/GetPublicNews', {
    params: { PageSize: 100, ...params }
  });
  return response.data;
};

/**
 * Get public resources with filters and pagination (no authentication required)
 */
export const getPublicResources = async (
  params?: ResourceFilterParams
): Promise<PaginatedResponse<CmsItem>> => {
  const response = await apiClient.get('/Cms/GetPublicResources', {
    params: { PageSize: 100, ...params }
  });
  return response.data;
};

/**
 * Get public upcoming events with pagination (no authentication required)
 */
export const getPublicUpcomingEvents = async (
  pageNumber: number = 1,
  pageSize: number = 100
): Promise<PaginatedResponse<CmsItem>> => {
  const response = await apiClient.get('/Cms/GetPublicUpcomingEvents', {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return response.data;
};

/**
 * Get public past events with pagination (no authentication required)
 */
export const getPublicPastEvents = async (
  pageNumber: number = 1,
  pageSize: number = 100
): Promise<PaginatedResponse<CmsItem>> => {
  const response = await apiClient.get('/Cms/GetPublicPastEvents', {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return response.data;
};

/**
 * Register for an event
 */
export interface RegisterEventRequest {
  fullName: string;
  email: string;
  eventId: number;
  registeredDate: string;
}

export const registerEvent = async (
  data: RegisterEventRequest
): Promise<ApiResponse<string>> => {
  const response = await apiClient.post('/Cms/RegisterEvent', data);
  return response.data;
};

/**
 * Get event registrations (Admin only)
 */
export interface EventRegistration {
  id: number;
  fullName: string;
  email: string;
  eventId: number;
  registrationDate: string;
}

export interface EventRegistrationsParams {
  EventId: number;
}

export const getEventRegistrations = async (
  params: EventRegistrationsParams
): Promise<ApiResponse<EventRegistration[]>> => {
  const response = await apiClient.get('/Cms/GetEventRegistrations', { params });
  return response.data;
};
