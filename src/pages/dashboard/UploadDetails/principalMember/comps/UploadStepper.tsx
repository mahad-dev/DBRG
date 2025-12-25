interface UploadStepperProps {
  currentStep: number;
  totalSteps: number;
}

export default function UploadStepper({
  currentStep,
  totalSteps,
}: UploadStepperProps) {
  return (
    <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
      {/* Title */}
      <h2 className="font-inter font-semibold text-[28px] md:text-[38px] leading-none text-[#C6A95F] min-w-[200px] md:w-90">
        Upload Details
      </h2>

      {/* Stepper */}
      <div className="flex items-center justify-between w-full">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const step = idx + 1;
          const isActive = step === currentStep;

          return (
            <div key={idx} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={`
                  flex items-center justify-center rounded-full shrink-0
                  font-gilory font-semibold
                  w-7 h-7 text-xs
                  sm:w-8 sm:h-8 sm:text-sm
                  md:w-10 md:h-10 md:text-[16px]
                  ${
                    isActive
                      ? "bg-[#C6A95F] text-black"
                      : "text-white border border-dashed border-white"
                  }
                `}
              >
                {step}
              </div>

              {/* Connector Line */}
              {step !== totalSteps && (
                <div className="flex-1 border-t border-dashed border-white mx-1 sm:mx-2"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
