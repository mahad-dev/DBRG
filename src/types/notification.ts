// Notification Type Definitions

export enum ChannelType {
  EmailAndInApp = 1, // All Channels (Email + In-App)
  InApp = 2,
  Email = 3,
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  channelType: ChannelType;
  isRead?: boolean;
  createdAt?: string;
  createdDate?: string; // API returns createdDate instead of createdAt
  senderName?: string;
  senderImage?: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  channelType: ChannelType;
}

export interface GetNotificationsParams {
  PageNumber?: number;
  PageSize?: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: boolean;
}

export interface PaginatedResponse<T> {
  data: {
    items: T[];
    totalCount: number;
  };
  message: string;
  status: boolean;
}

// Helper function to get channel label
export const getChannelLabel = (channelType: ChannelType): string => {
  switch (channelType) {
    case ChannelType.Email:
      return 'Email';
    case ChannelType.InApp:
      return 'In-App';
    case ChannelType.EmailAndInApp:
      return 'All Channels (Email + In-App)';
    default:
      return 'Unknown';
  }
};
