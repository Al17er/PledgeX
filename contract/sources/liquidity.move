module suiautox::liquidity;
use sui::balance::{Balance, Supply};
use sui::clock::{Self, Clock};
use sui::coin::{Self, TreasuryCap, Coin};
use sui::table::{Self, Table};

// 错误码的定义：
const ERR_INVALID_TIME_INTERVAL: u64 = 0;

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

// usdc质押池(每天都会重新开一个)
public struct StackUsdcPool<phantom T> has key {
    id: UID,
    coin_usdc: Balance<T>,
    start_time: u64, // 质押的开始时间
    end_time: u64, // 所有进程结束的时间
    stack_usdc_record: Table<address, u64>,//key 为用户的地址，value为用户的usdc质押数量
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
public struct ProfitPool<phantom T, phantom U> has key {
    id: UID,
    usdc: Balance<T>,
    ns: Balance<U>,
}

// 管理项目token的池子
public struct ProjecTokenCap<phantom U> has key, store {
    id: UID,
    treasury_cap: TreasuryCap<U>
}

// 加入项目代币的铸造权限
public entry fun add_mint_cap<U>(
    _admin_cap: &AdminCap,
    cap: TreasuryCap<U>,
    ctx: &mut TxContext
) {
    // 创建一个存储项目代币铸造权限的结构的对象
    let projct_token_cap = ProjecTokenCap {
        id: object::new(ctx),
        treasury_cap: cap
    };
    // 将该对象的所有权转移给管理员地址
    transfer::public_transfer(projct_token_cap, ctx.sender());
}


// 用户质押代币的方法
public fun stack_usdc<T, U>(
    _admin_cap: &AdminCap,
    coin_usdc: Coin<T>,
    usdc_pool: &mut StackUsdcPool<T>,
    projct_token_cap: &mut ProjecTokenCap<U>,
    clock: &Clock,
    ctx: &mut TxContext
) {
    // 获取当前时间，确认是否在质押的时间范围内
    if (usdc_pool.start_time <= clock::timestamp_ms(clock) && clock::timestamp_ms(clock) <= usdc_pool.end_time) {
        is_current_time_in_period();
    };
    // 1. 获取用户传入的usdc代币的余额
    let user_usdc_balance = coin_usdc.value();
    // 2. 将用户传入进来的usdc转移到usdc质押池中
    coin::put(&mut usdc_pool.coin_usdc, coin_usdc);
    // 3. 调研对应的项目代币的铸造权限，给用户同等数量的项目代币
    coin::mint_and_transfer(&mut projct_token_cap.treasury_cap, user_usdc_balance, ctx.sender(), ctx);
    // 4. 记录用户的usdc质押数量
    table::add(&mut usdc_pool.stack_usdc_record, ctx.sender(), user_usdc_balance)
}

// 用户追加质押usdc的方法
public fun append_stack<T, U>(
    _admin_cap: &AdminCap,
    coin_usdc: Coin<T>,
    usdc_pool: &mut StackUsdcPool<T>,
    projct_token_cap: &mut ProjecTokenCap<U>,
    clock: &Clock,
    ctx: &mut TxContext
) {
    // 获取当前时间，确认是否在质押的时间范围内
    if (usdc_pool.start_time <= clock::timestamp_ms(clock) && clock::timestamp_ms(clock) <= usdc_pool.end_time) {
        is_current_time_in_period();
    };
    // 1. 获取用户传入的usdc代币的余额
    let user_append_usdc_balance = coin_usdc.value();
    // 2. 将用户传入进来的usdc转移到usdc质押池中
    coin::put(&mut usdc_pool.coin_usdc, coin_usdc);
    // 3. 调研对应的项目代币的铸造权限，给用户追加同等数量的项目代币
    coin::mint_and_transfer(&mut projct_token_cap.treasury_cap, user_append_usdc_balance, ctx.sender(), ctx);
    // 4. 更新用户的usdc质押数量
    let user_stack_amount = table::borrow_mut(&mut usdc_pool.stack_usdc_record, ctx.sender());
    *user_stack_amount = *user_stack_amount + user_append_usdc_balance;
}

//


// error handing function
fun is_current_time_in_period() {
    abort ERR_INVALID_TIME_INTERVAL
}


