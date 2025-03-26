import { USDC_FAUCET } from "@/constant";
import { suiClient } from "@/networkConfig";

// 查询买入操作
export const queryAddOperations = async (
  packageID: string,
  module: string,
  queryOperationsAddEvent: string
) => {
  const events = await suiClient.queryEvents({
    query: {
      MoveEventType: `${packageID}::${module}::${queryOperationsAddEvent}`,
    },
  });
  return events;
};
// 查询卖出操作
export const queryDecreaseOperations = async (
  packageID: string,
  module: string,
  queryOperationsDecreaseEvent: string
) => {
  const events = await suiClient.queryEvents({
    query: {
      MoveEventType: `${packageID}::${module}::${queryOperationsDecreaseEvent}`,
    },
  });
  return events;
};

// 查询是否有足够 USDC_FAUCET 类型coin
export const queryBalance = async () => {
  const result = await suiClient.getBalance({
    coinType: USDC_FAUCET,
    owner: "0xad348ef5fef1bf4071b1fb0b4dc9562bbcf0e2707262284d70a6f89798f053a9"
  })
  return result
}