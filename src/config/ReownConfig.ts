import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { arbitrumSepolia, sepolia } from "@reown/appkit/networks";
import { ENVIRONMENT } from "./Environment";

export const projectId = ENVIRONMENT.REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [sepolia, arbitrumSepolia];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
