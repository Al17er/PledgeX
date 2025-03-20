import requests
import json
import time

from typing import Dict
from strategy.strategy import BaseStrategy
from strategy.prompt import PROMPT
from aibot.logger import logger

class AIStrategy(BaseStrategy):
    def __init__(self, config: Dict[str, str]):
        super().__init__(config)

        conf = self.config['strategies']['AIStrategy']
        self.api_key = conf['api_key']
        self.endpoint = conf['endpoint']
        self.model = conf['model']

        self.data_url = self.config['data']['url']


    def analyze_market(self, coin: str, **kwargs):
        price = self.get_coin_price(
            address=coin,
            bar=kwargs.get('bar', '15m'),
            limit=1
        )

        prompt = PROMPT.format(
            open=price[1],
            high=price[2],
            low=price[3],
            close=price[4]
        )
        logger.info(f"[prompt]: {prompt}")

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }

        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.8
        }

        max_retries= 3
        for attempt in range(max_retries):
            try:
                resp = requests.post(
                    self.endpoint,
                    headers=headers,
                    json=payload,
                    timeout=30
                )
                resp.raise_for_status()
                raw = resp.json()['choices'][0]['message']['content']
                advice = self._safe_parse_advice(raw)
                if advice:
                    logger.info(f'[advice]: {advice}')
                    return advice
                raise ValueError("响应内容无法解析为有效JSON")
            except Exception as e:
                logger.warning(f"AI请求失败 ({attempt+1}/{max_retries}次尝试): {str(e)}")
                time.sleep(1)
        try:
            resp = requests.post(self.endpoint, headers=headers, json=payload)
            resp.raise_for_status()
            advice = resp.json()['choices'][0]['message']['content']
        except Exception as e:
            logger.error(f"AI 请求失败：{str(e)}")
            return None
        
    def _safe_parse_advice(self, content: str) -> str:
        """解析 AI 返回建议"""
        content = content.strip()
        try:
            return json.loads(content)
        except Exception as e:
            pass

        if content.startswith("```json"):
            try:
                return json.loads(content[7:-3])
            except Exception as e:
                pass
        return None
