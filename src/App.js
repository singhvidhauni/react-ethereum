import './App.css';
import {useEffect, useState, useRef} from 'react';
import lottery from './lottery';
import { initWeb3, getWeb3 } from './web3';

function App() {
  const appRef = useRef(null);
  const [managerAddress, setManagerAddress] = useState('');
  const [web3, setWeb3] = useState(null);
  const [lotteryContractAddress, setLotteryContractAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [players, setPlayers] = useState([]);
  const [value, setValue] = useState('');
  const [winner, setWinner] = useState(null);
  const [prize, setPrize] = useState('');
  const [accounts, setAccounts] = useState([]);

  async function getWeb3Instance() {
    await initWeb3();
    return getWeb3();
  }

  async function fetchManagerAddress() {
    const manager = await lottery.methods.manager().call();
    return manager;
  }

  async function getTotalPlayer() {
    const players = await lottery.methods.getPlayers().call();
    return players;
  }
  async function getBalance(web3) {
    const balance = await web3.eth.getBalance(lottery.options.address);
    return balance;
  }
  async function prizeWon() {
    let winner = await lottery.methods.lastWinner().call();
    setWinner(winner);
    updateLotteryData(web3);
  }
  async function updatePrize() {
    let prize = await getBalance(web3);
      prize = web3.utils.fromWei(prize, 'ether');
      setPrize(prize);
  }
  async function updateLotteryData(web3) {
    const players = await lottery.methods.getPlayers().call();
    setPlayers(players);
    if(web3) {
      let balance = await getBalance(web3);
      balance = web3.utils.fromWei(balance, 'ether');
      setBalance(balance);
      let winner = await lottery.methods.lastWinner().call();
      let decimal = parseInt(winner, 16);
      winner = (decimal === 0) ? null : winner;
      setWinner(winner);
    }
  }
  async function pickWinner() {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[0] });
      prizeWon();
    } catch(error) {
      setWinner(null);
    }
  }

  async function resetLottery() {
    try {
      await lottery.methods.resetGame().send({from:accounts[0]});
      updateLotteryData(web3);
    } catch(error) {
      console.log('Transaction Failed:', error);
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const sender = accounts[0]; // Assuming the sender is the first account
      await lottery.methods.enter().send({from:sender, value:web3.utils.toWei(value,'ether')});
      updatePrize();
      updateLotteryData(web3);
      setValue('');
    } catch (error) {
      console.error('Transaction error:', error);
    }
  }
  useEffect(() => {
    async function fetchData() {
      const web3 = await getWeb3Instance();
      const address = await fetchManagerAddress();
      const players = await  getTotalPlayer();
      setWeb3(web3);
      let accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
      const balance = await getBalance(web3);
      setLotteryContractAddress(lottery.options.address);
      setManagerAddress(address);
      setPlayers(players);
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
          {players.length > 0 ?( <p>Total Players available {players.length}</p>):(<p>No Players entered yet.</p>)} 
          <p>Lottery Game address {lotteryContractAddress}</p>
          <p>Current Game Balance {balance}</p>
        </div>
        <hr/>
        <form onSubmit={event => onSubmit(event)}>
          <div>
            <h3>Want to try your luck?</h3>
            <p>Amount of ether to enter</p>
            <div className="amount-container">
              <input value={value} onChange={event => setValue(event.target.value)}/>
              <button type="submit">Enter</button>
            </div>
          </div>
        </form>
      </main>
      
      <footer>
        <div>
          <h3>Pick the Lucky winner</h3>
          <button onClick={() => pickWinner()}>Pick Winner</button>
        </div>
        <div className="blink_style">{ winner ?(<p>The winner is <mark><b>{winner}</b></mark>. Total prize won <mark><b>{prize}</b></mark> ethers.</p>):(<p>The winner will be announced when admin will pick the winner</p>)}
        </div>
        <div>
          <h2>Reset the Lottery</h2>
          <button onClick={() => resetLottery()}>Reset</button>
        </div>
      </footer>
    </div>
  );
}
export default App;
