"use client";

import { useState } from "react";
import Card from "../Shared/Card";
import AmountInput from "../Shared/Input";
import StatusStep from "../StatusStep";
import useBridge from "./useBridge";
import { getExplorerUrl } from "@/app/lib/url";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import useGas from "@/app/lib/gas";

const Bridge = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
  });
  const {
    bridgeWithProxy,
    statusSteps,
    parentTxnHash,
    childTxnHash,
    getGasEstimate,
    clearData,
  } = useBridge();
  const { getGasPriceAsync } = useGas();
  const [amount, setAmount] = useState<string>("");

  const handleBridge = async () => {
    if (!amount) return;
    await bridgeWithProxy(amount);
  };

  const handleMax = async () => {
    if (!balance) return;

    const gasPrice = await getGasPriceAsync();

    const estimatedGas = await getGasEstimate(amount);

    if (!gasPrice || !estimatedGas) {
      const max = Math.max(Number(balance.formatted) - 0.0005, 0);
      setAmount(max.toFixed(6));
      return;
    }

    const gasCost = estimatedGas * gasPrice;

    const maxWei = balance.value - gasCost;

    if (maxWei <= 0n) {
      setAmount("0");
      return;
    }

    const maxEth = Number(formatEther(maxWei));

    setAmount(maxEth.toFixed(6));
  };

  const handleClear = () => {
    setAmount("");
    clearData();
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

          <button
            onClick={handleClear}
            type="button"
            className="w-full rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-white/20 active:scale-[0.99] cursor-pointer"
          >
            Bridge more
          </button>
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
