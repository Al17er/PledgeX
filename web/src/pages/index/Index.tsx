import { Button, message, Modal } from "antd";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { IBPFields, IContent, IOption, IPPFields, Ivariables } from "@/type";
import Manage from "../manage/Manage";
import { useCurrentAccount } from "@mysten/dapp-kit";
import {
  queryAddOperations,
  queryDecreaseOperations,
  queryNSPrice,
  queryObject,
} from "@/constract";
import { useNetworkVariables } from "@/networkConfig";
import { BonusPool, ProjectCoinPool } from "@/constant";
function Index() {
  const {
    packageID,
    moduleName,
    queryOperationsAddEvent,
    queryOperationsDecreaseEvent,
  } = useNetworkVariables() as Ivariables;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [optionArr, setOptionArr] = useState<IOption[]>([]);
  const [proCoin, setProCoin] = useState(0);
  const [swapUSDC, setSwapUSDC] = useState(0);
  const [swapNS, setSwapNS] = useState(0);
  const [coinUSDC, setCoinUSDC] = useState(0);
  const [coinNS, setCoinNS] = useState(0);
  const [nsPrice, setNsPrice] = useState(0);
  const [text, setText] = useState("");
  const account = useCurrentAccount();
  const showModal = (description: string) => {
    setText(description);
    setIsModalOpen(true);
  };

  const showManageModal = () => {
    if (account) {
      setIsManageModalOpen(true);
    } else {
      message.error("please connect wallet!");
    }
  };

  useEffect(() => {
    getProjectPool();
    getBoundPool();
    // 获取 ns 价格
    getNSPrice();
  }, []);
  const getProjectPool = async () => {
    try {
      const res = await queryObject(ProjectCoinPool);
      const content = res.data?.content as IContent;
      const fields = content.fields as unknown as IPPFields;
      setProCoin(Number(fields.projectCoin));
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };
  const getNSPrice = async () => {
    try {
      const ns_price = await queryNSPrice();
      setNsPrice(ns_price);
    } catch (err) {
      getNSPrice()
      console.error("Fetch error:", err);
    }
  };
  const getBoundPool = async () => {
    const result = await queryObject(BonusPool);
    const content = result.data?.content as IContent;
    const fields = content.fields as unknown as IBPFields;
    setSwapUSDC(Number(fields.swap_usdc));
    setSwapNS(Number(fields.swap_ns));
    setCoinUSDC(Number(fields.coin_usdc));
    setCoinNS(Number(fields.coin_ns));
  };
  useEffect(() => {
    // 使用 Promise.all 同时请求两个接口
    Promise.all([
      queryDecreaseOperations(
        packageID,
        moduleName,
        queryOperationsAddEvent
      ).then((res) => res),
      queryAddOperations(
        packageID,
        moduleName,
        queryOperationsDecreaseEvent
      ).then((res) => res),
    ])
      .then(([data1, data2]) => {
        // 合并两个数组
        const combined = [...data1, ...data2];
        combined.sort((a, b) => Number(b.time) - Number(a.time));
        setOptionArr(combined);
        console.log("optionArr===", optionArr);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <div className={styles.index}>
        <div className={styles.top}>
          <div className={styles.top_item}>
            <div className={styles.top_name}>STACK VALUE</div>
            <div className={styles.top_data}>${1000000000000000 - proCoin}</div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_name}>TOTAL USDC</div>
            <div className={styles.top_data}>${coinUSDC}</div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_name}>TOTAL NS</div>
            <div className={styles.top_data}>${coinNS}</div>
          </div>
          <div className={styles.top_item}>
            <div className={styles.top_name}>TOTAL PROFIT</div>
            <div className={styles.top_data}>
              {(
                ((coinNS * nsPrice + coinUSDC - (1000000000000000 - proCoin)) /
                  (1000000000000000 - proCoin)) *
                100
              ).toFixed(4)}
              %
            </div>
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
                  <div className={styles.table_wrap_item}>
                    {item.price / 10000}
                  </div>
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
                  {/* 1PLEDGEX=swap_usdc+swap_NS*NS价格=？USDC */}
                  1PLEDGEX = {swapUSDC + swapNS * nsPrice} USDC (NS:{nsPrice})
                </div>
                <Button type="primary" size="small" onClick={showManageModal}>
                  Manage
                </Button>
              </div>
              <div className={`${styles.content_item} ${styles.content_item_other}`}>
                1 PLEDGEX = (swap_usdc+swap_ns*ns_price) USDC
              </div>
            </div>
          </div>
        </div>
        <Modal
          title="Operation Parsing"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <div>{text}</div>
        </Modal>
        <Modal
          title="Operation Parsing"
          open={isManageModalOpen}
          onCancel={() => setIsManageModalOpen(false)}
          footer={null}
          width={400}
        >
          <Manage price={nsPrice} />
        </Modal>
      </div>
    </>
  );
}

export default Index;
