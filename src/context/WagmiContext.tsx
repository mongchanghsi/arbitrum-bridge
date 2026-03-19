"use client";

import { wagmiAdapter, projectId, networks } from "../config/ReownConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { arbitrumSepolia, sepolia } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "Arbitrum Bridge",
  description: "Arbitrum Bridge",
  url: "https://appkitexampleapp.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [arbitrumSepolia, sepolia],
  defaultNetwork: sepolia,
  defaultAccountTypes: { eip155: "eoa" },
  metadata: metadata,
  features: {
    analytics: false,
    swaps: false,
    onramp: false,
    connectMethodsOrder: ["wallet"],
  },
  debug: false,
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies,
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
