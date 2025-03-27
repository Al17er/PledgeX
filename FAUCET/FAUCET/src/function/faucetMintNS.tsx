import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { networkConfig } from "../config/networkConfig";

const FaucetMintNS: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageUSDC = networkConfig.testnet.packageNS;
    const TreasureCapUSDC = networkConfig.testnet.TreasuryCapNS;
    const [loading, setLoading] = useState(false);
    const [num, setNum] = useState(100000);

    const create = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }
        console.log("adress", currentAccount.address);
        setLoading(true);
        try {
            const tx = new Transaction();
            tx.setGasBudget(10000000);

            tx.moveCall({
                package: PackageUSDC,
                module: "ns_faucet",
                function: "mint",
                typeArguments: ['0x322002fd1f9be9178099bf742bd857cca2d2a62607cdbf256473068e01747ba9::ns_faucet::NS_FAUCET'],
                arguments: [
                    tx.object(TreasureCapUSDC),
                    tx.pure.u64(num*1e10), // 使用状态变量中的category值
                    tx.object(currentAccount.address),
                ],
            });
            const result = await signAndExecute({ transaction: tx });
            if (result && !isError) {
                onSuccess();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Enter amount"
            value={num}
            onChange={(e) => setNum(Number(e.target.value))} // 绑定输入事件
          />
          <button
            onClick={create}
            disabled={!num || loading} // 禁用按钮直到输入了amount且不在加载状态
          >
              {loading ? 'Loading...' : 'Mint NS'}
          </button>
      </div>
    );
};

export default FaucetMintNS;



