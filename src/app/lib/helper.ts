import { hexToBigInt, toHex, getAddress } from "viem";

export function getL2Alias(l1Address: `0x${string}`): `0x${string}` {
  const aliasOffset = BigInt("0x1111000000000000000000000000000000001111");
  const alias = hexToBigInt(l1Address) + aliasOffset;
  return getAddress(toHex(alias));
}
