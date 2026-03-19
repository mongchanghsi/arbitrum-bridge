"use client";

import { useAccount } from "wagmi";
import Bridge from "../Bridge";
import Card from "../Shared/Card";

const Welcome = () => {
  const { address } = useAccount();

  return address ? (
    <div>
      <Bridge />
    </div>
  ) : (
    <Card>
      <h1 className="text-3xl font-bold text-white tracking-tight">
        Arbitrum Bridge
      </h1>
      <p className="text-sm text-white/80">
        Portal to help you bridge Ethereum Sepolia to Arbitrum Sepolia.
      </p>
      <p className="text-sm text-white/60">
        Connect your wallet to get started
      </p>
    </Card>
  );
};

export default Welcome;
