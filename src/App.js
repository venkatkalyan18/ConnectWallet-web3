import Azuki from './azuki.png';
import Eth from './eth.png';
import './App.css';
import React, { useState, useEffect } from "react";

function App() {
  const { ethers } = require('ethers');
  const [currentWallet, setCurrentWallet] = useState('');
  const [balance, setBalance] = useState('');
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      // Ethereum wallet is detected
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      checkExistingWallet(web3Provider);
      addWalletListener();
    } else {
      // Ethereum wallet is not detected
      console.log("Ethereum wallet not detected. Please install MetaMask or another Ethereum wallet.");
    }
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        setCurrentWallet(accounts[0]);
        updateBalance(accounts[0]);
      } catch (error) {
        console.error("Failed to connect", error);
      }
    } else {
      console.log("Install MetaMask");
    }
  };

  const checkExistingWallet = async (web3Provider) => {
    if (web3Provider) {
      try {
        const accounts = await web3Provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setCurrentWallet(accounts[0]);
          updateBalance(accounts[0]);
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const updateBalance = async (account) => {
    if (provider && account) {
      const balanceWei = await provider.getBalance(account);
      const balanceEther = ethers.utils.formatEther(balanceWei);
      setBalance(`${balanceEther} ETH`);
    }
  };

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setCurrentWallet(accounts[0]);
          updateBalance(accounts[0]);
        } else {
          setCurrentWallet('');
          setBalance('');
        }
      });
    }
  };

  return (
    <div className="main-div">
      <div className="App">
        <img src={Azuki} className="azuki-logo" alt="logo" width={120} />
        <h4>Check Ether</h4>
        <img src={Eth} className="eth-logo" alt="Ethereum" width={120}/>
        <h4>Welcome to Ethereum balance checker</h4>
        <button onClick={connectWallet} disabled={!provider}>
          {!currentWallet ?  
            (<span className="btn-span">Connect Wallet</span>) :
            (<span className="btn-span">{currentWallet.substring(0, 6)}...{currentWallet.substring(38)}</span>)
          }
        </button>
        <h5>
          {currentWallet && <span>Address: {currentWallet}</span>}
        </h5>
        <h5>
          {balance && <span>Balance: {balance}</span>}
        </h5>
        {!provider && (
          <p>Please install MetaMask or another Ethereum wallet to connect your wallet.</p>
        )}
      </div>
    </div>
  );
}

export default App;