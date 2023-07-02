import './App.css';
import {useEffect, useState, useRef} from 'react';
import lottery from './lottery';
import {web3Promise} from './web3';

async function fetchManagerAddress() {
  const manager = await lottery.methods.manager().call();
  return manager;
}

async function getTotalPlayer() {
  const players = await lottery.methods.getPlayers().call();
  return players;
}

async function getBalance(web3) {
  console.log('getBlance: ',lottery.options.address);
  const balance = await web3.eth.getBalance(lottery.options.address);
  return balance;
}

async function getWeb3() {
  const web3 = await web3Promise;
  return web3;
}

async function onSubmit(event, web3, value) {
  event.preventDefault();
  const accounts = await web3.eth.getAccounts();
  try {
    const sender = accounts[0]; // Assuming the sender is the first account
    const contractAddress = lottery.options.address;
    const transactionObject = {
      from: sender,
      to: contractAddress,
      value: web3.utils.toWei(value, 'ether'),
      data: lottery.methods.enter().encodeABI(),
    };
    const result = await web3.eth.sendTransaction(transactionObject);
    console.log('Transaction successful:', result);
    // Handle success case
  } catch (error) {
    console.error('Transaction error:', error);
    // Handle error case
  }
}
async function prizeWon(setPrize, prize) {
  prize = await lottery.methods.prizeWon().call();
  setPrize(prize);
  await lottery.methods.resetGame().call();
}
async function pickWinner(setPrize, web3, prize, setWinner) {
  console.log('pick Winner called...')
  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];
  const gasEstimate = await lottery.methods.pickWinner().estimateGas({ from: sender });
  const gasPrice = await web3.eth.getGasPrice();
  const gasFee = gasEstimate * gasPrice;
  try {
    
    const contractAddress = lottery.options.address;
    const transactionObject = {
      from:sender,
      to:contractAddress,
      value:gasFee + web3.utils.toWei('0.4','ether'),
      data: lottery.methods.pickWinner().encodeABI(),
    }
    const result = await web3.eth.sendTransaction(transactionObject);
    console.log('Transaction successful:', result);
    prizeWon(setPrize, prize);
  } catch(error) {
    console.log('Transaction Failed:', error);
    setWinner(null);
  }
}
function App() {
  const appRef = useRef(null);
  const [managerAddress, setManagerAddress] = useState('');
  const [web3, setWeb3] = useState(null);
  const [lotteryContractAddress, setLotteryContractAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [players, setPlayers] = useState('');
  const [value, setValue] = useState('');
  const [winner, setWinner] = useState(null);
  const [prize, setPrize] = useState(0);
  
  useEffect(() => {
    
    async function fetchData() {
      const web3 = await getWeb3();
      const address = await fetchManagerAddress();
      const players = await  getTotalPlayer();
      setWeb3(web3);
      const balance = await getBalance(web3);
      setLotteryContractAddress(lottery.options.address);
      setManagerAddress(address);
      setPlayers(players);
      console.log('fetchData :',balance);
      setBalance(web3.utils.fromWei(balance, 'ether'));
    }
    fetchData();
  },[]);
  
  return (
    <div className="App" ref={appRef}>
      <header className="App-header">
        <h3>Conquer the Jackpot! Play Now and Win Big!</h3>
        <div>
            <p style={{backgroundColor:'black', color:'white', padding:'5px', display:'inline'}}>{managerAddress}</p>
            <p>invites you to Play the Lottery Game Now!</p>
        </div>
      </header>
        <hr/>
      <main>
        <div>
          {players > 0 ?( <p>Total Players available {players.length}</p>):(<p>No Players entered yet.</p>)} 
          <p>Lottery Game address {lotteryContractAddress}</p>
          <p>Current Game Balance {balance}</p>
        </div>
        <hr/>
        <form onSubmit={event => onSubmit(event, web3, value)}>
          <div>
            <h3>Want to try your luck?</h3>
            <p>Amount of ether to enter</p>
            <input value={value} onChange={event => setValue(event.target.value)}/>
            <button type="submit">Enter</button>
          </div>
        </form>
      </main>
      
      <footer>
        <div>
          <h3>Pick the Lucky winner</h3>
          <button onClick={() => pickWinner(setPrize, web3, prize, setWinner)}>Pick Winner</button>
        </div>
        <div>{prize > 0?(<p>Total prize won {prize}. The winner is {winner}</p>):(<p>The winner will be announced when admin will pick the winner</p>)}
        </div>
      </footer>
      
    </div>
  );
}

export default App;
