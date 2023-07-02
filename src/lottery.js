//this works absolutely fine
import Web3 from 'web3';
import contractJson from "./Lottery.json";
const networkIds = Object.keys(contractJson.networks);
const latestNetworkId = networkIds[networkIds.length - 1];
console.log('process infura user ID ',process.env.REACT_APP_INFURA_API_ID);
const testNetworkURL = `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_API_ID}`;
const web3 = new Web3(testNetworkURL);
console.log('web3 web3 ',web3);
console.log('web3 web3 contractJson :',contractJson.abi);

const contractAddress = contractJson.networks[latestNetworkId].address;
const contractAbi = contractJson.abi;

console.log('contract address ',contractAddress);
console.log('contractAbi ',contractJson.abi);
//This is working fine
const lottery = new web3.eth.Contract(contractAbi, contractAddress);
export default lottery;