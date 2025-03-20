import { Card } from "antd";
import styles from "./manage.module.scss";
import { Input, Button } from "antd";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


interface PoolData {
    coin: string[];
    pool: number[];
}

const coinPair = {
    SUSDC: 'USDC',
    SNS: 'NS',
};

function ManageStack() {
    const [inputValue, setInputValue] = useState(0);
    const [coinPrice, setCoinPrice] = useState(0); // 结果文本
    const [poolData, setPoolData] = useState<PoolData>({
        coin: [],
        pool: []
    });
    const { coin } = useParams();
    let coinStr = coin || '';
    if (coinStr in coinPair){
        coinStr = coinPair[coinStr as keyof typeof coinPair];
    }

    // 获取coin信息
    const fetchCoinResult = async (value: string): Promise<number> => {
        // 这里应替换为你的实际API调用逻辑
        console.log('fetchCoinResult:', value);
        return new Promise(resolve => setTimeout(() => resolve(1.01), 1000)); // 延迟1秒模拟网络请求
    };

    // 获取池子数据
    const fetchPoolResult = async (value: string): Promise<PoolData> => {
        // 这里应替换为你的实际API调用逻辑
        console.log('fetchPoolResult:', value);
        return new Promise(resolve => setTimeout(() => resolve({ coin: ['SUSDC', 'USDC'], pool: [200, 1800] }), 1000)); // 延迟1秒模拟网络请求
    };


    const handleBlur = async () => {
        if (inputValue === 0) return; // 如果输入为空，则不执行任何操作
        const [coinInfo, poolInfo] = await Promise.all([fetchCoinResult(coinStr), fetchPoolResult(coinStr)]); // 调用模拟API
        console.log('poolInfo:', poolInfo);
        setCoinPrice(coinInfo); // 设置结果文本
        setPoolData(poolInfo)
    };

    // 当输入框内容改变时触发的事件处理器
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 使用正则表达式确保只允许数字
        if (/^\d*$/.test(value)) {
            setInputValue(Number(value));
        }
    };

    // 计算
    function performCalculation() {
        console.log('执行计算操作:', coinPrice);
        // 在这里放置你的计算逻辑
        // setPayPrice(coinPrice * inputValue);
    }

    useEffect(() => {
        if (coinPrice !== 0) { // 确保只在实际更新时执行
            performCalculation();
        }
    }, [coinPrice]);

    return (
        <div className={styles.content}>
            <Card className={styles.card}>
                <h3 className={styles.cardTitle}>You Pay</h3>
                <div className={styles.cardBody}>
                    <div className={styles.inputTextContainer}>
                        <Input placeholder="输入框" value={inputValue} onBlur={handleBlur} onChange={handleChange} />
                        <span>{coin}</span>
                    </div>
                    <div className={styles.textContainer}>
                        <span>${coinPrice * inputValue}</span>
                        {/* <span>${payPrice}</span> // 通过useState设置 */}
                        <span>{inputValue}</span>
                    </div>
                </div>
            </Card>
            <Card className={styles.card}>
                <h3 className={styles.cardTitle}>You Receive</h3>
                <div className={styles.cardBody}>
                    <div className={styles.inputTextContainer}>
                        <span>{inputValue}</span>
                        <span>{coinStr}</span>
                    </div>
                    <div className={styles.textContainer}>
                        <span>${inputValue}</span>
                    </div>
                </div>
            </Card>
            <Card className={styles.card}>
                <div className={styles.cardBody}>
                    <div className={styles.inputTextContainer}>
                        <span>{poolData.pool[0]}{poolData.coin[0]}={poolData.pool[1]}{poolData.coin[1]}</span>
                        <span>pool:{poolData.pool[1]}</span>
                    </div>
                </div>
            </Card>
            <Button type="primary" className={styles.button}>
                Submit
            </Button>
        </div>
    )
}

export default ManageStack;