import { Tabs, Spin, Pagination } from "antd";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";

// 抽离的列表组件
interface NewsItem {
  id: number;
  content: string;
  publish_time: string;
  projects: Array<{ core_id: number; core_name: string }>;
}

const NewsList = ({ data, total, onPageChange, pageSize }: { data: NewsItem[]; total: number; onPageChange: (page: number) => void; pageSize: number }) => {
  return (
    <div className={styles.left}>
      <div className={styles.title}>新闻聚合</div>
      <div className={styles.table_title}>
        <div className={styles.table_title_item_content}>内容</div>
        <div className={styles.table_title_item_date}>时间</div>
        <div className={styles.table_title_item_date}>相关</div>
      </div>
      {data.map((item) => (
        <div className={styles.table_wrap} key={item.id}>
          <div className={styles.table_wrap_item_content}>{item.content}</div>
          <div className={styles.table_wrap_item_date}>{item.publish_time}</div>
          <div className={styles.table_wrap_item_date}>
            {item.projects.map((item2, index) => (
              <span key={item2.core_id}>
                {item2.core_name}
                {index < item.projects.length - 1 && " | "}
              </span>
            ))}
          </div>
        </div>
      ))}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Pagination
          current={Math.ceil(data.length / pageSize)}
          total={total}
          pageSize={pageSize}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
};

// 主组件
function Index() {
  const [activeKey, setActiveKey] = useState("day");
  const [dailyData, setDailyData] = useState<NewsItem[]>([]);
  const [allData, setAllData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [pageSize, setPageSize] = useState(10); // 每页显示条数
  const [total, setTotal] = useState(0); // 总数据条数

  const fetchData = async (type: "day" | "all", page: number, pageSize: number) => {
    setLoading(true);
    try {
      // const url =
      //   type === "day"
      //     ? `http://127.0.0.1:9000/api/info_agg/content/list/agg_day?page=${page}&pageSize=${pageSize}`
      //     : `http://127.0.0.1:9000/api/info_agg/content/list?page=${page}&pageSize=${pageSize}`;

      const url =
        type === "day"
          ? `http://61.171.56.226:9091/api/info_agg/content/list/agg_day?page=${page}&pageSize=${pageSize}`
          : `http://61.171.56.226:9091/api/info_agg/content/list?page=${page}&pageSize=${pageSize}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (type === "day") {
          setDailyData(data.results);
          setTotal(data.total); // 假设后端返回总条数
          setPageSize(10)
        } else {
          setAllData(data.results);
          setTotal(data.total); // 假设后端返回总条数
          setPageSize(10)
        }
      }
    } catch (error) {
      console.error("数据获取失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeKey as "day" | "all", currentPage, pageSize);
  }, [activeKey, currentPage, pageSize]);

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    setCurrentPage(1); // 切换标签时重置页码
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const initialData = [{
    id: 0,
    content: '暂无数据',
    publish_time: '暂无数据',
    projects: [{ core_id: 0, core_name: '暂无数据' }]
  }];

  return (
    <div className={styles.index}>
      <div className={styles.wrap}>
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          items={[
            {
              key: "day",
              label: "每日新闻摘要",
              children: (
                <Spin spinning={loading}>
                  <NewsList
                    data={dailyData.length ? dailyData : initialData}
                    total={total}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                  />
                </Spin>
              ),
            },
            {
              key: "all",
              label: "新闻摘要",
              children: (
                <Spin spinning={loading}>
                  <NewsList
                    data={allData.length ? allData : initialData}
                    total={total}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                  />
                </Spin>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

export default Index;