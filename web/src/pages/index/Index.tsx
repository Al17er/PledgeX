import { Button, message, Modal } from "antd";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { IOption } from "@/type";
import Manage from "../manage/Manage";
import { useCurrentAccount } from "@mysten/dapp-kit";
function Index() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [optionArr, setOptionArr] = useState<IOption[]>([]);
  const [text, setText] = useState("");
  const account = useCurrentAccount();
  const showModal = (description: string) => {
    setText(description);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showManageModal = () => {
    if (account) {
      setIsManageModalOpen(true);
    } else {
      messageApi.error("please connect wallet!");
    }
  };

  const handleManageCancel = () => {
    setIsManageModalOpen(false);
  };
  const optionArrTmp = [
    {
      id: 1,
      time: "202503201211",
      action: "Buy",
      price: 0.98,
      description: "这个操作好11111",
    },
    {
      id: 2,
      time: "202503211413",
      action: "Sell",
      price: 1.98,
      description: "这个操作好2222",
    },
  ];
  useEffect(() => {
    setOptionArr([...optionArrTmp]);
  }, []);

  return (
    <>
      {contextHolder}
      <div className={styles.index}>
        <div className={styles.top}>
          <div className={styles.top_item}>
            <div className={styles.top_name}>STACK VALUE</div>
            <div className={styles.top_data}>$10000</div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_name}>TOTAL USDC</div>
            <div className={styles.top_data}>9999</div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_name}>TOTAL NS</div>
            <div className={styles.top_data}>299</div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_name}>TOTAL PROFIT</div>
            <div className={styles.top_data}>$999</div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_name}>CURRENT TVL</div>
            <div className={styles.top_data}>$99</div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_name}>CURRENT PROFIT</div>
            <div className={styles.top_data}>$10</div>
          </div>
        </div>
        <div className={styles.wrap}>
          <div className={styles.left}>
            <div className={styles.title}>The latest AI operations</div>
            <div className={styles.table_title}>
              <div className={styles.table_title_item}>Date</div>
              <div className={styles.table_title_item}>Operation</div>
              <div className={styles.table_title_item}>Price</div>
              <div className={styles.table_title_item}>Analysis</div>
            </div>
            {optionArr.map((item: IOption) => {
              return (
                <div className={styles.table_wrap} key={item.id}>
                  <div className={styles.table_wrap_item}>{item.time}</div>
                  <div className={styles.table_wrap_item}>{item.action}</div>
                  <div className={styles.table_wrap_item}>{item.price}</div>
                  <div className={styles.table_wrap_item}>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => showModal(item.description)}
                    >
                      Operation Parsing
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.right}>
            <div className={styles.title}>Today's Market Conditions</div>
            <div className={styles.content}>
              <div className={styles.content_item}>
                <div className={styles.content_left}>
                  1SUSDC = 0.19USDC + 0.8NS
                </div>
                <Button type="primary" size="small" onClick={showManageModal}>
                  Manage
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title="Operation Parsing"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <div>{text}</div>
        </Modal>
        <Modal
          title="Operation Parsing"
          open={isManageModalOpen}
          onCancel={handleManageCancel}
          footer={null}
          width={400}
        >
          <Manage />
        </Modal>
      </div>
    </>
  );
}

export default Index;
