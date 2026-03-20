"use client";

import { useAccount, useClient, usePublicClient, useWalletClient } from "wagmi";
import { EthBridger, getArbitrumNetwork } from "@arbitrum/sdk";
import { useCallback, useState } from "react";
import { ethers } from "ethers";
import { parseEther } from "viem";
import { writeContract } from "viem/actions";
import { StatusStepType, STATUS } from "../StatusStep";
import { BridgeAbi } from "@/app/lib/abi/bridge";
import { wagmiAdapter } from "@/config/ReownConfig";
import { ParentTransactionReceipt, EthDepositMessage } from "@arbitrum/sdk";
import { ENVIRONMENT } from "@/config/Environment";
import useGas from "@/app/lib/gas";

const ARBITRUM_SEPOLIA_RPC_URL = ENVIRONMENT.ARBITRUM_SEPOLIA_RPC_URL;
const ETHEREUM_SEPOLIA_RPC_URL = ENVIRONMENT.ETHEREUM_SEPOLIA_RPC_URL;
const L1_PROXY_ADDRESS = ENVIRONMENT.L1_PROXY_ADDRESS;

function useBridge() {
  const { address, connector } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { estimateGasAsync } = useGas();
  const [statusSteps, setStatusSteps] = useState<StatusStepType[]>([]);
  const client = useClient({ config: wagmiAdapter.wagmiConfig });
  const [parentTxnHash, setParentTxnHash] = useState<string>("");
  const [childTxnHash, setChildTxnHash] = useState<string>("");

  const clearData = () => {
    setStatusSteps([]);
    setParentTxnHash("");
    setChildTxnHash("");
  };

  const getGasEstimate = async (amount: string) => {
    return await estimateGasAsync({
      address: L1_PROXY_ADDRESS,
      abi: BridgeAbi,
      functionName: "bridgeWithProxy",
      args: [],
      value: amount || "0.001",
    });
  };

  const updateStatus = (index: number, status: STATUS) => {
    setStatusSteps((prevState) =>
      prevState.map((step, i) => (i === index ? { ...step, status } : step)),
    );
  };

  const setFailStatus = () => {
    setStatusSteps((prevState) =>
      prevState.map((step) => {
        return {
          ...step,
          status: step.status === STATUS.LOADING ? STATUS.FAILED : step.status,
        };
      }),
    );
  };

  const bridgeWithSDK = useCallback(
    async (ethAmount: string) => {
      if (!address || !walletClient || !publicClient) {
        throw new Error("Wallet not connected");
      }

      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No injected Ethereum provider found");
      }

      const connectorName = connector?.name?.toLowerCase();

      if (
        connectorName?.includes("walletconnect") ||
        connectorName?.includes("phantom")
      ) {
        throw new Error("WalletConnect is not supported for this bridge.");
      }

      setStatusSteps([
        {
          description: "Approve bridge transaction",
          status: STATUS.LOADING,
        },
        {
          description: "Transaction pending on Ethereum",
          status: STATUS.NOT_STARTED,
        },
        {
          description: "Waiting for Arbitrum confirmation",
          status: STATUS.NOT_STARTED,
        },
      ]);

      const ethersProvider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any",
      );
      const ethSigner = ethersProvider.getSigner(address);

      const depositAmount = ethers.utils.parseEther(ethAmount);
      const childChainProvider = new ethers.providers.JsonRpcProvider(
        ARBITRUM_SEPOLIA_RPC_URL,
      );
      const childNetwork = await getArbitrumNetwork(childChainProvider);
      const ethBridger = new EthBridger(childNetwork);

      const ethDepositTxn = await ethBridger.deposit({
        amount: depositAmount,
        parentSigner: ethSigner,
      });

      updateStatus(0, STATUS.COMPLETED);
      updateStatus(1, STATUS.LOADING);

      const ethDepositReceipt = await ethDepositTxn.wait();
      console.log(
        "✅ Parent Transaction Hash: ",
        ethDepositReceipt.transactionHash,
      );
      setParentTxnHash(ethDepositReceipt.transactionHash);

      updateStatus(1, STATUS.COMPLETED);
      updateStatus(2, STATUS.LOADING);

      const arbiDepositTxn =
        await ethDepositReceipt.waitForChildTransactionReceipt(
          childChainProvider,
        );

      if (arbiDepositTxn.complete) {
        const arbiDepositReceipt = await arbiDepositTxn.message.wait();
        console.log(
          "✅ Child Transaction Hash: ",
          arbiDepositReceipt?.transactionHash,
        );
        setChildTxnHash(arbiDepositReceipt?.transactionHash || "");

        updateStatus(2, STATUS.COMPLETED);
      } else {
        console.error("❌ L2 retryable execution failed.");

        updateStatus(2, STATUS.FAILED);
      }
    },
    [address, walletClient],
  );

  const bridgeWithProxy = useCallback(
    async (ethAmount: string) => {
      try {
        if (!address || !walletClient) {
          console.log("Wallet not connected");
          return;
        }

        if (!client) {
          console.log("no client");
          return;
        }

        const l1Provider = new ethers.providers.JsonRpcProvider(
          ETHEREUM_SEPOLIA_RPC_URL,
        );
        const l2Provider = new ethers.providers.JsonRpcProvider(
          ARBITRUM_SEPOLIA_RPC_URL,
        );

        setStatusSteps([
          {
            description: "Approve bridge transaction",
            status: STATUS.LOADING,
          },
          {
            description: "Transaction pending on Ethereum",
            status: STATUS.NOT_STARTED,
          },
          {
            description: "Waiting for Arbitrum confirmation",
            status: STATUS.NOT_STARTED,
          },
        ]);

        const parentTxnHash = await writeContract(walletClient, {
          account: walletClient.account,
          abi: BridgeAbi,
          address: L1_PROXY_ADDRESS,
          functionName: "depositEth",
          args: [],
          value: parseEther(ethAmount),
          chain: walletClient.chain,
        });

        updateStatus(0, STATUS.COMPLETED);
        updateStatus(1, STATUS.LOADING);

        console.log("✅ Parent Transaction Hash: ", parentTxnHash);
        setParentTxnHash(parentTxnHash);

        const parentTxn = await l1Provider.getTransaction(parentTxnHash);
        const parentTxnReceipt = await parentTxn.wait();

        updateStatus(1, STATUS.COMPLETED);
        updateStatus(2, STATUS.LOADING);

        const parentReceipt = new ParentTransactionReceipt(parentTxnReceipt);
        const parentEthDeposits: EthDepositMessage[] =
          await parentReceipt.getEthDeposits(l2Provider);

        if (parentEthDeposits.length === 0) {
          updateStatus(2, STATUS.FAILED);
          return;
        }

        const depositMsg = parentEthDeposits[0];
        const childTxnReceipt = await depositMsg.wait();
        const childTxn = childTxnReceipt?.transactionHash;
        console.log("✅ Child Transaction Hash: ", childTxn);
        setChildTxnHash(childTxn || "");

        updateStatus(2, STATUS.COMPLETED);
      } catch (error) {
        console.log(error);
        setFailStatus();
      }
    },
    [address, walletClient],
  );

  return {
    bridgeWithSDK,
    bridgeWithProxy,
    statusSteps,
    childTxnHash,
    parentTxnHash,
    getGasEstimate,
    clearData,
  };
}

export default useBridge;
