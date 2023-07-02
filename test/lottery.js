const lottery = artifacts.require("lottery");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("lottery", function (/* accounts */) {
  it("should assert true", async function () {
    await lottery.deployed();
    return assert.isTrue(true);
  });
});
