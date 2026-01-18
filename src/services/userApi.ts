import type { ReactNode } from 'react';
import apiClient from './apiClient';

export interface Permission {
  id: number;
  name: string;
  key: string;
  parentId: number | null;
  parent: Permission | null;
}

export interface GetUsersParams {
  Status?: number;
  Search?: string;
  Country?: string;
  PageNumber?: number;
  PageSize?: number;
}

export interface User {
  email: ReactNode;
  userId: string;
  name: string;
  company: string | null;
  country: string | null;
  status: number | null; // 0 = Pending, 1 = In Progress, 2 = Approved, 3 = Rejected
  submissionDate: string | null;
  applicationId: number | null;
}

export interface GetUsersApiResponse {
  data: {
    totalCount: number;
    items: User[];
  };
  message: string;
  status: boolean;
}

export interface GetUsersResponse {
  data: User[];
  totalCount: number;
  totalPages: number;
}

export interface ReplaceCompanyDelegateRequest {
  userid: string;
  name: string;
  phoneNumber: string;
  email: string;
  delegateDocuments: number[];
}

export interface ApiResponse {
  data: any;
  message: string;
  status: boolean;
}

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  pictureId?: number;
  pictureUrl?: string;
  companyName?: string;
  companyAddress?: string;
  companyCountry?: string;
  licenseNumber?: string;
  directorName?: string;
  directorPassportId?: string;
  directorPassportDocumentId?: number;
  directorNationalId?: string;
  directorNationalDocumentId?: number;
  businessLicenseDocumentId?: number;
  proofOfAddressDocumentId?: number;
  identityProofDocumentId?: number;
  paymentDocumentIds?: number[];
}

export interface GetApprovedApplicationsParams {
  Status?: number;
  Search?: string;
  Country?: string;
  PageNumber?: number;
  PageSize?: number;
}

export interface ApprovedApplication {
  name: string;
  userId: string;
  company: string | null;
  country: string | null;
  status: number;
  submissionDate: string | null;
  statusUpdatedDate: string | null;
  askDetailsDate: string | null;
  askMoreDetailsRequest: string | null;
  adminComments: string | null;
}

export interface GetApprovedApplicationsApiResponse {
  data: {
    totalCount: number;
    items: ApprovedApplication[];
  };
  message: string;
  status: boolean;
}

export interface GetApprovedApplicationsResponse {
  data: ApprovedApplication[];
  totalCount: number;
  totalPages: number;
}

class UserApi {
  async getUsers(params: GetUsersParams = {}): Promise<GetUsersResponse> {
    try {
      const response = await apiClient.get<GetUsersApiResponse>('/User/GetUsers', {
        params: {
          Status: params.Status,
          Search: params.Search,
          Country: params.Country,
          PageNumber: params.PageNumber || 1,
          PageSize: params.PageSize || 6,
        },
      });

      // Transform API response to match our component's expected structure
      const apiData = response.data.data;
      const totalPages = Math.ceil(apiData.totalCount / (params.PageSize || 6));

      return {
        data: apiData.items,
        totalCount: apiData.totalCount,
        totalPages: totalPages,
      };
    } catch (error) {
      throw error;
    }
  }
  async getUsersWithoutFilter(params: GetUsersParams = {}): Promise<GetUsersResponse> {
    try {
      const response = await apiClient.get<GetUsersApiResponse>('/User/GetUsers');

      // Transform API response to match our component's expected structure
      const apiData = response.data.data;
      const totalPages = Math.ceil(apiData.totalCount / (params.PageSize || 6));

      return {
        data: apiData.items,
        totalCount: apiData.totalCount,
        totalPages: totalPages,
      };
    } catch (error) {
      throw error;
    }
  }
  async replaceCompanyDelegate(data: ReplaceCompanyDelegateRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.put<ApiResponse>('/User/ReplaceCompanyDelegate', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async uploadDocument(file: File): Promise<number> {
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await apiClient.post<ApiResponse>('/UploadDetails/UploadDocument', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Log the full response for debugging
      console.log('Upload response:', response.data);

      // Extract documentId from different possible response structures
      let documentId: number | null = null;
      const responseData: any = response.data;

      if (responseData.data && typeof responseData.data === 'object' && responseData.data.documentId) {
        documentId = responseData.data.documentId;
      } else if (typeof responseData.data === 'number') {
        documentId = responseData.data;
      } else if (responseData.documentId) {
        documentId = responseData.documentId;
      }

      if (!documentId) {
        console.error('Could not extract documentId from response:', response.data);
        throw new Error('Failed to get document ID from upload response');
      }

      return documentId;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async getApprovedApplications(params: GetApprovedApplicationsParams = {}): Promise<GetApprovedApplicationsResponse> {
    try {
      const response = await apiClient.get<GetApprovedApplicationsApiResponse>('/UploadDetails/GetApprovedApplications', {
        params: {
          Status: params.Status,
          Search: params.Search,
          Country: params.Country,
          PageNumber: params.PageNumber || 1,
          PageSize: params.PageSize || 6,
        },
      });

      // Transform API response to match our component's expected structure
      const apiData = response.data.data;
      const totalPages = Math.ceil(apiData.totalCount / (params.PageSize || 6));

      return {
        data: apiData.items,
        totalCount: apiData.totalCount,
        totalPages: totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllPermissions(): Promise<Permission[]> {
    try {
      const response = await apiClient.get('/User/GetAllPermissions');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(data: {
    userId: string;
    name: string;
    phone: string;
    email: string;
    role: number;
    password: string;
    permissionIds: number[];
  }): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/User/UpdateUser', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.get('/User/GetUserById', {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createPayment(data: {
    userId?: string;
    companyName: string;
    date: string;
    dueDate: string;
    paymentStatus: number;
    amount: number;
    invoiceNumber: string;
    vatNumber: string;
  }): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/Payment/Create', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentById(id: number): Promise<ApiResponse> {
    try {
      const response = await apiClient.get('/Payment/GetById', {
        params: { id }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updatePayment(data: {
    id: string;
    userId?: string;
    companyName: string;
    date: string;
    dueDate: string;
    paymentStatus: number;
    amount: number;
    invoiceNumber: string;
    vatNumber: string;
  }): Promise<ApiResponse> {
    try {
      const response = await apiClient.put('/Payment/Update', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userId?: string): Promise<ApiResponse> {
    try {
      const uid = userId || localStorage.getItem('userId');
      const response = await apiClient.get('/User/ShowUserProfile', {
        params: { userId: uid }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(data: {
    companyName?: string;
    companyAddress?: string;
    companyCountry?: string;
    licenseNumber?: string;
    directorName?: string;
    directorPassportId?: string;
    directorPassportDocumentId?: number;
    directorNationalId?: string;
    directorNationalDocumentId?: number;
    businessLicenseDocumentId?: number;
    proofOfAddressDocumentId?: number;
    identityProofDocumentId?: number;
    pictureId?: number;
    paymentDocumentIds?: number[];
  }): Promise<ApiResponse> {
    try {
      const response = await apiClient.put('/User/UpdateUserProfile', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/User/ResetPassword', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfileWithPassword(data: {
    name?: string | null;
    phoneNumber?: string | null;
    pictureId?: number | null;
    oldPassword?: string | null;
    newPassword?: string | null;
  }): Promise<ApiResponse> {
    try {
      const response = await apiClient.put('/User/UpdateProfileWithPassword', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const userApi = new UserApi();
