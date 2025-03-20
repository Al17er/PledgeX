from typing import Dict

from strategy.strategy import BaseStrategy


class SimpleStrategy(BaseStrategy):
    def __init__(self, config: Dict[str, str]):
        super().__init__(config)

        self.data_url = self.config['data']['url']
        conf = self.config['strategies']['SimpleStrategy']
        self.threshold = conf['threshold']


    def analyze_market(self, coin: str, **kwargs):
        trade_records = kwargs['trade_records']
        price = self.get_coin_price(
            address=coin,
            bar=kwargs.get('bar', '15m'),
            limit=1
        )
        cur_price = price[4]
        for record in reversed(trade_records):
            if record.action == 'BUY':
                last_buy_price = record.price
                if last_buy_price - cur_price > self.threshold:
                    return self.format_signal(
                        "加仓", f"距上一次买入价格下跌超过 {self.threshold}"
                    )
                break
        return self.format_signal(
            "不变", f"上次购买价格：{last_buy_price}，当前价格：{cur_price}"
        )
                
            
            
        
