const HDWalletProvider = require("truffle-hdwallet-provider");
const ManagedSecretProvider = require("./scripts/ManagedSecretProvider");
require("dotenv").config();

// Fallback to a public mnemonic to prevent exceptions
const mnemonic = process.env.MNEMONIC
  ? process.env.MNEMONIC
  : "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
const infuraApiKey = process.env.INFURA_API_KEY;

const testProvider = new ManagedSecretProvider([{
  projectId: "risk-protocol",
  locationId: "global",
  keyRingId: "Yutaro_Test",
  cryptoKeyId: "yutaro",
  ciphertextBucket: "risk-labs-local-test",
  ciphertextFilename: "taro_priv1.enc"
}, {
  projectId: "risk-protocol",
  locationId: "global",
  keyRingId: "Yutaro_Test",
  cryptoKeyId: "yutaro",
  ciphertextBucket: "risk-labs-local-test",
  ciphertextFilename: "taro_priv2.enc"
}, {
  projectId: "risk-protocol",
  locationId: "global",
  keyRingId: "Yutaro_Test",
  cryptoKeyId: "yutaro",
  ciphertextBucket: "risk-labs-local-test",
  ciphertextFilename: "taro_priv3.enc"
}, {
  projectId: "risk-protocol",
  locationId: "global",
  keyRingId: "Yutaro_Test",
  cryptoKeyId: "yutaro",
  ciphertextBucket: "risk-labs-local-test",
  ciphertextFilename: "taro_priv4.enc"
}], "http://localhost:9545");

/*
const testProvider = new ManagedSecretProvider({
  projectId: "risk-protocol",
  locationId: "global",
  keyRingId: "Yutaro_Test",
  cryptoKeyId: "yutaro",
  ciphertextBucket: "risk-labs-local-test",
  ciphertextFilename: "taro_local_mnemonic.enc"
}, "http://localhost:9545", 0, 2);
*/
// const testProvider = new HDWalletProvider(mnemonic, "http://localhost:9545", 0, 2);

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    ci: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 1234,
      gas: 6720000
    },
    coverage: {
      host: "127.0.0.1",
      network_id: "*",
      port: 8545,
      gas: 0xfffffffffff,
      gasPrice: 0x01
    },
    develop: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*",
      gas: 6720000
    },
    test: {
      provider: testProvider,
      network_id: "*",
      gas: 6720000
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraApiKey}`, 0, 2),
      network_id: "*",
      gas: 6720000,
      gasPrice: 20000000000
    },
    mainnet: {
      provider: new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${infuraApiKey}`, 0, 2),
      network_id: "*",
      gas: 6720000,
      gasPrice: 20000000000
    }
  }
};
