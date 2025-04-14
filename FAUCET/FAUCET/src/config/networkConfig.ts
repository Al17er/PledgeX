import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
        packageUSDC:"0x207c18d7a5f746110520facd0a3819b572880a734f496680e93ec552f4bb654f",
        packageNS:"0x322002fd1f9be9178099bf742bd857cca2d2a62607cdbf256473068e01747ba9",
        TreasuryCapUSDC:"0xc2b0e2e9c601df671e9638a688d2320990a46a814a96da89faf02d77f4e17ba2",
        TreasuryCapNS:"0x4fae839988ced330eff0b21ec22089afb45ab0166825f78b7e61d6f91865af4e",
        packagePledgeX:"0xfdd285cfad8a4578218533d50dd72fe7ccc85b05facf8114fca9b70681d44436",
        TreasuryCapPledgex:"0x30a6d8f5a67f81d4654ef1c23c88cd315880bda442b2d23fc13aaf50edd69897"
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

const suiClient = new SuiClient({
    url:networkConfig.testnet.url,
})
export { useNetworkVariable, useNetworkVariables, networkConfig,suiClient };
