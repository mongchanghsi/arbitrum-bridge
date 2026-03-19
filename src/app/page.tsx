"use client";

import LiquidEther from "./components/Shared/Background/LiquidEther";
import WalletButton from "./components/Shared/WalletButton";
import Welcome from "./components/Welcome";

export default function Home() {
  return (
    <div className="w-screen h-screen relative">
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <div className="absolute inset-0 z-1 flex items-center justify-center">
        <Welcome />
      </div>

      <div className="absolute z-2 top-10 right-10">
        <WalletButton />
      </div>
    </div>
  );
}
