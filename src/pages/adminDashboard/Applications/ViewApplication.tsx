"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Download, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import apiClient from "@/services/apiClient";

// Type matching the actual API response
type APIResponse = {
  data: {
    isCompleted: boolean;
    isSpecialConsiderationApproved: boolean;
    application: {
      memberId: string;
      lastCompletedSection: number;
      isCompleted: boolean;
      submittedDate: string;
      createdDate: string;
      status: number;
      membershipType: number;
      statusUpdatedDate: string | null;
      askDetailsDate: string | null;
      askMoreDetailsRequest: string | null;
      askMoreDetailsResponse: string | null;
      adminComments: string | null;
      id: number;
    };
    applicability: any;
    companyDetails: any;
    bankRelationReq: any;
    financialThreshold: any;
    regulatorCompliance: any;
    requiredDocs: any;
    dataProtectionPrivacy: any;
    declarationConsent: any;
    specialConsideration: any;
  };
  message: string;
  status: boolean;
};

export default function ViewApplication() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<APIResponse["data"] | null>(null);

  useEffect(() => {
    if (userId) {
      fetchApplicationDetails();
    }
  }, [userId]);

  const fetchApplicationDetails = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await apiClient.get(`/UploadDetails/GetUploadDetails`, {
        params: { userId }
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching application details:", error);
      toast.error("Failed to load application details");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (documentPath: string) => {
    if (!documentPath) {
      toast.error("Document path not available");
      return;
    }

    try {
      // Open the document in a new tab
      window.open(documentPath, "_blank");
      toast.success("Opening document");
    } catch (error) {
      console.error("Error opening document:", error);
      toast.error("Failed to open document");
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Invalid Application</h2>
          <Button onClick={() => navigate(-1)} className="bg-[#C6A95F] hover:bg-[#bfa14f] cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-semibold text-[#C6A95F]">
              Application Details
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-12 h-12 animate-spin text-[#C6A95F]" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Application Status */}
            <Section title="Application Status">
              <Field label="Membership Type" value={getMembershipTypeLabel(data.application.membershipType)} />
              <Field label="Status" value={getStatusLabel(data.application.status)} />
              <Field label="Submitted Date" value={formatDate(data.application.submittedDate)} />
              <Field label="Is Completed" value={data.isCompleted ? "Yes" : "No"} />
              {data.application.adminComments && (
                <Field label="Admin Comments" value={data.application.adminComments} />
              )}
            </Section>

            {/* Applicability */}
            {data.applicability && (
              <Section title="Applicability">
                <Field
                  label="Has Office in UAE"
                  value={data.applicability.hasOfficeInUAE ? "Yes" : "No"}
                />
                <Field
                  label="Services"
                  value={data.applicability.services || "N/A"}
                />
                <Field
                  label="Refining/Trading Category"
                  value={data.applicability.refiningOrTradingCategory === 1 ? "Refining" : data.applicability.refiningOrTradingCategory === 2 ? "Trading" : "N/A"}
                />
                {data.applicability.isAccreditedRefinery !== null && (
                  <Field
                    label="Is Accredited Refinery"
                    value={data.applicability.isAccreditedRefinery ? "Yes" : "No"}
                  />
                )}
                {data.applicability.involvedInWholesaleBullionTrading !== null && (
                  <Field
                    label="Involved in Wholesale Bullion Trading"
                    value={data.applicability.involvedInWholesaleBullionTrading ? "Yes" : "No"}
                  />
                )}
                <Field
                  label="Has Banking Relationships (3+ Years)"
                  value={data.applicability.hasBankingRelationships3Years ? "Yes" : "No"}
                />
                <Field
                  label="Has Unresolved AML Notices"
                  value={data.applicability.hasUnresolvedAMLNotices ? "Yes" : "No"}
                />
                {data.applicability.signedAMLDeclarationPath && (
                  <DocumentField
                    label="Signed AML Declaration"
                    documentPath={data.applicability.signedAMLDeclarationPath}
                    onDownload={handleDownloadDocument}
                  />
                )}
              </Section>
            )}

            {/* Company Details */}
            {data.companyDetails && (
              <Section title="Company Details">
                <Field label="Legal Entity Name" value={data.companyDetails.legalEntityName || "N/A"} />
                <Field label="Entity Legal Type" value={data.companyDetails.entityLegalType || "N/A"} />
                <Field label="Trade License Number" value={data.companyDetails.tradeLicenseNumber || "N/A"} />
                <Field label="Licensing Authority" value={data.companyDetails.licensingAuthority || "N/A"} />
                <Field
                  label="Registered for Corporate Tax"
                  value={data.companyDetails.isRegisteredForCorporateTax ? "Yes" : "No"}
                />
                {data.companyDetails.isRegisteredForCorporateTax && (
                  <Field label="Tax Registration Number" value={data.companyDetails.taxRegistrationNumber || "N/A"} />
                )}
                <Field
                  label="Registered for VAT"
                  value={data.companyDetails.isRegisteredForVAT ? "Yes" : "No"}
                />
                {data.companyDetails.isRegisteredForVAT && (
                  <Field label="VAT Number" value={data.companyDetails.vatNumber || "N/A"} />
                )}
                <Field label="Website" value={data.companyDetails.website || "N/A"} />
                <Field label="Primary Contact Name" value={data.companyDetails.primaryContactName || "N/A"} />
                <Field label="Primary Contact Email" value={data.companyDetails.primaryContactEmail || "N/A"} />
                <Field label="Official Email" value={data.companyDetails.officialEmail || "N/A"} />
                <Field label="Registered Office Address" value={data.companyDetails.registeredOfficeAddress || "N/A"} />
                <Field label="Country of Incorporation" value={data.companyDetails.countryOfIncorporation || "N/A"} />
                <Field label="Date of Incorporation" value={formatDate(data.companyDetails.dateOfIncorporation)} />

                {/* Documents */}
                {data.companyDetails.tradeLicenseDocumentPath && (
                  <DocumentField
                    label="Trade License Document"
                    documentPath={data.companyDetails.tradeLicenseDocumentPath}
                    onDownload={handleDownloadDocument}
                  />
                )}
                {data.companyDetails.certificateOfIncorporationPath && (
                  <DocumentField
                    label="Certificate of Incorporation"
                    documentPath={data.companyDetails.certificateOfIncorporationPath}
                    onDownload={handleDownloadDocument}
                  />
                )}

                {/* Shareholders */}
                {data.companyDetails.shareholders && data.companyDetails.shareholders.length > 0 && (
                  <div className="col-span-2">
                    <h4 className="text-lg font-semibold text-[#C6A95F] mb-4">Shareholders</h4>
                    <div className="space-y-4">
                      {data.companyDetails.shareholders.map((shareholder: any, index: number) => (
                        <div key={index} className="border border-white/20 rounded-lg p-4 bg-white/5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Full Name" value={shareholder.fullName || "N/A"} />
                            <Field label="Nationality" value={shareholder.nationality || "N/A"} />
                            <Field label="Shareholding %" value={`${shareholder.shareholdingPercentage || 0}%`} />
                            <Field label="Passport ID" value={shareholder.passportId || "N/A"} />
                            <Field label="National ID" value={shareholder.nationalIdNumber || "N/A"} />
                            <Field label="Address" value={shareholder.address || "N/A"} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ultimate Beneficial Owners */}
                {data.companyDetails.ultimateBeneficialOwners && data.companyDetails.ultimateBeneficialOwners.length > 0 && (
                  <div className="col-span-2">
                    <h4 className="text-lg font-semibold text-[#C6A95F] mb-4">Ultimate Beneficial Owners</h4>
                    <div className="space-y-4">
                      {data.companyDetails.ultimateBeneficialOwners.map((ubo: any, index: number) => (
                        <div key={index} className="border border-white/20 rounded-lg p-4 bg-white/5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Full Name" value={ubo.fullName || "N/A"} />
                            <Field label="Nationality" value={ubo.nationality || "N/A"} />
                            <Field label="Ownership %" value={`${ubo.ownershipPercentage || 0}%`} />
                            <Field label="Passport ID" value={ubo.passportId || "N/A"} />
                            <Field label="National ID" value={ubo.nationalIdNumber || "N/A"} />
                            <Field label="Address" value={ubo.address || "N/A"} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Directors */}
                {data.companyDetails.directors && data.companyDetails.directors.length > 0 && (
                  <div className="col-span-2">
                    <h4 className="text-lg font-semibold text-[#C6A95F] mb-4">Directors</h4>
                    <div className="space-y-4">
                      {data.companyDetails.directors.map((director: any, index: number) => (
                        <div key={index} className="border border-white/20 rounded-lg p-4 bg-white/5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Full Name" value={director.fullName || "N/A"} />
                            <Field label="Nationality" value={director.nationality || "N/A"} />
                            <Field label="Date of Appointment" value={formatDate(director.dateOfAppointment)} />
                            <Field label="Phone Number" value={director.phoneNumber || "N/A"} />
                            <Field label="Address" value={director.address || "N/A"} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* Bank Relationship Requirement */}
            {data.bankRelationReq && (
              <Section title="Bank Relationship Requirement">
                <Field
                  label="Client of DBRG Member Bank (24+ Months)"
                  value={data.bankRelationReq.isClientOfDBRGMemberBank24Months ? "Yes" : "No"}
                />
                <Field label="Bank Name" value={data.bankRelationReq.bankName || "N/A"} />
                <Field label="Account Number" value={data.bankRelationReq.accountNumber || "N/A"} />
                <Field label="Account Type" value={data.bankRelationReq.accountType || "N/A"} />
                <Field label="Banking Relation Since" value={formatDate(data.bankRelationReq.bankingRelationSince)} />
                <Field label="Bank Address" value={data.bankRelationReq.bankAddress || "N/A"} />
                {data.bankRelationReq.bankReferenceLetterFilePath && (
                  <DocumentField
                    label="Bank Reference Letter"
                    documentPath={data.bankRelationReq.bankReferenceLetterFilePath}
                    onDownload={handleDownloadDocument}
                  />
                )}
              </Section>
            )}

            {/* Financial Threshold */}
            {data.financialThreshold && (
              <Section title="Financial Threshold">
                <Field
                  label="Paid Up Capital"
                  value={data.financialThreshold.paidUpCapital ? `$${data.financialThreshold.paidUpCapital.toLocaleString()}` : "N/A"}
                />
                <Field
                  label="Annual Turnover Value"
                  value={data.financialThreshold.annualTurnoverValue ? `$${data.financialThreshold.annualTurnoverValue.toLocaleString()}` : "N/A"}
                />
                <Field
                  label="Has Required Bullion Turnover"
                  value={data.financialThreshold.hasRequiredBullionTurnover ? "Yes" : "No"}
                />
                <Field
                  label="Has Required Net Worth"
                  value={data.financialThreshold.hasRequiredNetWorth ? "Yes" : "No"}
                />
                {data.financialThreshold.bullionTurnoverProofFileIdPath && (
                  <DocumentField
                    label="Bullion Turnover Proof"
                    documentPath={data.financialThreshold.bullionTurnoverProofFileIdPath}
                    onDownload={handleDownloadDocument}
                  />
                )}
                {data.financialThreshold.netWorthProofPath && (
                  <DocumentField
                    label="Net Worth Proof"
                    documentPath={data.financialThreshold.netWorthProofPath}
                    onDownload={handleDownloadDocument}
                  />
                )}
              </Section>
            )}

            {/* Regulatory Compliance */}
            {data.regulatorCompliance && (
              <Section title="Regulatory Compliance">
                <Field
                  label="Compliant with AML/CFT"
                  value={data.regulatorCompliance.compliantWithAmlCft ? "Yes" : "No"}
                />
                <Field label="Compliance Officer Name" value={data.regulatorCompliance.complianceOfficerFullName || "N/A"} />
                <Field label="Compliance Officer Email" value={data.regulatorCompliance.complianceOfficerEmail || "N/A"} />
                <Field label="Compliance Officer Contact" value={data.regulatorCompliance.complianceOfficerContactNumber || "N/A"} />
                <Field
                  label="Has Ongoing Cases"
                  value={data.regulatorCompliance.hasOngoingCases ? "Yes" : "No"}
                />
                {data.regulatorCompliance.hasOngoingCases && (
                  <Field label="Ongoing Cases Details" value={data.regulatorCompliance.ongoingCasesDetails || "N/A"} />
                )}
                <Field
                  label="Any on Sanctions List"
                  value={data.regulatorCompliance.anyOnSanctionsList ? "Yes" : "No"}
                />
                <Field
                  label="Has Supply Chain Policy"
                  value={data.regulatorCompliance.hasSupplyChainPolicy ? "Yes" : "No"}
                />
                {data.regulatorCompliance.amlCftPolicyDocumentFilePath && (
                  <DocumentField
                    label="AML/CFT Policy Document"
                    documentPath={data.regulatorCompliance.amlCftPolicyDocumentFilePath}
                    onDownload={handleDownloadDocument}
                  />
                )}
                {data.regulatorCompliance.supplyChainPolicyDocumentFilePath && (
                  <DocumentField
                    label="Supply Chain Policy Document"
                    documentPath={data.regulatorCompliance.supplyChainPolicyDocumentFilePath}
                    onDownload={handleDownloadDocument}
                  />
                )}
              </Section>
            )}

            {/* Required Documents */}
            {data.requiredDocs && (
              <Section title="Required Documents">
                <div className="col-span-2 space-y-3">
                  {data.requiredDocs.tradeLicenseAndMoaPath && (
                    <DocumentField
                      label="Trade License & MOA"
                      documentPath={data.requiredDocs.tradeLicenseAndMoaPath}
                      onDownload={handleDownloadDocument}
                    />
                  )}
                  {data.requiredDocs.auditedFinancialStatementsPath && (
                    <DocumentField
                      label="Audited Financial Statements"
                      documentPath={data.requiredDocs.auditedFinancialStatementsPath}
                      onDownload={handleDownloadDocument}
                    />
                  )}
                  {data.requiredDocs.netWorthCertificatePath && (
                    <DocumentField
                      label="Net Worth Certificate"
                      documentPath={data.requiredDocs.netWorthCertificatePath}
                      onDownload={handleDownloadDocument}
                    />
                  )}
                  {data.requiredDocs.amlCftPolicyPath && (
                    <DocumentField
                      label="AML/CFT Policy"
                      documentPath={data.requiredDocs.amlCftPolicyPath}
                      onDownload={handleDownloadDocument}
                    />
                  )}
                  {data.requiredDocs.supplyChainCompliancePolicyPath && (
                    <DocumentField
                      label="Supply Chain Compliance Policy"
                      documentPath={data.requiredDocs.supplyChainCompliancePolicyPath}
                      onDownload={handleDownloadDocument}
                    />
                  )}
                  {data.requiredDocs.noUnresolvedAmlNoticesDeclarationPath && (
                    <DocumentField
                      label="No Unresolved AML Notices Declaration"
                      documentPath={data.requiredDocs.noUnresolvedAmlNoticesDeclarationPath}
                      onDownload={handleDownloadDocument}
                    />
                  )}
                  {data.requiredDocs.boardResolutionPath && (
                    <DocumentField
                      label="Board Resolution"
                      documentPath={data.requiredDocs.boardResolutionPath}
                      onDownload={handleDownloadDocument}
                    />
                  )}
                  {data.requiredDocs.ownershipStructurePath && (
                    <DocumentField
                      label="Ownership Structure"
                      documentPath={data.requiredDocs.ownershipStructurePath}
                      onDownload={handleDownloadDocument}
                    />
                  )}
                  {data.requiredDocs.certifiedTrueCopyPath && (
                    <DocumentField
                      label="Certified True Copy"
                      documentPath={data.requiredDocs.certifiedTrueCopyPath}
                      onDownload={handleDownloadDocument}
                    />
                  )}
                  {data.requiredDocs.latestAssuranceReportPath && (
                    <DocumentField
                      label="Latest Assurance Report"
                      documentPath={data.requiredDocs.latestAssuranceReportPath}
                      onDownload={handleDownloadDocument}
                    />
                  )}
                  {data.requiredDocs.uboProofDocumentsPath && (
                    <DocumentField
                      label="UBO Proof Documents"
                      documentPath={data.requiredDocs.uboProofDocumentsPath}
                      onDownload={handleDownloadDocument}
                    />
                  )}
                  {data.requiredDocs.certifiedIdsPath && (
                    <DocumentField
                      label="Certified IDs"
                      documentPath={data.requiredDocs.certifiedIdsPath}
                      onDownload={handleDownloadDocument}
                    />
                  )}
                </div>
              </Section>
            )}

            {/* Data Protection & Privacy */}
            {data.dataProtectionPrivacy && (
              <Section title="Data Protection & Privacy">
                <Field
                  label="Acknowledged"
                  value={data.dataProtectionPrivacy.acknowledge ? "Yes" : "No"}
                />
              </Section>
            )}

            {/* Declaration & Consent */}
            {data.declarationConsent && (
              <Section title="Declaration & Consent">
                <Field
                  label="Consents to Data Processing"
                  value={data.declarationConsent.consentsToDataProcessing ? "Yes" : "No"}
                />
                <Field
                  label="Acknowledges Data Retention"
                  value={data.declarationConsent.acknowledgesDataRetention ? "Yes" : "No"}
                />
                <Field
                  label="Adheres to Code of Conduct"
                  value={data.declarationConsent.adheresToCodeOfConduct ? "Yes" : "No"}
                />
                <Field label="Applicant Name" value={data.declarationConsent.applicantName || "N/A"} />
                <Field label="Date" value={formatDate(data.declarationConsent.date)} />
                <Field label="Authorised Signatory Name" value={data.declarationConsent.authorisedSignatoryName || "N/A"} />
                <Field label="Designation" value={data.declarationConsent.designation || "N/A"} />
                {data.declarationConsent.digitalSignatureFilePath && (
                  <DocumentField
                    label="Digital Signature"
                    documentPath={data.declarationConsent.digitalSignatureFilePath}
                    onDownload={handleDownloadDocument}
                  />
                )}
              </Section>
            )}

            {/* Special Consideration */}
            {data.specialConsideration && (
              <Section title="Special Consideration">
                <Field label="Message" value={data.specialConsideration.message || "N/A"} />
                <Field label="Status" value={getSpecialConsiderationStatus(data.specialConsideration.status)} />
                <Field label="Created Date" value={formatDate(data.specialConsideration.createdDate)} />
                {data.specialConsideration.remarks && (
                  <Field label="Remarks" value={data.specialConsideration.remarks} />
                )}
              </Section>
            )}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-xl text-white/60 mb-4">No application details found</p>
            <Button
              onClick={() => navigate(-1)}
              className="bg-[#C6A95F] hover:bg-[#bfa14f] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/20 rounded-lg p-6 bg-white/5">
      <h3 className="text-xl font-semibold text-[#C6A95F] mb-6">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <label className="text-sm text-white/60 mb-2 block font-medium">{label}</label>
      <p className="text-white text-base">{value}</p>
    </div>
  );
}

function DocumentField({
  label,
  documentPath,
  onDownload,
}: {
  label: string;
  documentPath: string;
  onDownload: (documentPath: string) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
      <span className="text-white font-medium">{label}</span>
      <Button
        size="sm"
        onClick={() => onDownload(documentPath)}
        className="bg-[#C6A95F] hover:bg-[#bfa14f] text-white cursor-pointer"
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    </div>
  );
}

/* ================= HELPER FUNCTIONS ================= */

function getMembershipTypeLabel(type: number | undefined): string {
  if (!type) return "N/A";
  switch (type) {
    case 1:
      return "Principal Member";
    case 2:
      return "Member Bank";
    case 3:
      return "Contributing Member";
    case 4:
      return "Affiliate Member";
    default:
      return "N/A";
  }
}

function getStatusLabel(status: number | undefined): string {
  if (status === undefined || status === null) return "N/A";
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "In Progress";
    case 2:
      return "Approved";
    case 3:
      return "Rejected";
    default:
      return "N/A";
  }
}

function getSpecialConsiderationStatus(status: number | undefined): string {
  if (status === undefined || status === null) return "N/A";
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "In Progress";
    case 2:
      return "Approved";
    case 3:
      return "Rejected";
    default:
      return "N/A";
  }
}

function formatDate(date: string | null | undefined): string {
  if (!date || date === "0001-01-01T00:00:00") return "N/A";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}
