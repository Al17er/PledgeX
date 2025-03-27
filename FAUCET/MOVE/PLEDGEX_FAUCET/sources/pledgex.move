module pledgex::pledgex;

use sui::coin;

public struct PLEDGEX has drop {}

fun init (otw: SUSDC, ctx: &mut TxContext) {
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
public entry fun mint<T>(
    cap: &mut TreasuryCap<T>,
    value: u64,
    receiver: address,
    ctx: &mut TxContext)
{
    let mint_coin = coin::mint<T>(
        cap,
        value,
        ctx,
    );
    transfer::public_transfer(mint_coin, receiver);
}


public entry fun burn<T>(
    cap: &mut TreasuryCap<T>,
    input_coin: Coin<T>,
){
    coin::burn<T>(cap, input_coin);
}
