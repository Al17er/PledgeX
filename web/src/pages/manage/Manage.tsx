import { Tabs } from "antd";
import styles from "./manage.module.scss";
import { useState } from "react";

import ManageStack from "./ManageStack"; //质押组件
import ManageWithdraw from "./ManageWithdraw"; //提现组件

function Manage(props: { price: number }) {
  const { price } = props;
  const [activeTab, setActiveTab] = useState("stack");
  const items = [
    {
      key: "stack",
      label: "Stack",
      children: <ManageStack price={price} />,
    },
    {
      key: "withdraw",
      label: "Withdraw",
      children: <ManageWithdraw price={price} />,
    },
  ];

  return (
    <div className={styles.pledge}>
      <Tabs
        centered
        activeKey={activeTab}
        onChange={(key: string) => setActiveTab(key)}
        className={styles.tabs}
        items={items}
        destroyInactiveTabPane={true}
      />
    </div>
  );
}

export default Manage;
