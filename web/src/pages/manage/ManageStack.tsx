import { useState } from "react";
import styles from "./manage.module.scss";
import { Button, message, InputNumber } from "antd";
import { Transaction } from "@mysten/sui/transactions";
import { suiClient, useNetworkVariables } from "@/networkConfig";
import { Ivariables } from "@/type";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import {
  BonusPool,
  NS_FAUCET,
  PLEDGEX,
  ProjectCoinPool,
  SwapPool,
  USDC_FAUCET,
} from "@/constant";

function ManageStack() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { packageID, moduleName, stackUsdcFunction } =
    useNetworkVariables() as Ivariables;
  const [coinValue, setCoinValue] = useState<number | null>(0);
  const inputNumberChange = (value: number | null) => {
    setCoinValue(value)
  }
  const stuckCoinEvent = async () => {
    // 判断 coinValue
    if(!coinValue) {
      message.error("please input usdc")
      return
    }
    // 一个PTB
    const tx = new Transaction();
    // 拆分usdc
    const [depositCoin] = tx.splitCoins(
      tx.object(
        "0xe14f71bd353723eab8003587313ac9aa0c6f21dae892d2676f18bb1f97dc2469"
      ),
      [tx.pure.u64(coinValue * 1e8)]
    );
    // stuck usdc
    tx.moveCall({
      package: packageID,
      module: moduleName,
      function: stackUsdcFunction,
      arguments: [
        tx.object(
          "0xaab5354ca446b0cc4d0b095952e013944440ce4e5af2c3d83610b67eec854c06"
        ),
        depositCoin,
        // BonusPool,
        tx.object(BonusPool),
        // SwapPool,
        tx.object(SwapPool),
        // ProjectCoinPool,
        tx.object(ProjectCoinPool),
        tx.pure.u64(1),
      ],
      typeArguments: [USDC_FAUCET, NS_FAUCET, PLEDGEX],
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
              message.success("stcuk usdc success");
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
              <span>SUSDC</span>
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.inputTextContainer}>
              <span>1SUSDC=1USDC</span>
              <span>pool:100</span>
            </div>
          </div>
        </div>
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
