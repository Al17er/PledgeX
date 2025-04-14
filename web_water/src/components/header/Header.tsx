import { ConnectButton } from "@mysten/dapp-kit"
import styles from "./header.module.scss"
function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>SuiAutoX</div>
      <ConnectButton className={styles.button} />
    </div>
  )
}

export default Header