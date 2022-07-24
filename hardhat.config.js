
/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require('@openzeppelin/hardhat-upgrades');

module.exports = {
 
solidity: {
  compilers: [
    {
      version: "0.8.7",
      settings:{
        optimizer: {
          enabled: true,
          runs: 200,
        },
      }
    },
    {
      version: "0.6.6",
      settings: { 
        optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    },
  ],

},
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/t2ebYoIRWHWy6Mdoifx7LKIS1-aog68I",
      },
      allowUnlimitedContractSize: true
    },
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      network_id: "80001",
      accounts: [process.env.PRIVATE_KEYMATIC5],
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/c3cf19e7ef844ac582edcbff82fdaa86",
      network_id: "4",
      accounts: [process.env.PRIVATE_KEYMATIC5],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  }
};
