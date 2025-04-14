// 时间戳换算成年月日 时分秒
export const timeFormmat = (timestamp: number) => {
  // 创建 Date 对象
  const date = new Date(timestamp);
  // 提取年、月、日、小时和分钟
  const year = date.getFullYear(); // 完整年份
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份（从0开始，需要加1）
  const day = String(date.getDate()).padStart(2, "0"); // 日期
  const hours = String(date.getHours()).padStart(2, "0"); // 小时
  const minutes = String(date.getMinutes()).padStart(2, "0"); // 分钟
  // 按照 YY-MM-DD HH:MM 的格式拼接字符串
  const formattedTime = `${year}${month}${day}${hours}${minutes}`;
  return formattedTime
};
