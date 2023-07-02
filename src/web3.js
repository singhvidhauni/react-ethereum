import Web3 from "web3";
let web3 = null;
 const initWeb3 = async () =>{
    if (window.ethereum) {
      try {
        // Request access to MetaMask accounts
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Initialize Web3 with the MetaMask provider
        web3 = new Web3(window.ethereum);
        // Check if connected to the Goerli network
        const networkId = await web3.eth.net.getId();
        console.log('network ID ', networkId);
        if (networkId === 5) {
          console.log('Connected to Goerli network!');
        } else {
          console.log('Please switch to the Goerli network in MetaMask!');
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
      }
    } else {
      console.error('Please install MetaMask!');
    }
    return web3;
  };

export const web3Promise = initWeb3();

