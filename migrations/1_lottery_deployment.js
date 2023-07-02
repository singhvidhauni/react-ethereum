const lottery = artifacts.require('Lottery');
module.exports = (deployer) => {
    console.log(deployer, lottery);
    deployer.deploy(lottery);
}