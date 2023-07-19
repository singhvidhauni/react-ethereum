const lottery = artifacts.require('Lottery');
module.exports = (deployer) => {
    deployer.deploy(lottery);
}