import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        packageID:
          "0xd6aad0e565335286462ec72fe281258fab2e0d5fb341435459beda5044653409",
        NEWPackageID: "0x8dccb2f6d3e6f20e994c87b8af3edde24aa6374269a59c9a5ba25f290e9c0552",
        moduleName: "liquidity",
        queryOperationsAddEvent: "AddEvent", // 查询买入操作
        queryOperationsDecreaseEvent: "DecreaseEvent", // 查询卖出操作
        stackUsdcFunction: "stack_usdc", // 用户存 usdc
        withdrawFunction: "new_withdraw", // 用户取 usdc、ns
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

const suiClient = new SuiClient(networkConfig.testnet);

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
