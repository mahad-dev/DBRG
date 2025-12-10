import React, { useRef, useState } from "react";
import UploadBox from "@/components/custom/ui/UploadBox";
import { Button } from "@/components/ui/button";
import { useStep6RequiredDocuments } from "@/hooks/useStep6RequiredDocuments";
import ServiceCheckbox from "@/components/custom/ui/ServiceCheckbox";

export default function Step6RequiredDocumentChecklist({
  onNext,
  onBack,
}: {
  onNext?: () => void;
  onBack?: () => void;
}) {
  const {
    items,
    checked,
    files,
    otherForms,
    refs,
    setItemChecked,
    setItemFile,
    removeItemFile,
    addOtherForm,
    updateOtherFormName,
    setOtherFormFile,
    handleSelectFile,
    handleDropFile,
  } = useStep6RequiredDocuments();

  const [selectedDocType, setSelectedDocType] = useState<string>(""); // radio toggle state
  const otherRefs = useRef<Record<string, HTMLInputElement | null>>({}); // refs for other forms

  return (
    <div className="w-full min-h-screen bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg text-white font-gilroy">
      <h2 className="text-[30px] sm:text-[22px] font-bold text-[#C6A95F] leading-[100%] mb-6">
        Section 6 – Required Document Checklist
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {items.map((it) => (
          <div key={it.id} className="flex gap-4 items-start">
            <div className="flex flex-col w-full">
              <ServiceCheckbox
                id={it.id}
                label={it.label}
                checked={!!checked[it.id]}
                onChange={() => setItemChecked(it.id, !checked[it.id])}
              />

              <div className="mt-2 w-full md:w-[420px]">
                <input
                  ref={refs[it.id]}
                  type="file"
                  className="hidden"
                  accept="application/pdf,image/*"
                  onChange={(e) =>
                    handleSelectFile(e, (f) => setItemFile(it.id, f))
                  }
                />

                <UploadBox
                  id={`upload_${it.id}`}
                  file={files[it.id]}
                  onClick={() => refs[it.id]?.current?.click()}
                  onDrop={(e: React.DragEvent) =>
                    handleDropFile(e, (f) => setItemFile(it.id, f))
                  }
                  onRemove={() => removeItemFile(it.id)}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Other Forms Radio */}

        <div
          className="flex items-center gap-2 mb-4 cursor-pointer"
          onClick={() =>
            setSelectedDocType((prev) =>
              prev === "otherForms" ? "" : "otherForms"
            )
          }
        >
          <div
            className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${
              selectedDocType === "otherForms"
                ? "bg-[#353535] border-[#C6A95F]"
                : "border-[#C6A95F] bg-transparent"
            }`}
          >
            {selectedDocType === "otherForms" && (
              <span className="w-3 h-3 ml-[0.5px] bg-[#C6A95F] rounded-full"></span>
            )}
          </div>
          <span className="text-[20px] font-medium">Other Forms</span>
        </div>

        {/* Other Forms Section */}
        {selectedDocType === "otherForms" && (
          <div className="space-y-4">
            {/* Forms List (One per line) */}
            <div className="space-y-4">
              {otherForms.map((of) => (
                <div
                  key={of.id}
                  className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-transparent p-3 rounded-md"
                >
                  {/* Form Name Input */}
                  <input
                    type="text"
                    value={of.name}
                    onChange={(e) => updateOtherFormName(of.id, e.target.value)}
                    placeholder="Form Name"
                    className="bg-white text-black rounded-md px-4 py-2 w-full sm:w-60 h-[45px]"
                  />

                  {/* Upload Box */}
                  <div className="w-full sm:flex-1">
                    <input
                      ref={(el) => {
                        otherRefs.current[of.id] = el;
                      }}
                      type="file"
                      className="hidden"
                      accept="application/pdf,image/*"
                      onChange={(e) =>
                        handleSelectFile(e, (f) => setOtherFormFile(of.id, f))
                      }
                    />

                    <UploadBox
                      id={`other_${of.id}`}
                      file={of.file}
                      onClick={() => otherRefs.current[of.id]?.click()}
                      onDrop={(e: React.DragEvent) =>
                        handleDropFile(e, (f) => setOtherFormFile(of.id, f))
                      }
                      onRemove={() => setOtherFormFile(of.id, null)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Button */}
            <Button
              onClick={() => addOtherForm("")}
              variant={'site_btn'}
              className="px-6 py-3 rounded-md w-full sm:w-auto"
            >
              Add Form
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 flex justify-start gap-4">
          {onBack && (
            <Button
              onClick={onBack}
              className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white font-gilroySemiBold"
            >
              Back
            </Button>
          )}

          {onNext && (
            <Button
              onClick={onNext}
              variant="site_btn"
              className="w-[132px] h-[42px] rounded-[10px] text-white font-gilroySemiBold"
            >
              Save / Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
