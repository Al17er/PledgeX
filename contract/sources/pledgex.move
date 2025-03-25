module suiautox::pledgex;

use sui::coin;

public struct PLEDGEX has drop {}

fun init (otw: PLEDGEX, ctx: &mut TxContext) {
    let (treasury_cap, coin_data) = coin::create_currency(
        otw,
        8,
        b"PLEDGEX",
        b"PLEDGEX Faucet",
        b"PLEDGEX is test usdc",
        option::none(),
        ctx
    );

    transfer::public_transfer(treasury_cap, ctx.sender());
    transfer::public_transfer(coin_data, ctx.sender());
}

