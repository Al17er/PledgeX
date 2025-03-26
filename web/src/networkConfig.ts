import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        packageID: '0x8401f41257b5e244516010718a5bfa59771e833f6be3a4edcbb833ea7c021001',
        moduleName: "liquidity",
        queryOperationsAddEvent: "AddEvent", // 查询买入操作
        queryOperationsDecreaseEvent: "DecreaseEvent", // 查询卖出操作
        stackUsdcFunction: "stack_usdc", // 用户存 usdc
        withdrawFunction:"withdraw", // 用户取 usdc、ns
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

const suiClient = new SuiClient(networkConfig.testnet);


export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };