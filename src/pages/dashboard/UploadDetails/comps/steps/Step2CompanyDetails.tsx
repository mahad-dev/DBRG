"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadBox from "@/components/custom/ui/UploadBox";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import ServiceCheckbox from "@/components/custom/ui/ServiceCheckbox";
import { useStep2CompanyDetails } from "@/hooks/useStep2CompanyDetails";

interface StepProps {
  onNext?: () => void;
  onBack?: () => void;
}

export default function Step2CompanyDetails({ onNext, onBack }: StepProps) {
  const {
    form,
    setField,

    uploadBoxes,
    fileRefs,
    handleSelectFile,
    handleDropFile,
    removeFile,

    shareholders,
    shareholderRefs,
    addShareholder,
    removeShareholder,
    setShareholderField,
    handleShareholderFile,

    ubos,
    uboRefs,
    addUbo,
    removeUbo,
    setUboField,
    handleUboFile,

    directors,
    addDirector,
    removeDirector,
    setDirectorField,
  } = useStep2CompanyDetails();

  return (
    <div className="w-full bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg min-h-screen text-white">
      <h2 className="text-[30px] sm:text-[22px] font-bold text-[#C6A95F]">
        Section 2 - Company Details
      </h2>

      {/* -------------------------------------- */}
      {/* Row: Legal Entity Name + Entity Type */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Legal Entity Name</Label>
          <Input
            type="text"
            value={form.legalEntityName}
            onChange={(e) => setField("legalEntityName", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Legal Entity Name"
          />
        </div>

        <div>
          <Label>Entity Legal Type</Label>
          <Select
            value={form.entityType}
            onValueChange={(value) => setField("entityType", value)}
          >
            <SelectTrigger className="w-full mt-2 bg-white h-[42px] text-black border-gray-300 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Entity Legal Type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="LLC">LLC</SelectItem>
              <SelectItem value="Sole">Sole Proprietorship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Row: Trade License No + Licensing Authority */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Trade License / Registration No</Label>
          <Input
            type="text"
            value={form.tradeLicenseNo}
            onChange={(e) => setField("tradeLicenseNo", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Trade License/Registration No"
          />
        </div>

        <div>
          <Label>Licensing Authority</Label>
          <Input
            type="text"
            value={form.licensingAuthority}
            onChange={(e) => setField("licensingAuthority", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Licensing Authority"
          />
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Upload Trade License */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>Upload Trade License</Label>

        <input
          ref={fileRefs.licenseRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, "tradeLicense")}
        />

        <UploadBox
          title="Drag And Drop or Select"
          file={uploadBoxes.tradeLicense}
          onClick={() => fileRefs.licenseRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "tradeLicense")}
          onRemove={() => removeFile("tradeLicense")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* Row: Issuance + Expiry */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Date of Issuance</Label>
          <Input
            type="text"
            value={form.dateIssued}
            onChange={(e) => setField("dateIssued", e.target.value)}
            placeholder="DD/MM/YYYY"
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          />
        </div>

        <div>
          <Label>Date of Expiry</Label>
          <Input
            type="text"
            value={form.dateExpiry}
            onChange={(e) => setField("dateExpiry", e.target.value)}
            placeholder="DD/MM/YYYY"
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          />
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Row: Country of Incorporation + Date of Incorporation */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Country of Incorporation</Label>
          <Input
            type="text"
            value={form.country}
            onChange={(e) => setField("country", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Dubai"
          />
        </div>

        <div>
          <Label>Date of Incorporation</Label>
          <Input
            type="text"
            value={form.dateIncorp}
            onChange={(e) => setField("dateIncorp", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="DD/MM/YYYY"
          />
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Upload Certificate of Incorporation */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>Upload Certificate of Incorporation</Label>

        <input
          ref={fileRefs.coiRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, "coi")}
        />

        <UploadBox
          title="Drag And Drop or Select"
          file={uploadBoxes.coi}
          onClick={() => fileRefs.coiRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "coi")}
          onRemove={() => removeFile("coi")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* Passport ID + Upload Passport */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>Passport ID</Label>
        <Input
          type="text"
          value={form.passportId}
          onChange={(e) => setField("passportId", e.target.value)}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="Enter Passport ID"
        />
      </div>

      <div className="mt-6">
        <Label>Upload Passport</Label>

        <input
          ref={fileRefs.passportRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, "passport")}
        />

        <UploadBox
          title="Drag And Drop or Select"
          file={uploadBoxes.passport}
          onClick={() => fileRefs.passportRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "passport")}
          onRemove={() => removeFile("passport")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* National ID + Upload National ID */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>National ID Number</Label>
        <Input
          type="text"
          value={form.nationalId}
          onChange={(e) => setField("nationalId", e.target.value)}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="National ID Number"
        />
      </div>

      <div className="mt-6">
        <Label>Upload National ID</Label>

        <input
          ref={fileRefs.nationalIdRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, "nationalId")}
        />

        <UploadBox
          title="Drag And Drop or Select"
          file={uploadBoxes.nationalId}
          onClick={() => fileRefs.nationalIdRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "nationalId")}
          onRemove={() => removeFile("nationalId")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* VAT Number + VAT Document */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>VAT Number</Label>
        <Input
          type="text"
          value={form.vatNumber}
          onChange={(e) => setField("vatNumber", e.target.value)}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="VAT Number"
        />
      </div>

      <div className="mt-6">
        <Label>Upload VAT Document</Label>

        <input
          ref={fileRefs.vatRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, "vatDoc")}
        />

        <UploadBox
          title="Upload VAT Document"
          file={uploadBoxes.vatDoc}
          onClick={() => fileRefs.vatRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "vatDoc")}
          onRemove={() => removeFile("vatDoc")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* Tax Registration Number + Document */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>Tax Registration Number</Label>
        <Input
          type="text"
          value={form.taxRegNumber}
          onChange={(e) => setField("taxRegNumber", e.target.value)}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="Tax Registration Number"
        />
      </div>

      <div className="mt-6">
        <Label>Upload Tax Registration Number Document</Label>

        <input
          ref={fileRefs.taxRegRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, "taxRegDoc")}
        />

        <UploadBox
          title="Upload Tax Registration Document"
          file={uploadBoxes.taxRegDoc}
          onClick={() => fileRefs.taxRegRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "taxRegDoc")}
          onRemove={() => removeFile("taxRegDoc")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* Website + Email + Phone */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div>
          <Label>Website</Label>
          <Input
            type="text"
            value={form.website}
            onChange={(e) => setField("website", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Website"
          />
        </div>

        <div>
          <Label>Email (Official)</Label>
          <Input
            type="text"
            value={form.emailOfficial}
            onChange={(e) => setField("emailOfficial", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Email"
          />
        </div>

        <div>
          <Label>Phone Number</Label>
          <Input
            type="text"
            value={form.phoneNumber}
            onChange={(e) => setField("phoneNumber", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Phone Number"
          />
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Primary Contact Person */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Primary Contact – Name</Label>
          <Input
            type="text"
            value={form.primaryContactName}
            onChange={(e) => setField("primaryContactName", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Primary Contact – Name"
          />
        </div>

        <div>
          <Label>Primary Contact – Designation</Label>
          <Input
            type="text"
            value={form.primaryContactDesignation}
            onChange={(e) => setField("primaryContactDesignation", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Primary Contact – Designation"
          />
        </div>
      </div>

      <div className="mt-6">
        <Label>Primary Contact – Email</Label>
        <Input
          type="text"
          value={form.primaryContactEmail}
          onChange={(e) => setField("primaryContactEmail", e.target.value)}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="Primary Contact – Email"
        />
      </div>

      {/* -------------------------------------- */}
      {/* Registered Address + Upload Address Proof */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>Registered Office Address in UAE</Label>
        <Input
          type="text"
          value={form.registeredOfficeAddress}
          onChange={(e) => setField("registeredOfficeAddress", e.target.value)}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="Registered Office Address in UAE"
        />
      </div>

      <div className="mt-6">
        <Label>Upload Address Proof</Label>

        <input
          ref={fileRefs.addressProofRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, "addressProof")}
        />

        <UploadBox
          title="Upload Address Proof"
          file={uploadBoxes.addressProof}
          onClick={() => fileRefs.addressProofRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "addressProof")}
          onRemove={() => removeFile("addressProof")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* SHAREHOLDERS SECTION */}
      {/* -------------------------------------- */}

      <h3 className="text-[22px] mt-10 mb-4 font-bold text-[#C6A95F]">
        Ownership and Management Details
      </h3>

      <div className="mt-6">
        <h4 className="font-bold text-[20px] text-white">a. Shareholder Details</h4>
      </div>

      {shareholders.map((s, index) => (
        <div key={index} className="mt-6 border border-gray-600 rounded-lg p-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={s.fullName}
                onChange={(e) =>
                  setShareholderField(index, "fullName", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>

            <div>
              <Label>Shareholding (%)</Label>
              <Input
                type="text"
                value={s.percentage}
                onChange={(e) =>
                  setShareholderField(index, "percentage", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>

            <div>
              <Label>Nationality / Country of Incorporation</Label>
              <Input
                type="text"
                value={s.nationality}
                onChange={(e) =>
                  setShareholderField(index, "nationality", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label>Address</Label>
            <Input
              type="text"
              value={s.address}
              onChange={(e) =>
                setShareholderField(index, "address", e.target.value)
              }
              className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
            />
          </div>

          {/* Upload Proof */}
          <div className="mt-4">
            <Label>Upload Shareholding Proof</Label>

            <input
              ref={(el) => {
                if (el) {
                  shareholderRefs.current.set(index, el);
                } else {
                  shareholderRefs.current.delete(index);
                }
              }}
              type="file"
              className="hidden"
              onChange={(e) =>
                handleShareholderFile(index, e.target.files?.[0] ?? null)
              }
            />

            <UploadBox
              title="Upload Proof"
              file={s.proofFile}
              onClick={() => shareholderRefs.current.get(index)?.click()}
              onDrop={(e) => {
                e.preventDefault();
                handleShareholderFile(
                  index,
                  e.dataTransfer?.files?.[0] ?? null
                );
              }}
              onRemove={() => handleShareholderFile(index, null)}
            />
          </div>

          <Button
            className="mt-4 border cursor-pointer border-red-400 text-red-400"
            onClick={() => removeShareholder(index)}
          >
            Remove Shareholder
          </Button>
        </div>
      ))}

      <Button
        onClick={addShareholder}
        className="mt-4 border cursor-pointer border-white text-white"
      >
        Add Shareholder
      </Button>

      {/* -------------------------------------- */}
      {/* UBO SECTION */}
      {/* -------------------------------------- */}
      <h4 className="font-bold text-[20px] mt-10 text-white">
        b. Ultimate Beneficial Owner (UBO) Details
      </h4>

      {ubos.map((u, index) => (
        <div key={index} className="mt-6 border border-gray-600 rounded-lg p-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={u.fullName}
                onChange={(e) =>
                  setUboField(index, "fullName", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>

            <div>
              <Label>Shareholding (%)</Label>
              <Input
                type="text"
                value={u.percentage}
                onChange={(e) =>
                  setUboField(index, "percentage", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>

            <div>
              <Label>Nationality</Label>
              <Input
                type="text"
                value={u.nationality}
                onChange={(e) =>
                  setUboField(index, "nationality", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label>Address</Label>
            <Input
              type="text"
              value={u.address}
              onChange={(e) => setUboField(index, "address", e.target.value)}
              className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
            />
          </div>

          {/* Upload UBO Confirmation */}
          <div className="mt-4">
            <Label>Upload UBO Confirmation</Label>

            <input
              ref={(el) => {
                if (el) {
                  uboRefs.current.set(index, el);
                } else {
                  uboRefs.current.delete(index);
                }
              }}
              type="file"
              className="hidden"
              onChange={(e) =>
                handleUboFile(index, e.target.files?.[0] ?? null)
              }
            />

            <UploadBox
              title="Upload UBO Confirmation"
              file={u.confirmationFile}
              onClick={() => uboRefs.current.get(index)?.click()}
              onDrop={(e) => {
                e.preventDefault();
                handleUboFile(index, e.dataTransfer.files?.[0] ?? null);
              }}
              onRemove={() => handleUboFile(index, null)}
            />
          </div>

          <Button
            className="mt-4 border cursor-pointer border-red-400 text-red-400"
            onClick={() => removeUbo(index)}
          >
            Remove UBO
          </Button>
        </div>
      ))}

      <Button
        onClick={addUbo}
        className="mt-4 border cursor-pointer border-white text-white"
      >
        Add UBO
      </Button>

      {/* -------------------------------------- */}
      {/* DIRECTORS SECTION */}
      {/* -------------------------------------- */}
      <h4 className="font-bold text-[20px] mt-10 text-white">
        c. Director Details
      </h4>

      {directors.map((d, index) => (
        <div key={index} className="mt-6 border border-gray-600 rounded-lg p-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={d.fullName}
                onChange={(e) =>
                  setDirectorField(index, "fullName", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>

            <div>
              <Label>Date of Appointment</Label>
              <Input
                type="text"
                value={d.dateOfAppointment}
                onChange={(e) =>
                  setDirectorField(index, "dateOfAppointment", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="DD/MM/YYYY"
              />
            </div>

            <div>
              <Label>Nationality</Label>
              <Input
                type="text"
                value={d.nationality}
                onChange={(e) =>
                  setDirectorField(index, "nationality", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label>Address</Label>
            <Input
              type="text"
              value={d.address}
              onChange={(e) => setDirectorField(index, "address", e.target.value)}
              className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
            />
          </div>

          <Button
            className="mt-4 border cursor-pointer border-red-400 text-red-400"
            onClick={() => removeDirector(index)}
          >
            Remove Director
          </Button>
        </div>
      ))}

      <Button
        onClick={addDirector}
        className="mt-4 border cursor-pointer border-white text-white"
      >
        Add Director
      </Button>

      {/* -------------------------------------- */}
      {/* PEP Questions */}
      {/* -------------------------------------- */}
      <h4 className="font-bold text-[20px] mt-10 mb-3 text-white">
        d. Is any shareholder, director, UBO a Politically Exposed Person?
      </h4>
      <YesNoGroup
        value={form.pepShareholders}
        onChange={(v) => setField("pepShareholders", v)}
      />

      <h4 className="font-bold text-[20px] mt-10 mb-3 text-white">
        e. Is any shareholder / beneficial owner / key managerial person related to a PEP?
      </h4>
      <YesNoGroup
        value={form.pepBeneficialOwners}
        onChange={(v) => setField("pepBeneficialOwners", v)}
      />

      <h4 className="font-bold text-[20px] mt-10 mb-3 text-white">
        f. Does your establishment check to identify PEP customers?
      </h4>
      <YesNoGroup
        value={form.pepCustomers}
        onChange={(v) => setField("pepCustomers", v)}
      />

      {/* -------------------------------------- */}
      {/* Trade Association */}
      {/* -------------------------------------- */}
      <h4 className="font-bold text-[22px] mt-10 text-[#C6A95F]">
        Membership of Trade Association
      </h4>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div>
          <Label>Name of Trade Association</Label>
          <Input
            type="text"
            value={form.tradeAssociationName}
            onChange={(e) => setField("tradeAssociationName", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
          />
        </div>

        <div>
          <Label>Name of Member</Label>
          <Input
            type="text"
            value={form.tradeAssociationMember}
            onChange={(e) => setField("tradeAssociationMember", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
          />
        </div>

        <div>
          <Label>Date of Appointment</Label>
          <Input
            type="text"
            value={form.tradeAssociationDate}
            onChange={(e) => setField("tradeAssociationDate", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="DD/MM/YYYY"
          />
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Accreditations */}
      {/* -------------------------------------- */}
      <h4 className="mt-10 text-[20px] font-bold text-white">
        Recognized Accreditations (Select all that apply)
      </h4>

      <div className="mt-4 grid gap-3">
        {[
          ["lbma", "LBMA – London Good Delivery"],
          ["dmccDgd", "DMCC – Dubai Gold Delivery (DGD)"],
          ["dmccMdb", "DMCC – Market Deliverable Brand (MDB)"],
          ["rjc", "RJC – Responsible Jewellery Council Certification"],
          ["iages", "IAGES – Indian Association for Gold Excellence Standards"],
        ].map(([key, label]) => (
          <ServiceCheckbox
            key={key}
            label={label}
            checked={(form as any)[key]}
            onChange={() => setField(key as any, !(form as any)[key])}
          />
        ))}

        {/* Other */}
        <ServiceCheckbox
          label="Other (please specify)"
          checked={form.accreditationOther}
          onChange={() => setField("accreditationOther", !form.accreditationOther)}
        />

        {form.accreditationOther && (
          <Input
            type="text"
            value={form.accreditationOtherName}
            onChange={(e) => setField("accreditationOtherName", e.target.value)}
            className="w-full bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] mt-2 text-black placeholder:text-black/50"
            placeholder="Specify other accreditation"
          />
        )}
      </div>

      {/* Upload accreditation certificate */}
      <div className="mt-6">
        <Label>Copy of Valid Accreditation Certificate(s)</Label>

        <input
          ref={fileRefs.accreditationRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) =>
            handleSelectFile(e, "tradeAssociationCertificate")
          }
        />

        <UploadBox
          file={uploadBoxes.tradeAssociationCertificate}
          title="Upload Accreditation Certificates"
          onClick={() => fileRefs.accreditationRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "tradeAssociationCertificate")}
          onRemove={() => removeFile("tradeAssociationCertificate")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* Navigation Buttons */}
      {/* -------------------------------------- */}
      <div className="mt-10 flex justify-start gap-4">
        {onBack && (
          <Button
            onClick={onBack}
            className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white"
          >
            Back
          </Button>
        )}

        {onNext && (
          <Button
            onClick={onNext}
            variant="site_btn"
            className="w-[132px] h-[42px] rounded-[10px] text-white"
          >
            Save / Next
          </Button>
        )}
      </div>
    </div>
  );
}
