import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import FcoinContract from '../Fcoin.json';
import "./App.css"

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [fcoinContract, setFcoinContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [recipientAddress , setRecipientAddress] = useState('');
  const [amountT, setAmountT] = useState('');
  useEffect(() => {
    const init = async () => {
      if (window.ethereum && isConnecting) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const contractAddress = '0xb84114bdd69ddc5493a699a9ba80ea52544c1356';
          const contract = new web3Instance.eth.Contract(FcoinContract.abi, contractAddress);

          setFcoinContract(contract);

          const userBalance = await contract.methods.balanceOf(accounts[0]).call();
          setBalance(web3Instance.utils.fromWei(userBalance, 'ether'));
        } catch (error) {
          console.error('Error connecting to wallet:', error);
        } finally {
          setIsConnecting(false);
        }
      }
    };

    init();
  }, [isConnecting]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
  };

  const mintTokens = async () => {
    if (fcoinContract && account) {
      try {
        const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
  
        const transaction = await fcoinContract.methods.mint(account, amountInWei).send({ from: account });
  
        console.log('Mint transaction details:', transaction);

        const userBalance = await fcoinContract.methods.balanceOf(account).call();
        console.log('Updated balance after minting:', web3.utils.fromWei(userBalance, 'ether'));
  

      } catch (error) {
        console.error('Error minting tokens:', error);
      }
    }
  };

  const transferTokens = async () => {
    if (fcoinContract && account && recipientAddress) {
      try {
        const amountInWei = web3.utils.toWei(amountT.toString(), 'ether');
  
        const transaction = await fcoinContract.methods.transfer(recipientAddress, amountInWei).send({ from: account });
  
        console.log('Transfer details:', transaction);
  
        const userBalance = await fcoinContract.methods.balanceOf(account).call();
        console.log('Updated balance:', web3.utils.fromWei(userBalance, 'ether'));
  
      } catch (error) {
        console.error('Error transferring tokens:', error);
      }
    } else {
      console.error('Recipient address is required for the transfer.');
    }
  };

  return (
    <div>
      <h1>Fcoin DApp</h1>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <p>Balance: {balance} Fcoin</p>

          <div className='buy'>
          <h3>Mint Fcoin</h3>
          <label>
            Amount:
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>

          <button onClick={mintTokens}>Mint Tokens</button>
           </div>

          <div className='buy'>
          <h3>Transfer Fcoin</h3>
          <div className='buy-2-label'>
          <label>
            Recipient Address:
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </label>

          <label>
            Amount:
            <input
              type="text"
              value={amountT}
              onChange={(e) => setAmountT(e.target.value)}
            />
          </label>
          </div>
          <button onClick={transferTokens}>Transfer Tokens</button>
        </div>
        </div>
      ) : (
        <div>
          <p>Please connect your MetaMask wallet.</p>
          <button onClick={handleConnectWallet} disabled={isConnecting}>
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
