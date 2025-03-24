import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        packageID: '0x123',
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

const suiClient = new SuiClient(networkConfig.testnet);


export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };