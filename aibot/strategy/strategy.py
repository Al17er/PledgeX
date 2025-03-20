import requests
import time

from abc import ABC, abstractmethod
from typing import Any, Dict

from aibot.logger import logger


class BaseStrategy(ABC):
    def __init__(self, config: Dict[Any, Any]):
        super().__init__()

        self.config = config


    @abstractmethod
    def analyze_market(self, coin: str, **kwargs):
        raise NotImplementedError
        

    def get_coin_price(self, address, bar, limit):
        """获取当前价格数据"""
        max_retries = 3
        headers = {"Content-Type": "application/json"}
        payload = {
            "chainId": 784,
            "address": address,
            "bar": bar,
            "limit": limit
        }

        for attempt in range(max_retries):
            try:
                data_url = self.config['data']['url']
                resp = requests.get(
                    data_url,
                    headers=headers,
                    params=payload,
                    timeout=5
                )
                resp.raise_for_status()
                data = resp.json()['data'][0]
                logger.info(f"成功获取价格数据: {data}")
                return data
            except Exception as e:
                logger.warning(f"请求失败（{attempt+1}/{max_retries}次尝试）: {str(e)}")
                time.sleep(1)
        raise ValueError("价格数据获取失败")


    @staticmethod
    def format_signal(action: str, reason: str) -> Dict[str, str]:
        allowed_actions = {"加仓", "不变", "减仓"}
        if action not in allowed_actions:
            raise ValueError(f"无效交易动作: {action}，允许的操作: {allowed_actions}")
        
        return {
            "决策": action,
            "理由": reason
        }