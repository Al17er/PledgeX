import { useState } from "react";
import styles from "./manage.module.scss";
import { Button, message, InputNumber } from "antd";
import { Transaction } from "@mysten/sui/transactions";
import { suiClient, useNetworkVariables } from "@/networkConfig";
import { Ivariables } from "@/type";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import {
  BonusPool,
  NS_FAUCET,
  PLEDGEX,
  ProjectCoinPool,
  SwapPool,
  USDC_FAUCET,
} from "@/constant";
import { queryAllCoin, queryBalance } from "@/constract";

function ManageStack(props: { price: number }) {
  const { price } = props;
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { NEWPackageID, moduleName, stackUsdcFunction } =
    useNetworkVariables() as Ivariables;
  const [coinValue, setCoinValue] = useState<number | null>(0);
  const inputNumberChange = (value: number | null) => {
    setCoinValue(value);
  };
  const stuckCoinEvent = async () => {
    // 判断 coin balance 是否足够
    if (!account) {
      message.error("please connect wallet");
      return;
    }

    // 判断 coinValue
    if (!coinValue) {
      message.error("please input usdc");
      return;
    }
    const result = await queryBalance(account.address);
    if (Number(result.totalBalance) < coinValue) {
      message.error("coin is not enough");
      return;
    }
    // 一个PTB
    const tx = new Transaction();
    // if coin is enough, let us merge coin
    const coins = await queryAllCoin(account.address, USDC_FAUCET);

    // 初始化为第一个 Coin，然后逐步合并剩余的
    coins.forEach((item) => {
      if (item.coinObjectId !== coins[0].coinObjectId) {
        tx.mergeCoins(tx.object(coins[0].coinObjectId), [
          tx.object(item.coinObjectId),
        ]);
      }
    });
    // 拆分usdc
    const [depositCoin] = tx.splitCoins(tx.object(coins[0].coinObjectId), [
      tx.pure.u64(coinValue),
    ]);

    // stuck usdc
    tx.moveCall({
      package: NEWPackageID,
      module: moduleName,
      function: stackUsdcFunction,
      arguments: [
        depositCoin,
        // BonusPool,
        tx.object(BonusPool),
        // SwapPool,
        tx.object(SwapPool),
        // ProjectCoinPool,
        tx.object(ProjectCoinPool),
        tx.pure.u64(price*10000),
      ],
      typeArguments: [USDC_FAUCET, NS_FAUCET, PLEDGEX],
    });
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async (res) => {
          if (res.digest) {
            const result = await suiClient.waitForTransaction({
              digest: res.digest,
              options: { showEffects: true, showEvents: true },
            });
            if (result.effects?.status.status === "success") {
              message.success("stcuk usdc success");
              setCoinValue(0);
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
    <>
      <div className={styles.content}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>You Pay</h3>
          <div className={styles.cardBody}>
            <div className={styles.inputTextContainer}>
              <InputNumber
                placeholder="input your number"
                min={0}
                changeOnWheel={false}
                value={coinValue}
                onChange={(value) => inputNumberChange(value)}
              />
              <span>USDC</span>
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>You Receive</h3>
          <div className={styles.cardBody}>
            <div className={styles.inputTextContainer}>
              <span>{coinValue}</span>
              <span>PLEDGEX</span>
            </div>
          </div>
        </div>
        {/* <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.inputTextContainer}>
              <span>1SUSDC=1USDC</span>
              <span>pool:100</span>
            </div>
          </div>
        </div> */}
        <Button
          type="primary"
          className={styles.button}
          onClick={stuckCoinEvent}
        >
          Submit
        </Button>
      </div>
    </>
  );
}

export default ManageStack;
