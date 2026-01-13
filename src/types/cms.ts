// CMS Type Definitions

export enum CmsCategory {
  News = 1,
  Event = 2,
  Resource = 3,
}

export interface CmsItem {
  id: number;
  title: string;
  description: string;
  date: string; // ISO 8601 format
  link?: string;
  documentIds: number[];
  documentPaths?: string[];
  isPublished: boolean;
  category: CmsCategory;
  bannerId?: number;
  bannerPath?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCmsRequest {
  title: string;
  description: string;
  date: string; // ISO 8601 format
  link?: string | null;
  documentIds: number[];
  isPublished: boolean;
  category: CmsCategory;
  bannerId?: number;
}

export interface UpdateCmsRequest extends CreateCmsRequest {
  id: number;
}

export interface CmsFilterParams {
  Search?: string;
  IsPublished?: boolean;
  StartDate?: string; // ISO 8601 format
  EndDate?: string; // ISO 8601 format
  PageNumber?: number;
  PageSize?: number;
  Category?: CmsCategory;
}

export interface ResourceFilterParams {
  Search?: string;
  StartDate?: string; // ISO 8601 format
  EndDate?: string; // ISO 8601 format
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

// Helper type for category display
export const CategoryLabels: Record<CmsCategory, string> = {
  [CmsCategory.News]: 'News',
  [CmsCategory.Event]: 'Event',
  [CmsCategory.Resource]: 'Resource',
};

// Helper function to map category string to enum
export const getCategoryEnum = (categoryString: string): CmsCategory => {
  const mapping: Record<string, CmsCategory> = {
    'News': CmsCategory.News,
    'Event': CmsCategory.Event,
    'Resource': CmsCategory.Resource,
  };
  return mapping[categoryString] || CmsCategory.News;
};

// Helper function to check if title/description contains "Press Release"
export const isPressRelease = (item: CmsItem): boolean => {
  const searchText = `${item.title} ${item.description}`.toLowerCase();
  return searchText.includes('press release');
};
