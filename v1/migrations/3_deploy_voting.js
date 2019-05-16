const Voting = artifacts.require("Voting");
const VotingToken = artifacts.require("VotingToken");
const {
  getKeysForNetwork,
  deployAndGet,
  addToTdr,
  enableControllableTiming
} = require("../../common/MigrationUtils.js");

module.exports = async function(deployer, network, accounts) {
  const keys = getKeysForNetwork(network, accounts);
  const controllableTiming = enableControllableTiming(network);

  const votingToken = await VotingToken.deployed();

  const voting = await deployAndGet(deployer, Voting, controllableTiming, votingToken.address, { from: keys.deployer });
  await addToTdr(voting, network);

  // Corresponds to VotingToken.Roles.Minter;
  const minterRoleEnumValue = 1;
  // Set the minter to be Voting.sol.
  await votingToken.addMember(minterRoleEnumValue, voting.address, { from: keys.deployer });
};
