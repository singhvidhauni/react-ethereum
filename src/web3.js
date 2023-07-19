import Web3 from "web3";
let web3 = null;
let providerUrl = 'http://localhost:8545';
 const initWeb3 = async () =>{
    if (window.ethereum) {
      try {
        // Request access to MetaMask accounts
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Initialize Web3 with the MetaMask provider
        web3 = new Web3(window.ethereum);
        // Check if connected to the Goerli network
        //const networkId = await web3.eth.net.getId();
        const chainId = await web3.eth.getChainId();
        // console.log('chainId ',chainId);
        if (chainId === 5n) {
          providerUrl = `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_API_ID}`;
          web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
          console.log('Connected to Goerli network!');
        } else if(chainId === 1337n) {
          web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
          console.log('local ganache-cli development blockchain!');
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
      }
    } else {
      console.error('Please install MetaMask!');
    }
    return web3;
  };

  function getWeb3() {
    return web3;
  }
export {initWeb3, getWeb3};

