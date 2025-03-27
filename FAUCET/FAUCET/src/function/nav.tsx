import  { Component } from 'react';
// import CreateProfile from "./createProfile.tsx";
// import CreateAccountBook from "./createAccountBook.tsx";
// import AddContent from "./createContent.tsx";
import FaucetMintNS from "./faucetMintNS.tsx";
import FaucetMint from "./faucetMint.tsx";
import FaucetPledgex from "./faucetPledgex.tsx";
import { Box } from "@radix-ui/themes";

class Nav extends Component {


    render() {
        // const { activeModule } = this.state;
        return (
            <Box style={{ background: "black", padding: "20px" }}>
                <FaucetMint onSuccess={console.log} />
                <FaucetMintNS onSuccess={console.log} />
                <FaucetPledgex onSuccess={console.log} />
            </Box>
        );
    }
}

export default Nav;