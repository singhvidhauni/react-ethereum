import {initWeb3, getWeb3} from './web3';
import contractJson from "./Lottery.json";
await initWeb3();
const web3 = getWeb3();
const networkIds = Object.keys(contractJson.networks);

const latestNetworkId = networkIds[networkIds.length - 1];
const contractAddress = contractJson.networks[latestNetworkId].address;
console.log(' latestNetworkId   ',latestNetworkId,'networkIds ',networkIds,' contractAddress ',contractAddress);
const contractAbi = contractJson.abi;
const lottery = new web3.eth.Contract(contractAbi, contractAddress);
export default lottery;