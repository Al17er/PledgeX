// import { Button } from "antd";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
function Index() {
  const [summaryData, setSummaryData] = useState([{ 'id': 0, 'content': '暂无数据', 'publish_time': '暂无数据', 'projects': [{ 'core_id': 0, 'core_name': '暂无数据' }] }]);
  useEffect(() => {
    const fetchData = async () => {
      // const res = await fetch("http://127.0.0.1:9000/api/info_agg/content/list");
      const res = await fetch("http://127.0.0.1:9000/api/info_agg/content/list/agg_day");
      if (res.ok) {
        const data = await res.json();
        console.log(data)
        setSummaryData(data.results);
      }
    }

    fetchData();
  }, []);

  return (
    <div className={styles.index}>
      <div className={styles.wrap}>
        <div className={styles.left}>
          <div className={styles.title}>新闻聚合</div>
          <div className={styles.table_title}>
            <div className={styles.table_title_item_content}>内容</div>
            <div className={styles.table_title_item_date}>时间</div>
            <div className={styles.table_title_item_date}>相关</div>
          </div>
          {summaryData.map((item) => (
            <div className={styles.table_wrap} key={item.id}>
              <div className={styles.table_wrap_item_content}>{item.content}</div>
              <div className={styles.table_wrap_item_date}>{item.publish_time}</div>
              <div className={styles.table_wrap_item_date}>
                {item.projects.map((item2, index) => (
                  <span key={item2.core_id}>
                    {item2.core_name}
                    {index < item.projects.length - 1 && ' | '}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* <Button type="primary" size="small">
                操作解析
              </Button> */}
        </div>
      </div>
    </div>
  );
}

export default Index;
