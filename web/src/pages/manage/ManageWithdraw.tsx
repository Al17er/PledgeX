import { SetStateAction, useState } from "react";
import styles from "./manage.module.scss";
import { Button, InputNumber, message } from "antd";
import { Transaction } from "@mysten/sui/transactions";
import { BonusPool, NS_FAUCET, SwapPool, USDC_FAUCET } from "@/constant";
import { suiClient, useNetworkVariables } from "@/networkConfig";
import { Ivariables } from "@/type";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";

function ManageWithdraw() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { packageID, moduleName, withdrawFunction } =
    useNetworkVariables() as Ivariables;
  const [coinValue, setCoinValue] = useState<number | null>(0);
  const inputNumberChange = (value: SetStateAction<number | null>) => {
    setCoinValue(value);
  };
  const withdraw = () => {
    if(!coinValue) {
      message.error("please input susdc")
      return
    }
    const tx = new Transaction();
    tx.moveCall({
      package: packageID,
      module: moduleName,
      function: withdrawFunction,
      arguments: [
        tx.object(BonusPool),
        tx.object(SwapPool),
        tx.pure.u64(coinValue),
        tx.pure.u64(1)
      ],
      typeArguments: [NS_FAUCET, USDC_FAUCET],
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
              onChange={(value) => inputNumberChange(value)}
            />
            <span>SUSDC</span>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>You Receive</h3>
        <div className={styles.cardBody}>
          <div className={styles.inputTextContainer}>
            <span>99</span>
            <span>USDC</span>
          </div>
          <div className={styles.inputTextContainer}>
            <span>1</span>
            <span>NS</span>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.inputTextContainer}>
            <span>1SUSDC=0.8USDC + 0.3NS</span>
            <span>pool:100</span>
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
