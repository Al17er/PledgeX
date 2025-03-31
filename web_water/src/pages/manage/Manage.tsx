import { Tabs} from 'antd';
import styles from "./manage.module.scss";
import { useState } from 'react';

import ManageStack from './ManageStack';//质押组件
import ManageWithdraw from './ManageWithdraw';//提现组件


function Index() {
  const [activeTab, setActiveTab] = useState('stack');
  const items = [
    {
      key: 'stack',
      label: 'Stack',
      children: ManageStack(),
    },
    {
      key: 'withdraw',
      label: 'Withdraw',
      children: ManageWithdraw(),
    },
  ];

  return (
    <div className={styles.pledge}>
      <Tabs
        activeKey={activeTab}
        onChange={(key: string) => setActiveTab(key)}
        className={styles.tabs}
        items={items}
      />
    </div>
  );
}

export default Index;