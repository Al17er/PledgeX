module suiautox::liquidity;
use sui::balance::{Balance, Supply};
use sui::coin::TreasuryCap;
use sui::table::Table;

// 测试网中测试需要的LP代币
public struct LP<phantom X, phantom Y> has drop {}
// 测试网中需要的测试性质的流动性池
public struct LiquidityPool<phantom X, phantom Y> has key {
    id: UID,
    coin_usdc: Balance<X>,
    coin_y: Balance<Y>,
    lp_supply: Supply<LP<X, Y>>,
}

// admin cap
public struct AdminCap has key {
    id: UID
}

// usdc质押池
public struct StackUsdcPool<phantom T> has key {
    id: UID,
    coin_usdc: Balance<T>,
    stack_usdc_record: Table<address, u64> //key 为用户的地址，value为用户的usdc质押数量
}

// NS(也可以是任意的其他Coin) 代币池
public struct StackNsPool<phantom T> has key {
    id: UID,
    coin_ns: Balance<T>,
    sells_reward: Table<address, u64> // key 为用户的地址，value为用户在计算后卖出后应该获得的奖励的数量
}

// 奖金池(即当用户来claim属于自己的那份的奖励时，从奖金池中扣除相应的份额)
public struct BonusPool<phantom X, phantom Y> has key {
    id: UID,
    coin_ns: Balance<X>,
    coin_usdc: Balance<Y>
}

// 项目方的盈利池子
public struct ProfitPool<phantom T> has key {
    id: UID,
    usdc: Balance<T>
}

// 管理项目token的池子
public struct ProjecTokenCap<phantom U> has key {
    id: UID,
    treasury_cap: TreasuryCap<U>
}

// 加入项目代币的铸造权限
public entry fun add_mint_cap<U>(
    pool: &mut ProjecTokenCap<U>,
    cap: TreasuryCap<U>,
) {
    pool.treasury_cap = cap;
}


// 用户质押代币的方法
public fun stack_usdc<T, U>(
    _admin_cap: &AdminCap,
    pool: &mut StackUsdcPool<T>,
    projct_token_cap: &mut ProjecTokenCap<U>,
    amount: u64,
    ctx: &mut TxContext
) {
    
}





