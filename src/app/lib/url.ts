type ExplorerType = "tx" | "address";

type Network = "mainnet" | "sepolia" | "arbitrum" | "arbitrumSepolia";

const EXPLORER_BASE: Record<Network, string> = {
  mainnet: "https://etherscan.io",
  sepolia: "https://sepolia.etherscan.io",
  arbitrum: "https://arbiscan.io",
  arbitrumSepolia: "https://sepolia.arbiscan.io",
};

export const getExplorerUrl = (
  hashOrAddress: string,
  type: ExplorerType,
  network: Network = "mainnet",
): string => {
  const base = EXPLORER_BASE[network];

  return `${base}/${type}/${hashOrAddress}`;
};
