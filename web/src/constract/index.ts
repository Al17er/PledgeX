import { USDC_FAUCET } from "@/constant";
import { suiClient } from "@/networkConfig";
import { IOption, IparsedJson } from "@/type";
import { timeFormmat } from "@/utils";

// 查询买入操作
export const queryAddOperations = async (
  packageID: string,
  module: string,
  queryOperationsAddEvent: string
) => {
  const events = await suiClient.queryEvents({
    limit: 5,
    query: {
      MoveEventType: `${packageID}::${module}::${queryOperationsAddEvent}`,
    },
  });
  const addArr: IOption[] = [];
  events.data.forEach((event) => {
    const parsedJson = event.parsedJson as IparsedJson;
    const json = {
      id: event.id.txDigest,
      time: timeFormmat(Number(parsedJson.time)),
      action: "sell",
      price: Number(parsedJson.ns_price),
      description: "Consistent with trading strategy",
    };
    addArr.push(json);
  });

  return addArr;
};
// 查询卖出操作
export const queryDecreaseOperations = async (
  packageID: string,
  module: string,
  queryOperationsDecreaseEvent: string
) => {
  const events = await suiClient.queryEvents({
    limit: 5,
    query: {
      MoveEventType: `${packageID}::${module}::${queryOperationsDecreaseEvent}`,
    },
  });
  const decreaseArr: IOption[] = [];
  events.data.forEach((event) => {
    const parsedJson = event.parsedJson as IparsedJson;
    const json = {
      id: event.id.txDigest,
      time: timeFormmat(Number(parsedJson.time)),
      action: "buy",
      price: Number(parsedJson.ns_price),
      description: "Consistent with trading strategy",
    };
    decreaseArr.push(json);
  });
  return decreaseArr;
};

// 查询线上 ns 价格
export const queryNSPrice = async () => {
  const res = await fetch(
    "/api/priapi/v5/dex/token/market/dex-token-candles?chainId=784&address=0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS&bar=1m&limit=1"
  );
  const result = await res.json();
  const ns_price = result.data[0][4]
  return ns_price;
};

// 查询是否有足够 USDC_FAUCET 类型coin balance
export const queryBalance = async (address: string) => {
  const result = await suiClient.getBalance({
    coinType: USDC_FAUCET,
    owner: address,
  });
  return result;
};

// query USDC_FAUCET coin metadata
export const queryCoinMetaData = async () => {
  const result = await suiClient.getCoinMetadata({
    coinType: USDC_FAUCET,
  });
  return result;
};

// query all coin
export const queryAllCoin = async (address: string, type: string) => {
  let cursor: string | null | undefined = null;
  let hasNextPage = true;
  const coinArr = [];

  while (hasNextPage) {
    const coinObjects = await suiClient.getCoins({
      owner: address,
      coinType: type,
      cursor,
      limit: 50,
    });
    if (!coinObjects?.data) {
      break;
    }
    hasNextPage = coinObjects.hasNextPage;
    cursor = coinObjects.nextCursor;
    coinArr.push(...coinObjects.data);
  }
  return coinArr;
};

// query object 
export const queryObject = async (id: string) => {
  const result = await suiClient.getObject({
    id: id,
    options: {
      showContent: true
    }
  })
  return result
}
