const HDWalletProvider = require('@truffle/hdwallet-provider');
console.log('env mnemonic ',process.env.MNEMONIC, 'API ID ',process.env.INFURA_API_ID)
module.exports = {
  contracts_build_directory:"./src",
  networks: {
    goerli: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, `https://goerli.infura.io/v3/${process.env.INFURA_API_ID}`);
      },
      network_id: 5,
      confirmations: 2, 
      timeoutBlocks: 200, 
      skipDryRun: true,
      gas: 10000000,
    },
  },
  compilers: {
    solc: {
      version: '^0.8.0',
    },
  },
};