import styles from "./manage.module.scss";
import { Input, Button } from "antd";

function ManageWithdraw() {
  
  return (
    <div className={styles.content}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>You Pay</h3>
        <div className={styles.cardBody}>
          <div className={styles.inputTextContainer}>
          <Input placeholder="input your number" type="number" />
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
      <Button type="primary" className={styles.button}>
        Submit
      </Button>
    </div>
  );
}

export default ManageWithdraw;
