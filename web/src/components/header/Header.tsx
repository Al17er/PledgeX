import {
  useConnectWallet,
  useCurrentAccount,
  useDisconnectWallet,
  useWallets,
} from "@mysten/dapp-kit";
import styles from "./header.module.scss";
import { Button, Modal, Image, message } from "antd";
import { useEffect, useState } from "react";
function Header() {
  const [messageApi, contextHolder] = message.useMessage();
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnect, setIsConnect] = useState(false);
  useEffect(() => {
    if (account) {
      setIsConnect(true);
    } else {
      setIsConnect(false);
    }
  }, [account]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connectWalletEvent = (wallet: any) => {
    setIsModalOpen(false);
    connect(
      { wallet },
      {
        onSuccess: () => {},
        onError: () => {
          messageApi.error("Failed to connect wallet!");
        },
      }
    );
  };

  const logout = () => {
    disconnect();
    setIsModalOpen(false);
  };

  return (
    <>
      {contextHolder}
      <div className={styles.header}>
        <div className={styles.logo}>SuiAutoX</div>
        {isConnect ? (
          <div className={styles.profile}>
            <span className={styles.account} title={account?.label || account?.address}>
              {account?.label || account?.address}
            </span>
            <span className={styles.logout} onClick={logout}>
              logout
            </span>
          </div>
        ) : (
          <Button className={styles.Button} type="primary" onClick={showModal}>
            Connect Wallet
          </Button>
        )}
      </div>
      <Modal
        width={300}
        closable={false}
        open={isModalOpen}
        title={null}
        footer={null}
        onCancel={handleCancel}
      >
        <div className={styles.wallet_title}>Connect Wallets</div>
        <div className={styles.wallet_wrap}>
          {wallets.map((item) => {
            return (
              <div
                className={styles.wallet}
                key={item.name}
                onClick={() => connectWalletEvent(item)}
              >
                <div className={styles.wallet_left}>
                  <Image
                    className={styles.wallet_img}
                    width={30}
                    preview={false}
                    src={item.icon}
                  />
                  <span>{item.name}</span>
                </div>
                <div className={styles.wallet_right}>
                  <Button type="text">Installed</Button>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}

export default Header;
