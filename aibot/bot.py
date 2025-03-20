import time
import yaml
import strategy
import subprocess
from dataclasses import dataclass
from datetime import datetime, timezone
from uuid import uuid4
from pathlib import Path
from collections import deque
from pysui import SuiConfig, SyncClient
from pysui.sui.sui_txn import SyncTransaction
from pysui.sui.sui_types import SuiAddress

from aibot.logger import logger

@dataclass
class TransactionRecord:
    """机器人交易记录"""
    timestamp: datetime
    action: str
    symbol: str
    quantity: float
    price: float
    fee: float
    status: str
    transaction_id: str = str(uuid4())


class StupidSuiTradeBot:
    """sui 交易机器人"""
    def __init__(self, config_path: str = '.config.yaml'):
        self.config = self._load_config(config_path)

        settings = self.config['settings']
        self.interval = settings.get('interval_seconds', 3600)
        self.gas_budget = settings.get('gas_budget', 100000)
        self.max_retries = settings.get('max_retries', 3)
        self.trade_records = deque(maxlen=settings.get('record_windows', 50))

        # 网络配置
        self.network_env = self.config['network']['environment']
        network_config = self.config['network'][self.network_env]
        logger.info(f"环境：{self.network_env}")
        
        # sui 客户端配置
        self.sui_client = self._init_sui_client(network_config)
        
        # 策略配置
        self.strategies = []
        strategies = self.config['strategies']
        for name in strategies:
            strategy_cls = getattr(strategy, name)
            self.strategies.append(strategy_cls(self.config))
        
        self.contract_address = self.config['contracts'][self.network_env]
        self.data_url = self.config['data']['url']

    def _load_config(self, config_path):
        """加载 yaml 文件"""
        config_path = Path(config_path)
        if not config_path.exists():
            raise FileNotFoundError(f"配置文件 {config_path} 不存在")
        
        with open(config_path) as f:
            return yaml.safe_load(f)
        
    
    def _init_sui_client(self, network_config):
        """初始化 Sui 客户端"""
        max_retries = self.max_retries
        for attempt in range(max_retries):
            try:
                sui_config = SuiConfig.user_config(
                    rpc_url=network_config['rpc_url'],
                    prv_keys=[network_config['private_key']]
                )
                client = SyncClient(sui_config)
                return client
            except Exception as e:
                logger.warning(f"连接 SUI 节点失败 (尝试 {attempt+1}/{max_retries}): {str(e)}")
                time.sleep(2 ** attempt)
        raise ConnectionError("无法连接到 SUI 节点")
    

    def _call_contract_method(
        self,
        sender_address: str,
        target: str,
        arguments: list,
        type_arguments: list
    ):
        """通过 pysui 调用智能合约"""

        # TODO: 是否需要重传机制？
        txer = SyncTransaction(
            client=self.sui_client,
            initial_sender=SuiAddress(sender_address),
            initial_gas=self.gas_budget
        )

        txer.move_call(
            target=target,
            arguments=arguments,
            type_arguments=type_arguments
        )

        result = txer.execute()
        
        if result.is_ok():
            logger.info(f"交易成功：{result.result_data}")
            return {"status": "success", "data": result.result_data}
        else:
            return {"status": "error", "message": result.result_string}
    

    def _call_cmd(self, cmd):
        """通过命令行调用智能合约"""
        result = subprocess.run(
            cmd,
            shell=True,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8'
        )

        if result.returncode != 0:
            return {"status": "error", "message": result.stdout}
        else:
            return {"status": "success", "message": result.stdout} 
    

    def call_add(self, coin):
        # TODO
        logger.info('call add')
        self.trade_records.append(
            TransactionRecord(
                timestamp=datetime.now(timezone.utc),
                action='BUY',
                symbol=coin.split("::")[-1],
                quantity=1,
                price=1,
                fee=1,
                status="SUCCESS"
            )
        )


    def call_decrease(self, coin):
        # TODO
        logger.info('call decrease')
        self.trade_records.append(
            TransactionRecord(
                timestamp=datetime.now(timezone.utc),
                action='SELL',
                symbol=coin.split("::")[-1],
                quantity=1,
                price=1,
                fee=1,
                status="SUCCESS"
            )
        )


    def _execute(self):
        """处理单个周期的工作流程"""

        # deep
        coin='0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP'
        params = {
            'bar': '15m',
            'trade_records': self.trade_records
        }
        signals = [strategy.analyze_market(coin, **params) for strategy in self.strategies]
        # TODO: 根据优先级排序
        # xxx

        if signals[0]['决策'] == '加仓':
            logger.info('执行 AI 加仓操作')
            self.call_add(coin)
        elif signals[0]['决策'] == '减仓':
            logger.info('执行 AI 减仓操作')
            self.call_decrease(coin)
        logger.info(self.trade_records)


    def run(self):
        """启动无限循环"""
        logger.info('服务启动...')

        # TODO: 执行失败时如何处理？
        while True:
        # for i in range(1):
            try:
                self._execute()
                logger.info(f'当前周期执行结束，等待 {self.interval} 秒')
                time.sleep(self.interval)
            except Exception as e:
                logger.error(f"错误: {str(e)}")
                time.sleep(60)


if __name__ == "__main__":
    agent = StupidSuiTradeBot(config_path="aibot/configs/config.yaml")
    agent.run()