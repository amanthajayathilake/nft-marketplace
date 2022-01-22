require("@nomiclabs/hardhat-waffle");

const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString()
const projectId = "5f5a691c3729419dbeae80cb530ad41f";

module.exports = {
  networks: {
    hardhat: {
      chainId:1337
    },
    mumbai: {
      url:`https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    },
    mainnet: {
      url:`https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    },
  },
  solidity: "0.8.4",
};
