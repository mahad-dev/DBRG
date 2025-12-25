import type { UploadDetailsPayload, ApiResponse } from '../types/uploadDetails';
import { MemberApplicationSection } from '../types/uploadDetails';
import apiClient from './apiClient.ts';

class UploadDetailsApi {
  private async request<T>(endpoint: string, options: any = {}): Promise<T> {
    const config = {
      ...options,
    };

    const response = await apiClient.request<T>({
      url: endpoint,
      ...config,
    });

    return response.data;
  }

  async uploadDocument(file: File): Promise<number> {
    const formData = new FormData();
    formData.append('document', file);

    const response = await apiClient.post<ApiResponse<{ documentId: number }>>('/UploadDetails/UploadDocument', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.documentId
;
  }

async saveUploadDetails(
  payload: Partial<UploadDetailsPayload>,
  sectionNumber: MemberApplicationSection
): Promise<boolean> {

  const fullPayload = {
    membershipType: payload.membershipType,
    sectionNumber,
    ...(sectionNumber === MemberApplicationSection.Applicability && { applicability: payload.applicability }),
    ...(sectionNumber === MemberApplicationSection.CompanyDetails && { companyDetails: payload.companyDetails }),
    ...(sectionNumber === MemberApplicationSection.BankRelationReq && { bankRelationshipRequirement: payload.bankRelationshipRequirement }),
    ...(sectionNumber === MemberApplicationSection.FinancialThreshold && { financialThreshold: payload.financialThreshold }),
    ...(sectionNumber === MemberApplicationSection.RegulatorCompliance && { regulatoryCompliance: payload.regulatorCompliance }),
    ...(sectionNumber === MemberApplicationSection.RequiredDocs && { memberRequiredDocuments: payload.memberRequiredDocuments }),
    ...(sectionNumber === MemberApplicationSection.DataProtectionPrivacy && { dataProtectionPrivacy: payload.dataProtectionPrivacy }),
    ...(sectionNumber === MemberApplicationSection.DeclarationConsent && { declarationConsent: payload.declarationConsent }),
  };

  await apiClient.post('/UploadDetails/UploadDetails', fullPayload);

  // ✅ IMPORTANT
  return true;
}

  async getUploadDetails(userId: string): Promise<Partial<UploadDetailsPayload>> {
    const response: ApiResponse<Partial<UploadDetailsPayload>> = await this.request(`/UploadDetails/GetUploadDetails?userId=${userId}`);
    return response.data;
  }

  async getDocumentPath(documentId: number): Promise<string> {
    const response: ApiResponse<{ path: string }> = await this.request(`/UploadDetails/GetDocumentPath?id=${documentId}`);
    return response.data.path;
  }

  async trackStatus(userId: string): Promise<any> {
    const response: ApiResponse<any> = await this.request(`/UploadDetails/TrackStatus?userId=${userId}`);
    return response.data;
  }
}

export const uploadDetailsApi = new UploadDetailsApi();
