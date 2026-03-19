"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

const WalletButton = () => {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();

  if (isConnected) return <appkit-button />;

  return (
    <button
      type="button"
      onClick={() => open()}
      className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white shadow-xl backdrop-blur-md transition hover:bg-white/15 active:scale-[0.98] cursor-pointer"
    >
      Connect Wallet
    </button>
  );
};

export default WalletButton;
