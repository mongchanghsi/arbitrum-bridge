"use client";

import { useState } from "react";
import Button from "../Shared/Button";
import Card from "../Shared/Card";
import AmountInput from "../Shared/Input";
import StatusStep from "../StatusStep";
import useBridge from "./useBridge";
import { getExplorerUrl } from "@/app/lib/url";

const Bridge = () => {
  const { bridgeWithProxy, statusSteps, parentTxnHash, childTxnHash } =
    useBridge();
  const [amount, setAmount] = useState("");

  const handleBridge = async () => {
    if (!amount) return;
    await bridgeWithProxy(amount);
  };

  const handleMax = () => {
    setAmount("1"); // for now
  };

  if (childTxnHash) {
    return (
      <Card>
        <div className="flex w-full flex-col gap-4 items-center">
          <p className="text-sm text-white/80">
            Successfully bridged {amount}ETH to Arbitrum Sepolia
          </p>

          <a
            href={getExplorerUrl(parentTxnHash, "tx", "sepolia")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-white/20"
          >
            View Ethereum Transaction
          </a>

          <a
            href={getExplorerUrl(childTxnHash, "tx", "arbitrumSepolia")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-white/20"
          >
            View Arbitrum Transaction
          </a>
        </div>
      </Card>
    );
  }

  if (statusSteps.length > 0) {
    return (
      <Card>
        <div className="flex w-full flex-col gap-4 items-center">
          <p className="text-sm text-white/80">
            Bridging {amount}ETH from Ethereum Sepolia to Arbitrum Sepolia
          </p>
          <StatusStep steps={statusSteps} />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white/70">
              Amount (ETH)
            </label>

            <button
              type="button"
              onClick={handleMax}
              className="text-xs font-semibold text-white/70 hover:text-white transition"
            >
              MAX
            </button>
          </div>

          <AmountInput value={amount} onChange={setAmount} />
        </div>

        <button
          onClick={handleBridge}
          type="button"
          className="w-full rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-white/20 active:scale-[0.99] cursor-pointer"
        >
          Bridge Now
        </button>
      </div>
    </Card>
  );
};

export default Bridge;
