import styles from "./manage.module.scss";
import { Input, Button } from "antd";

function ManageStack() {
    return (
        <div className={styles.content}>
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>You Pay</h3>
                <div className={styles.cardBody}>
                    <div className={styles.inputTextContainer}>
                        <Input placeholder="input your number" type="number" />
                        <span>USDC</span>
                    </div>
 
                </div>
            </div>
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>You Receive</h3>
                <div className={styles.cardBody}>
                    <div className={styles.inputTextContainer}>
                        <span>100</span>
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
            <Button type="primary" className={styles.button}>
                Submit
            </Button>
        </div>
    )
}

export default ManageStack;