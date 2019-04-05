const CapabilityContract = artifacts.require("CapabilityContract");
const Capabilities = artifacts.require("Capabilities");
const Delegation = artifacts.require("Delegation");

contract("CapabilitiesContract", function(accounts) {
  it("Basic Test", async function() {
    const ocap = await Capabilities.new();
    const contractObj = await CapabilityContract.new(ocap);
    const delegation = await Delegation.new(contractObj.address, ocap.address, 0, accounts[1]);
    await ocap.createToken(accounts[0], 0, { from: accounts[0] });
    await ocap.safeTransferFrom(accounts[0], delegation.address, 0, { from: accounts[0] });
    await ocap.createToken(accounts[2], 1);

    assert.equal(1, 2);
  });
});
