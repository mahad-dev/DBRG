import apiClient from './apiClient';

export interface GetMembersParams {
  Search?: string;
  Country?: string;
  PageNumber?: number;
  PageSize?: number;
}

export interface Member {
  id: number;
  company: string;
  location: string;
  type: string;
  description: string;
  avatar: string;
}

export interface GetMembersApiResponse {
  data: {
    totalCount: number;
    items: Member[];
  } | string;
  message: string;
  status: boolean;
}

export interface GetMembersResponse {
  data: Member[];
  totalCount: number;
  totalPages: number;
}

export interface ContactMemberRequest {
  receiverMemberId: string;
  message: string;
}

export interface ContactMemberResponse {
  message: string;
  status: boolean;
}

export interface GetInboxResponse {
  data: string;
  message: string;
  status: boolean;
}

export interface GetMessagesParams {
  ConversationId?: number;
  PageNumber?: number;
  PageSize?: number;
}

export interface GetMessagesResponse {
  data: string;
  message: string;
  status: boolean;
}

class MemberDirectoryApi {
  async getMembers(params: GetMembersParams = {}): Promise<GetMembersResponse> {
    try {
      const response = await apiClient.get<GetMembersApiResponse>('/MemberDirectory/GetMembers', {
        params: {
          Search: params.Search || undefined,
          Country: params.Country || undefined,
          PageNumber: params.PageNumber || 1,
          PageSize: params.PageSize || 6,
        },
      });

      // Handle different response structures
      let items: Member[] = [];
      let totalCount = 0;

      if (response.data.status && response.data.data) {
        if (typeof response.data.data === 'string') {
          // If data is a string, it might be JSON encoded
          try {
            const parsedData = JSON.parse(response.data.data);
            items = parsedData.items || [];
            totalCount = parsedData.totalCount || 0;
          } catch {
            // If parsing fails, return empty array
            items = [];
            totalCount = 0;
          }
        } else {
          // If data is an object
          items = response.data.data.items || [];
          totalCount = response.data.data.totalCount || 0;
        }
      }

      const totalPages = Math.ceil(totalCount / (params.PageSize || 6));

      return {
        data: items,
        totalCount: totalCount,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  }

  async contactMember(params: ContactMemberRequest): Promise<ContactMemberResponse> {
    try {
      const response = await apiClient.post<ContactMemberResponse>('/MemberDirectory/ContactMember', params);
      return response.data;
    } catch (error) {
      console.error('Error contacting member:', error);
      throw error;
    }
  }

  async getInbox(): Promise<GetInboxResponse> {
    try {
      const response = await apiClient.get<GetInboxResponse>('/MemberDirectory/GetInbox');
      return response.data;
    } catch (error) {
      console.error('Error fetching inbox:', error);
      throw error;
    }
  }

  async getMessages(params: GetMessagesParams = {}): Promise<GetMessagesResponse> {
    try {
      const response = await apiClient.get<GetMessagesResponse>('/MemberDirectory/GetMessages', {
        params: {
          ConversationId: params.ConversationId || undefined,
          PageNumber: params.PageNumber || 1,
          PageSize: params.PageSize || 10,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }
}

export const memberDirectoryApi = new MemberDirectoryApi();
