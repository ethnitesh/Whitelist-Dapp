require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path:".env)"});

// const path = require("path");
// const ansolutepath = path.join(__dirname,".env");
// console.log("^^^^^^^^^^", ansolutepath)
/** @type import('hardhat/config').HardhatUserConfig */

ALCHEMY_API_KEY_URL="ALCHEMY_API_URL";
const ROPSTEN_PRIVATE_KEY = `ROPSTEN_PRIVATE_KEY`;
module.exports = {
  solidity: "0.8.9",
  networks :{
    rinkeby: {
      url : ALCHEMY_API_KEY_URL,
      accounts: [ROPSTEN_PRIVATE_KEY]
    },
  },
};
