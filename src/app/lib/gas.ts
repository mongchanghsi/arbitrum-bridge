/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseEther } from "viem";
import { usePublicClient } from "wagmi";

const useGas = () => {
  const publicClient = usePublicClient();

  const getGasPriceAsync = async () => {
    if (!publicClient) {
      return null;
    }

    try {
      const gasPrice = await publicClient.getGasPrice();
      return gasPrice;
    } catch (error) {
      return null;
    }
  };

  const estimateGasAsync = async (params: {
    address: `0x${string}`;
    abi: any;
    functionName: string;
    args?: any[];
    value?: string;
  }) => {
    if (!publicClient) {
      return null;
    }

    try {
      const gas = await publicClient.estimateContractGas({
        address: params.address,
        abi: params.abi,
        functionName: params.functionName,
        args: params.args ?? [],
        value: params.value ? parseEther(params.value) : undefined,
      });

      return gas; // bigint
    } catch (error) {
      return null;
    }
  };

  return { getGasPriceAsync, estimateGasAsync };
};

export default useGas;
