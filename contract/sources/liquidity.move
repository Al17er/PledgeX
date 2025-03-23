module suiautox::liquidity;
use sui::balance::{Balance, split,join, zero};
use sui::coin::{Self, Coin};
use sui::coin::{from_balance,into_balance};
use sui::coin::join as join_coin;
use sui::transfer::{share_object, public_transfer};
use sui::tx_context::sender;

// admin cap
public struct AdminCap has key,store {
    id: UID
}


// 奖金池(即当用户来claim属于自己的那份的奖励时，从奖金池中扣除相应的份额)
public struct BonusPool<phantom X, phantom Y> has key {
    id: UID,
    coin_ns: Balance<X>,
    coin_usdc: Balance<Y>,
    //记录当前可兑换的ns和usdc数量，用于后续用户加仓及退币计算
    swap_ns:u64,
    swap_usdc:u64,
}

public struct SwapPool<phantom X, phantom Y> has key{
    id:UID,
    coin_ns:Balance<X>,
    coin_usdc:Balance<Y>,
}

public struct ProjectCoinPool<phantom T> has key{
    id:UID,
    projectCoin:Balance<T>
}

public fun create_project_pool<T>(ctx:&mut TxContext){
    let project_pool = ProjectCoinPool<T>{
        id:object::new(ctx),
        projectCoin:zero<T>()
    };
    share_object(project_pool)

}

public entry fun add_project_coin<T>(
    project_pool:&mut ProjectCoinPool<T>,
    project_coin:Coin<T>
){
    let project_balance = into_balance(project_coin);
    join(&mut project_pool.projectCoin,project_balance);
}

public entry fun stack_usdc<T,X>(
    _admin_cap: &AdminCap,
    coin_usdc: Coin<T>,
    bound_pool:&mut BonusPool<X,T>,
    project_coin_pool:&mut ProjectCoinPool<T>,
    ctx: &mut TxContext
) {
        // 1. 获取用户传入的usdc代币的余额
        let user_usdc_balance = coin_usdc.value();
        // 2. 将用户传入进来的usdc转移到usdc质押池中
        coin::put(&mut bound_pool.coin_usdc, coin_usdc);
        // 3. 调用对应的项目代币的铸造权限，给用户同等数量的项目代币
        // coin::mint_and_transfer(projct_token_cap, user_usdc_balance, ctx.sender(), ctx);
        let split_coin_banance = split(&mut project_coin_pool.projectCoin,user_usdc_balance);
        let split_coin = from_balance(split_coin_banance,ctx);
        public_transfer(split_coin,sender(ctx))
        // 4. 记录用户的usdc质押数量
        // table::add(&mut bound_pool., ctx.sender(), user_usdc_balance)
}

// Y为usdc x为ns
public entry fun add_ns<X,Y>(
    _admin_cap: &AdminCap,
    bonux_pool: &mut BonusPool<X,Y>,
    swap_pool:&mut SwapPool<X,Y>,
    swap_num:u64,
    ns_price:u64,
    swap_ns:u64,
    swap_usdc:u64
){
    // 从质押池中取出usdc并存入交换池
    let split_usdc = split(&mut bonux_pool.coin_usdc,swap_num);
    join(&mut swap_pool.coin_usdc,split_usdc);

    // 从交换池中取出ns并存入质押池
    let split_ns = split(&mut swap_pool.coin_ns,swap_num*ns_price);
    join(&mut bonux_pool.coin_ns,split_ns);


    bonux_pool.swap_ns=swap_ns;
    bonux_pool.swap_usdc=swap_usdc;
}


public entry fun decrease_ns<X,Y>(
    _admin_cap: &AdminCap,
    bonux_pool: &mut BonusPool<X,Y>,
    swap_pool:&mut SwapPool<X,Y>,
    swap_num:u64,
    ns_price:u64,
    swap_ns:u64,
    swap_usdc:u64
){
    let split_ns = split(&mut bonux_pool.coin_ns,swap_num);
    join(&mut swap_pool.coin_ns,split_ns);

    let split_usdc = split(&mut swap_pool.coin_usdc,swap_num/ns_price);
    join(&mut bonux_pool.coin_usdc,split_usdc);
    bonux_pool.swap_ns=swap_ns;
    bonux_pool.swap_usdc=swap_usdc;
}

public entry fun withdraw<X,Y>(
    bonux_pool: &mut BonusPool<X,Y>,
    swap_pool:&mut SwapPool<X,Y>,
    swap_num:u64,
    ns_price:u64,
    ctx:&mut TxContext
){
    let split_ns = split(&mut bonux_pool.coin_ns,swap_num*bonux_pool.swap_ns);
    join(&mut swap_pool.coin_ns,split_ns);
    let split_usdc = split(&mut bonux_pool.coin_usdc,swap_num*ns_price);
    let usdc_swap_coin = from_balance(split_usdc,ctx);
    let mut usdc_split_coin = from_balance(split(&mut bonux_pool.coin_usdc,swap_num*bonux_pool.swap_usdc),ctx);
    join_coin(&mut usdc_split_coin,usdc_swap_coin);
    let address = sender(ctx);
    transfer::public_transfer(usdc_split_coin,address);

}


public entry fun add_swap_pool<X,Y>(
    swap_pool:&mut SwapPool<X,Y>,
    ns_coin:Coin<X>,
    usdc_coin:Coin<Y>,
){
    let ns_balance = into_balance(ns_coin);
    join(&mut swap_pool.coin_ns,ns_balance);
    let usdc_balance = into_balance(usdc_coin);
    join(&mut swap_pool.coin_usdc,usdc_balance);
}

fun init(ctx:&mut TxContext){
    let adminCap=AdminCap{
        id:object::new(ctx)
    };
    transfer::public_transfer(adminCap,sender(ctx))
}

public entry fun mint_admin_cap(
    _admin_cap:&AdminCap,
    receive:address,
    ctx:&mut TxContext
){
    let admin_cap=AdminCap{
        id:object::new(ctx)
    };
    transfer::public_transfer(admin_cap,receive);
}


public entry fun create_swap_pool<X,Y>(
    ctx:&mut TxContext
){
    let swap_pool = SwapPool<X,Y>{
        id:object::new(ctx),
        coin_ns:zero<X>(),
        coin_usdc:zero<Y>(),
    };
    transfer::share_object(swap_pool);
    // transfer::share_object(BonusPool<X,Y>)
}

public entry fun create_bound_pool<X,Y>(
    ctx:&mut TxContext
){
    let bound = BonusPool<X,Y>{
        id:object::new(ctx),
        coin_ns:zero<X>(),
        coin_usdc:zero<Y>(),
        swap_usdc:1,
        swap_ns:0
    };
    transfer::share_object(bound);
    // transfer::share_object(BonusPool<X,Y>)
}
