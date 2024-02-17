import Azuki from './azuki.png';
import Eth from './eth.png';
import './App.css';
import React, {useState, useEffect} from "react";


function App() {

  const { ethers, JsonRpcProvider } = require('ethers');
  const [currentWallet, setCurrentWallet] = useState('');
  const [balance, setBalance]=useState('');
  const [provider, setProvider] = useState(null);
  
 


  useEffect(() => {
    checkExsistingWallet(); 
    addWalletListner();
  })
  useEffect(() => {
    // Create provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider);
  }, []);

  const connectWallet = async () =>{
    if(window.ethereum){
      try{
        const accounts = await window.ethereum.request({method:"eth_requestAccounts"});
        setCurrentWallet(accounts[0]);
        const balanceWei = await provider.getBalance(currentWallet);
      const balanceEther = ethers.utils.formatEther(balanceWei);
      console.log(balanceEther);
      setBalance(`${balanceEther} Eth`);
      } catch(error){
        console.error("Failed to connect",error);
      }
    }else{
      console.log("Install MetaMask");
    }
  }

  const checkExsistingWallet = async ()=> {
    if(window.ethereum){
      try{
        const accounts = await window.ethereum.request({method : "eth_accounts"});
        if(accounts.length > 0){
        setCurrentWallet(accounts[0]);
        const balanceWei = await provider.getBalance(currentWallet);
        const balanceEther = ethers.utils.formatEther(balanceWei);
        setBalance(`${balanceEther} Eth`);
        }
      }catch(error){
        console.error(error.message);
      }
      }
      else{
        console.log("Install MetaMask");
      }
    }

    const addWalletListner = async () =>{
      if(window.ethereum){
        window.ethereum.on("accountsChanged",fetchAccount);
      }

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', fetchAccount);
        }
      }

    }

    const fetchAccount = async () => {
      if(window.ethereum){
        const accounts = await window.ethereum.request({method : "eth_accounts"});
        if(accounts.length > 0 && balance!= "" ){
          setCurrentWallet(accounts[0]);
          const balanceWei = await provider.getBalance(currentWallet);
          const balanceEther = ethers.utils.formatEther(balanceWei);
          setBalance(`${balanceEther} Eth`);
        }
        else{
          setCurrentWallet('');
          setBalance('');
        }
      }else{
        console.log("Install Metamask");
      }

    }
  
  return (
    <div className="main-div">
    <div className="App">
        <img src={Azuki} className="azuki-logo" alt="logo" width={120} />
        <h4 >Check Ether</h4>
        <img src={Eth} className="eth-logo" alt="Ethereum" width={120}/>
        <h4 >Welcome to Ethereum balance checker</h4>
        <button onClick={connectWallet}>
          {!currentWallet ?  
            (<span className="btn-span">ConnectWallet</span>) :
            (<span className="btn-span">{currentWallet.substring(0,4)+'.....'+currentWallet.substring(38)}</span>)
          }
        </button>
        <h5>
          {currentWallet ? <span>Address : {currentWallet}</span>:( <h1></h1>)}
        </h5>
        <h5>
          {currentWallet ? <span>Balance : {balance}</span>:( <h1></h1>)}
        </h5>
    </div>
    </div>
  );
}

export default App;
