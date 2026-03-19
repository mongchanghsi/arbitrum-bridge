import React from "react";

export enum STATUS {
  NOT_STARTED,
  LOADING,
  COMPLETED,
  FAILED,
}

export type StatusStepType = {
  description: string;
  status: STATUS;
  transactionHash?: string;
};

interface BridgeStatusStepsProps {
  steps: StatusStepType[];
}

const StatusIcon: React.FC<{ status: STATUS }> = ({ status }) => {
  if (status === STATUS.LOADING) {
    return (
      <div className="flex h-5 w-5 items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
      </div>
    );
  }

  const colorMap: Record<STATUS, string> = {
    [STATUS.NOT_STARTED]: "bg-white/30",
    [STATUS.COMPLETED]: "bg-emerald-400",
    [STATUS.FAILED]: "bg-red-400",
    [STATUS.LOADING]: "",
  };

  return (
    <div className="flex h-5 w-5 items-center justify-center">
      <div
        className={`h-2.5 w-2.5 rounded-full ${colorMap[status]} ${
          status === STATUS.COMPLETED
            ? "shadow-[0_0_8px_rgba(52,211,153,0.7)]"
            : status === STATUS.FAILED
              ? "shadow-[0_0_8px_rgba(248,113,113,0.6)]"
              : ""
        }`}
      />
    </div>
  );
};

const StatusStep: React.FC<BridgeStatusStepsProps> = ({ steps }) => {
  return (
    <div className="flex flex-col relative ml-3 gap-2">
      {steps.map((step, index) => {
        const isCompleted = step.status === STATUS.COMPLETED;

        return (
          <div key={index} className="flex items-start gap-0.5 relative">
            {/* Icon + Line */}
            <div className="flex flex-col items-center gap-0.5">
              <StatusIcon status={step.status} />

              {index < steps.length - 1 && (
                <div
                  className={`w-px flex-1 mt-1 mb-1 ${
                    isCompleted ? "bg-emerald-400/40" : "bg-white/20"
                  }`}
                  style={{ minHeight: "12px" }}
                />
              )}
            </div>

            {/* Text */}
            <div className="flex flex-col">
              <span
                className={`text-sm pt-0.5 ${
                  step.status === STATUS.NOT_STARTED
                    ? "text-white/50"
                    : step.status === STATUS.FAILED
                      ? "text-red-300"
                      : "text-white/90"
                }`}
              >
                {step.description}
              </span>

              {step.transactionHash && (
                <span className="text-xs text-white/40 break-all">
                  {step.transactionHash}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusStep;
