module suiautox::susdc;
use sui::coin;

public struct SUSDC has drop {}

fun init (otw: SUSDC, ctx: &mut TxContext) {
    let (treasury_cap, coin_data) = coin::create_currency(
        otw,
        8,
        b"SUSDC",
        b"SUSDC Faucet",
        b"SUSDC is test usdc",
        option::none(),
        ctx
    );

    transfer::public_transfer(transfer_cap, ctx.sender());
    transfer::public_transfer(transfer_cap, ctx.sender());
}