/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, type Abi } from "viem";
import { createConfig, getPublicClient } from "@wagmi/core";
import { arbitrumSepolia, sepolia } from "viem/chains";

type GetPastBridgeTransactionsParams = {
  contractAddress: `0x${string}`;
  abi: Abi;
  userAddress: `0x${string}`;
  fromBlock?: bigint;
  toBlock?: bigint | "latest";
  chainId?: number;
  eventName?: string;
};

const config = createConfig({
  chains: [sepolia, arbitrumSepolia],
  transports: {
    [sepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

export async function getPastBridgeTransactions({
  contractAddress,
  abi,
  userAddress,
  fromBlock = 0n,
  toBlock = "latest",
  chainId,
  eventName = "Bridged",
}: GetPastBridgeTransactionsParams) {
  const publicClient = getPublicClient(config, {
    chainId: chainId as any,
  });

  if (!publicClient) {
    return [];
  }

  try {
    const logs = await publicClient.getLogs({
      address: contractAddress,
      abi,
      eventName,
      args: {
        user: userAddress, // must match indexed event param name
      } as any,
      fromBlock,
      toBlock,
    });

    return logs.map((log: any) => ({
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      args: log.args,
    }));
  } catch (error) {
    console.error("Failed to fetch past bridge transactions:", error);
    return [];
  }
}
