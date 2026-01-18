"use client";

import { useState, useEffect, useRef } from "react";
import { userApi, type UserProfile } from "@/services/userApi";
import { toast } from "react-toastify";
import { Camera, X, Plus } from "lucide-react";
import UploadBox from "@/components/custom/ui/UploadBox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentFile {
  file: File | null;
  documentId: number | null;
  prefilledUrl: string | null;
}

interface PaymentDocument {
  id: string;
  file: File | null;
  documentId: number | null;
  prefilledUrl: string | null;
}

const ProfileSetting = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileImage, setProfileImage] = useState<string>("/static/UserImg.png");
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  // Form data
  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    companyCountry: "",
    licenseNumber: "",
    directorName: "",
    documentType: "Passport",
    idNumber: "",
    pictureId: null as number | null,
  });

  // Document files state
  const [directorDocument, setDirectorDocument] = useState<DocumentFile>({
    file: null,
    documentId: null,
    prefilledUrl: null,
  });

  const [businessLicense, setBusinessLicense] = useState<DocumentFile>({
    file: null,
    documentId: null,
    prefilledUrl: null,
  });

  const [proofOfAddress, setProofOfAddress] = useState<DocumentFile>({
    file: null,
    documentId: null,
    prefilledUrl: null,
  });

  const [idProof, setIdProof] = useState<DocumentFile>({
    file: null,
    documentId: null,
    prefilledUrl: null,
  });

  const [passportPhoto, setPassportPhoto] = useState<DocumentFile>({
    file: null,
    documentId: null,
    prefilledUrl: null,
  });

  const [paymentDocuments, setPaymentDocuments] = useState<PaymentDocument[]>([
    { id: "payment_1", file: null, documentId: null, prefilledUrl: null },
  ]);

  // File input refs
  const directorDocRef = useRef<HTMLInputElement>(null);
  const businessLicenseRef = useRef<HTMLInputElement>(null);
  const proofOfAddressRef = useRef<HTMLInputElement>(null);
  const idProofRef = useRef<HTMLInputElement>(null);
  const passportPhotoRef = useRef<HTMLInputElement>(null);
  const paymentDocRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUserProfile();
      if (response.status && response.data) {
        const data = response.data;
        setProfile(data);

        setFormData({
          companyName: data.companyName || "",
          companyAddress: data.companyAddress || "",
          companyCountry: data.companyCountry || "",
          licenseNumber: data.licenseNumber || "",
          directorName: data.directorName || "",
          documentType: data.directorPassportId ? "Passport" : data.directorNationalId ? "National ID" : "Passport",
          idNumber: data.directorPassportId || data.directorNationalId || "",
          pictureId: data.pictureId || null,
        });

        // Set profile image
        if (data.pictureUrl) {
          setProfileImage(data.pictureUrl);
        } else if (data.pictureId) {
          const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
          setProfileImage(`${apiBaseUrl}/UploadDetails/GetDocument?documentId=${data.pictureId}`);
        }

        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

        if (data.directorPassportDocumentId) {
          setDirectorDocument(prev => ({
            ...prev,
            documentId: data.directorPassportDocumentId!,
            prefilledUrl: `${apiBaseUrl}/UploadDetails/GetDocument?documentId=${data.directorPassportDocumentId}`,
          }));
        } else if (data.directorNationalDocumentId) {
          setDirectorDocument(prev => ({
            ...prev,
            documentId: data.directorNationalDocumentId!,
            prefilledUrl: `${apiBaseUrl}/UploadDetails/GetDocument?documentId=${data.directorNationalDocumentId}`,
          }));
        }

        if (data.businessLicenseDocumentId) {
          setBusinessLicense(prev => ({
            ...prev,
            documentId: data.businessLicenseDocumentId!,
            prefilledUrl: `${apiBaseUrl}/UploadDetails/GetDocument?documentId=${data.businessLicenseDocumentId}`,
          }));
        }

        if (data.proofOfAddressDocumentId) {
          setProofOfAddress(prev => ({
            ...prev,
            documentId: data.proofOfAddressDocumentId!,
            prefilledUrl: `${apiBaseUrl}/UploadDetails/GetDocument?documentId=${data.proofOfAddressDocumentId}`,
          }));
        }

        if (data.identityProofDocumentId) {
          setIdProof(prev => ({
            ...prev,
            documentId: data.identityProofDocumentId!,
            prefilledUrl: `${apiBaseUrl}/UploadDetails/GetDocument?documentId=${data.identityProofDocumentId}`,
          }));
        }

        if (data.paymentDocumentIds && data.paymentDocumentIds.length > 0) {
          setPaymentDocuments(
            data.paymentDocumentIds.map((docId: number, index: number) => ({
              id: `payment_${index + 1}`,
              file: null,
              documentId: docId,
              prefilledUrl: `${apiBaseUrl}/UploadDetails/GetDocument?documentId=${docId}`,
            }))
          );
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileImageClick = () => {
    profileImageInputRef.current?.click();
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Store previous image for rollback if upload fails
    const previousImage = profileImage;

    // Immediately show local preview
    const localPreviewUrl = URL.createObjectURL(file);
    setProfileImage(localPreviewUrl);

    try {
      setUploading(true);
      // Only upload document, don't call updateUserProfile - that will happen on save
      const pictureId = await userApi.uploadDocument(file);

      // Store the pictureId for later save
      setFormData(prev => ({ ...prev, pictureId }));
      toast.success("Profile picture uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      // Revert to previous image on error
      setProfileImage(previousImage);
      URL.revokeObjectURL(localPreviewUrl);
      toast.error(error?.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const handleDocumentUpload = async (
    file: File | null,
    setter: React.Dispatch<React.SetStateAction<DocumentFile>>,
    currentState: DocumentFile
  ): Promise<number | null> => {
    if (!file) return null;

    // Store previous state for rollback
    const previousState = { ...currentState };

    // Immediately show local preview
    const localPreviewUrl = URL.createObjectURL(file);
    setter({ file, documentId: null, prefilledUrl: localPreviewUrl });

    try {
      const documentId = await userApi.uploadDocument(file);
      // Update with actual document ID after success
      setter(prev => ({ ...prev, documentId }));
      URL.revokeObjectURL(localPreviewUrl);
      toast.success("Document uploaded successfully");
      return documentId;
    } catch (error: any) {
      console.error("Error uploading document:", error);
      // Revert to previous state on error
      setter(previousState);
      URL.revokeObjectURL(localPreviewUrl);
      toast.error(error?.response?.data?.message || "Failed to upload document");
      return null;
    }
  };

  const handlePaymentDocUpload = async (paymentId: string, file: File | null) => {
    if (!file) return;

    // Store previous state for rollback
    const previousDoc = paymentDocuments.find(doc => doc.id === paymentId);
    const previousState = previousDoc ? { ...previousDoc } : null;

    // Immediately show local preview
    const localPreviewUrl = URL.createObjectURL(file);
    setPaymentDocuments(prev =>
      prev.map(doc =>
        doc.id === paymentId ? { ...doc, file, prefilledUrl: localPreviewUrl, documentId: null } : doc
      )
    );

    try {
      const documentId = await userApi.uploadDocument(file);
      // Update with actual document ID after success
      setPaymentDocuments(prev =>
        prev.map(doc =>
          doc.id === paymentId ? { ...doc, documentId } : doc
        )
      );
      URL.revokeObjectURL(localPreviewUrl);
      toast.success("Payment document uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading payment document:", error);
      // Revert to previous state on error
      if (previousState) {
        setPaymentDocuments(prev =>
          prev.map(doc =>
            doc.id === paymentId ? previousState : doc
          )
        );
      }
      URL.revokeObjectURL(localPreviewUrl);
      toast.error(error?.response?.data?.message || "Failed to upload payment document");
    }
  };

  const addPaymentDocument = () => {
    const newId = `payment_${Date.now()}`;
    setPaymentDocuments(prev => [
      ...prev,
      { id: newId, file: null, documentId: null, prefilledUrl: null },
    ]);
  };

  const removePaymentDocument = (id: string) => {
    if (paymentDocuments.length > 1) {
      setPaymentDocuments(prev => prev.filter(doc => doc.id !== id));
    } else {
      setPaymentDocuments([{ id: "payment_1", file: null, documentId: null, prefilledUrl: null }]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSavingSection("all");

      // Build complete payload - send null for empty fields, send value for filled fields
      const updateData: any = {
        companyName: formData.companyName || null,
        companyAddress: formData.companyAddress || null,
        companyCountry: formData.companyCountry || null,
        licenseNumber: formData.licenseNumber || null,
        directorName: formData.directorName || null,
        directorPassportId: null,
        directorPassportDocumentId: null,
        directorNationalId: null,
        directorNationalDocumentId: null,
        businessLicenseDocumentId: businessLicense.documentId || null,
        proofOfAddressDocumentId: proofOfAddress.documentId || null,
        identityProofDocumentId: idProof.documentId || null,
        pictureId: formData.pictureId || passportPhoto.documentId || null,
        paymentDocumentIds: [],
      };

      // Set director document based on document type
      if (formData.documentType === "Passport") {
        updateData.directorPassportId = formData.idNumber || null;
        updateData.directorPassportDocumentId = directorDocument.documentId || null;
      } else {
        updateData.directorNationalId = formData.idNumber || null;
        updateData.directorNationalDocumentId = directorDocument.documentId || null;
      }

      // Collect payment document IDs (filter out nulls)
      const paymentIds = paymentDocuments
        .map(doc => doc.documentId)
        .filter((id): id is number => id !== null);

      updateData.paymentDocumentIds = paymentIds.length > 0 ? paymentIds : [];

      const response = await userApi.updateUserProfile(updateData);

      if (response.status) {
        toast.success("Profile updated successfully");
        await fetchUserProfile();
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingSection(null);
    }
  };

  if (loading && !profile) {
    return (
      <div className="font-inter p-4 md:p-6">
        <h1 className="text-[#C6A95F] text-2xl md:text-3xl font-semibold mb-6">
          Profile Settings
        </h1>
        <div className="bg-[#353535] rounded-lg p-6">
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter p-2 sm:p-4 md:p-6 w-full">
      <h1 className="text-[#C6A95F] text-2xl md:text-3xl font-semibold mb-6">
        Profile Settings
      </h1>

      <div className="bg-[#353535] rounded-lg p-4 sm:p-6 w-full max-w-4xl">
        {/* Profile Picture Section */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-[#C6A95F]"
              onError={(e) => {
                e.currentTarget.src = "/static/UserImg.png";
              }}
            />
            <button
              onClick={handleProfileImageClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 bg-[#C6A95F] p-1.5 sm:p-2 rounded-full hover:bg-[#b89a4f] transition-colors disabled:opacity-50 cursor-pointer"
              title="Change profile picture"
            >
              <Camera size={14} className="sm:hidden text-white" />
              <Camera size={18} className="hidden sm:block text-white" />
            </button>
            <input
              ref={profileImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Section 01 - Company Details */}
        <div className="flex">
          {/* Stepper Column */}
          <div className="flex flex-col items-center mr-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C6A95F] flex items-center justify-center text-black font-bold text-xs sm:text-sm shrink-0">
              01
            </div>
            <div className="w-px flex-1 border-l border-dashed border-white/50 my-2" />
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <h2 className="text-[#C6A95F] text-lg sm:text-xl font-semibold mb-4">Compony Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm mb-2">Compony Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Compony Name"
                  className="w-full max-w-md h-10 sm:h-11 bg-white rounded-md text-black px-3 sm:px-4 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-2">Compony Address</label>
                <input
                  type="text"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  placeholder="Compony Address"
                  className="w-full h-10 sm:h-11 bg-white rounded-md text-black px-3 sm:px-4 text-sm sm:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm mb-2">Country</label>
                  <input
                    type="text"
                    name="companyCountry"
                    value={formData.companyCountry}
                    onChange={handleInputChange}
                    placeholder="Country"
                    className="w-full h-10 sm:h-11 bg-white rounded-md text-black px-3 sm:px-4 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm mb-2">License No.</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="License No"
                    className="w-full h-10 sm:h-11 bg-white rounded-md text-black px-3 sm:px-4 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 02 - Director Details */}
        <div className="flex">
          {/* Stepper Column */}
          <div className="flex flex-col items-center mr-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C6A95F] flex items-center justify-center text-black font-bold text-xs sm:text-sm shrink-0">
              02
            </div>
            <div className="w-px flex-1 border-l border-dashed border-white/50 my-2" />
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <h2 className="text-[#C6A95F] text-lg sm:text-xl font-semibold mb-4">Director Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm mb-2">Director Name</label>
                <input
                  type="text"
                  name="directorName"
                  value={formData.directorName}
                  onChange={handleInputChange}
                  placeholder="Director Name"
                  className="w-full max-w-md h-10 sm:h-11 bg-white rounded-md text-black px-3 sm:px-4 text-sm sm:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm mb-2">Select Document</label>
                  <Select
                    value={formData.documentType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, documentType: value }))}
                  >
                    <SelectTrigger className="w-full h-10 sm:h-11 bg-white text-black rounded-md border-0 text-sm sm:text-base">
                      <SelectValue placeholder="Select Document" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Passport">Passport</SelectItem>
                      <SelectItem value="National ID">National ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-white text-sm mb-2">Id Number</label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    placeholder="I'd Number"
                    className="w-full h-10 sm:h-11 bg-white rounded-md text-black px-3 sm:px-4 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm mb-2">Upload Document</label>
                <input
                  ref={directorDocRef}
                  type="file"
                  className="hidden"
                  accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={async (e) => {
                    const file = e.target.files?.[0] ?? null;
                    if (file) await handleDocumentUpload(file, setDirectorDocument, directorDocument);
                  }}
                />
                <UploadBox
                  id="director_doc"
                  file={directorDocument.file}
                  prefilledUrl={directorDocument.prefilledUrl}
                  onClick={() => directorDocRef.current?.click()}
                  onDrop={async (e) => {
                    e.preventDefault();
                    const file = e.dataTransfer?.files?.[0] ?? null;
                    if (file) await handleDocumentUpload(file, setDirectorDocument, directorDocument);
                  }}
                  onRemove={() => setDirectorDocument({ file: null, documentId: null, prefilledUrl: null })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 03 - Document Uploads */}
        <div className="flex">
          {/* Stepper Column */}
          <div className="flex flex-col items-center mr-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C6A95F] flex items-center justify-center text-black font-bold text-xs sm:text-sm shrink-0">
              03
            </div>
            <div className="w-px flex-1 border-l border-dashed border-white/50 my-2" />
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <h2 className="text-[#C6A95F] text-lg sm:text-xl font-semibold mb-4">Document Uploads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Business License */}
                <div>
                  <label className="block text-white text-sm mb-2">Business License</label>
                  <input
                    ref={businessLicenseRef}
                    type="file"
                    className="hidden"
                    accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={async (e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (file) await handleDocumentUpload(file, setBusinessLicense, businessLicense);
                    }}
                  />
                  <UploadBox
                    id="business_license"
                    file={businessLicense.file}
                    prefilledUrl={businessLicense.prefilledUrl}
                    onClick={() => businessLicenseRef.current?.click()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const file = e.dataTransfer?.files?.[0] ?? null;
                      if (file) await handleDocumentUpload(file, setBusinessLicense, businessLicense);
                    }}
                    onRemove={() => setBusinessLicense({ file: null, documentId: null, prefilledUrl: null })}
                  />
                </div>

                {/* Proof of Address */}
                <div>
                  <label className="block text-white text-sm mb-2">Proof of Address</label>
                  <input
                    ref={proofOfAddressRef}
                    type="file"
                    className="hidden"
                    accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={async (e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (file) await handleDocumentUpload(file, setProofOfAddress, proofOfAddress);
                    }}
                  />
                  <UploadBox
                    id="proof_of_address"
                    file={proofOfAddress.file}
                    prefilledUrl={proofOfAddress.prefilledUrl}
                    onClick={() => proofOfAddressRef.current?.click()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const file = e.dataTransfer?.files?.[0] ?? null;
                      if (file) await handleDocumentUpload(file, setProofOfAddress, proofOfAddress);
                    }}
                    onRemove={() => setProofOfAddress({ file: null, documentId: null, prefilledUrl: null })}
                  />
                </div>

                {/* ID Proof */}
                <div>
                  <label className="block text-white text-sm mb-2">ID Proof</label>
                  <input
                    ref={idProofRef}
                    type="file"
                    className="hidden"
                    accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={async (e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (file) await handleDocumentUpload(file, setIdProof, idProof);
                    }}
                  />
                  <UploadBox
                    id="id_proof"
                    file={idProof.file}
                    prefilledUrl={idProof.prefilledUrl}
                    onClick={() => idProofRef.current?.click()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const file = e.dataTransfer?.files?.[0] ?? null;
                      if (file) await handleDocumentUpload(file, setIdProof, idProof);
                    }}
                    onRemove={() => setIdProof({ file: null, documentId: null, prefilledUrl: null })}
                  />
                </div>

                {/* Passport Size Photo */}
                <div>
                  <label className="block text-white text-sm mb-2">Passport Size Photo</label>
                  <input
                    ref={passportPhotoRef}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={async (e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (file) await handleDocumentUpload(file, setPassportPhoto, passportPhoto);
                    }}
                  />
                  <UploadBox
                    id="passport_photo"
                    file={passportPhoto.file}
                    prefilledUrl={passportPhoto.prefilledUrl}
                    onClick={() => passportPhotoRef.current?.click()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const file = e.dataTransfer?.files?.[0] ?? null;
                      if (file) await handleDocumentUpload(file, setPassportPhoto, passportPhoto);
                    }}
                    onRemove={() => setPassportPhoto({ file: null, documentId: null, prefilledUrl: null })}
                  />
                </div>
            </div>
          </div>
        </div>

        {/* Section 04 - Payment */}
        <div className="flex">
          {/* Stepper Column */}
          <div className="flex flex-col items-center mr-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C6A95F] flex items-center justify-center text-black font-bold text-xs sm:text-sm shrink-0">
              04
            </div>
            {/* No line after last step */}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h2 className="text-[#C6A95F] text-lg sm:text-xl font-semibold mb-4">Payment</h2>
            <div className="space-y-4">
              <p className="text-[#B3B3B3] text-xs sm:text-sm mb-4">
                Upload payment receipts or proof of payment documents. You can upload multiple documents.
              </p>

              <div className="space-y-4">
                {paymentDocuments.map((doc, index) => (
                  <div key={doc.id} className="relative">
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      <div className="flex-1 w-full">
                        <input
                          ref={(el) => {
                            paymentDocRefs.current[doc.id] = el;
                          }}
                          type="file"
                          className="hidden"
                          accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={async (e) => {
                            const file = e.target.files?.[0] ?? null;
                            if (file) await handlePaymentDocUpload(doc.id, file);
                          }}
                        />
                        <UploadBox
                          id={`payment_doc_${doc.id}`}
                          file={doc.file}
                          prefilledUrl={doc.prefilledUrl}
                          onClick={() => paymentDocRefs.current[doc.id]?.click()}
                          onDrop={async (e) => {
                            e.preventDefault();
                            const file = e.dataTransfer?.files?.[0] ?? null;
                            if (file) await handlePaymentDocUpload(doc.id, file);
                          }}
                          onRemove={() => removePaymentDocument(doc.id)}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 sm:mt-4">
                        {/* Cross/Remove Button */}
                        {(doc.file || doc.prefilledUrl || paymentDocuments.length > 1) && (
                          <button
                            type="button"
                            onClick={() => removePaymentDocument(doc.id)}
                            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-full transition-colors cursor-pointer"
                            title="Remove"
                          >
                            <X size={18} />
                          </button>
                        )}

                        {/* Add More Button - Only show on last item */}
                        {index === paymentDocuments.length - 1 && (
                          <button
                            type="button"
                            onClick={addPaymentDocument}
                            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#C6A95F] hover:bg-[#b89a4f] text-white rounded-full transition-colors cursor-pointer"
                            title="Add More"
                          >
                            <Plus size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={savingSection === "all"}
                className="mt-6 w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-[#C6A95F] text-white rounded-md hover:bg-[#b89a4f] transition-colors disabled:opacity-50 cursor-pointer font-semibold text-sm sm:text-base"
              >
                {savingSection === "all" ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
