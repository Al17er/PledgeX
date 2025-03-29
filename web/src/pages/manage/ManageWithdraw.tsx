import { SetStateAction, useEffect, useState } from "react";
import styles from "./manage.module.scss";
import { Button, InputNumber, message } from "antd";
import { Transaction } from "@mysten/sui/transactions";
import {
  BonusPool,
  NS_FAUCET,
  PLEDGEX,
  ProjectCoinPool,
  SwapPool,
  USDC_FAUCET,
} from "@/constant";
import { suiClient, useNetworkVariables } from "@/networkConfig";
import { IBPFields, IContent, Ivariables } from "@/type";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { queryAllCoin, queryObject } from "@/constract";

function ManageWithdraw(props: { price: number }) {
  const { price } = props;
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { NEWPackageID, moduleName, withdrawFunction } =
    useNetworkVariables() as Ivariables;
  const [coinValue, setCoinValue] = useState<number>(0);
  const [swapUSDC, setSwapUSDC] = useState(0);
  const [swapNS, setSwapNS] = useState(0);
  const inputNumberChange = (value: SetStateAction<number>) => {
    if (!value) {
      setCoinValue(0);
    }
    setCoinValue(value);
  };
  useEffect(() => {
    getBoundPool();
  }, []);
  const n=4;
  const price_result = Math.floor(price*Math.pow(10,n));
  console.log(price_result);
  const getBoundPool = async () => {
    const result = await queryObject(BonusPool);
    const content = result.data?.content as IContent;
    const fields = content.fields as unknown as IBPFields;
    setSwapUSDC(Number(fields.swap_usdc));
    setSwapNS(Number(fields.swap_ns));
  };

  const withdraw = async () => {
    // 判断 coin balance 是否足够
    if (!account) {
      message.error("please connect wallet");
      return;
    }
    if (!coinValue) {
      message.error("please input susdc");
      return;
    }
    const tx = new Transaction();

    // if coin is enough, let us merge coin
    const coins = await queryAllCoin(account.address, PLEDGEX);

    // 初始化为第一个 Coin，然后逐步合并剩余的
    coins.forEach((item) => {
      if (item.coinObjectId !== coins[0].coinObjectId) {
        tx.mergeCoins(tx.object(coins[0].coinObjectId), [
          tx.object(item.coinObjectId),
        ]);
      }
    });
    // 拆分 coin
    const [depositCoin] = tx.splitCoins(tx.object(coins[0].coinObjectId), [
      tx.pure.u64(coinValue),
    ]);
    tx.moveCall({
      package: NEWPackageID,
      module: moduleName,
      function: withdrawFunction,
      arguments: [
        depositCoin,
        tx.object(BonusPool),
        tx.object(SwapPool),
        tx.object(ProjectCoinPool),
        tx.pure.u64(price_result),
      ],
      typeArguments: [NS_FAUCET, USDC_FAUCET, PLEDGEX],
    });
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async (res) => {
          console.log("==res", res);
          if (res.digest) {
            const result = await suiClient.waitForTransaction({
              digest: res.digest,
              options: { showEffects: true, showEvents: true },
            });
            if (result.effects?.status.status === "success") {
              setCoinValue(0);
              message.success("withdraw usdc success");
            }
          }
        },
        onError: (err) => {
          console.log("err===", err);
        },
      }
    );
  };

  return (
    <div className={styles.content}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>You Pay</h3>
        <div className={styles.cardBody}>
          <div className={styles.inputTextContainer}>
            <InputNumber
              placeholder="input your number"
              min={0}
              value={coinValue}
              changeOnWheel={false}
              defaultValue={0}
              onChange={(value) => inputNumberChange(value as number)}
            />
            <span>PLEDGEX</span>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>You Receive</h3>
        <div className={styles.cardBody}>
          <div className={styles.inputTextContainer}>
            <span>
              {coinValue === 0 ? 0 : (swapUSDC + swapNS * price) * coinValue}
            </span>
            <span>USDC</span>
          </div>
        </div>
      </div>

      <Button type="primary" className={styles.button} onClick={withdraw}>
        Submit
      </Button>
    </div>
  );
}

export default ManageWithdraw;
