import {CONTRACT_ADDRESS, transformCharacterData} from './constants'
//import myEpicGame from './utils/MyEpicGame.json'
import React, {useEffect, useState} from 'react';
import { ethers } from 'ethers'
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

import SelectCharacter from './Components/SelectCharacter';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null)
  const [characterNFT, setCharacterNFT] = useState(null)

  const checkIfWalletIsConnected = async () => {
    try {
      const {ethereum} = window
      if (!ethereum) {
        console.log('Make sure you have MetaMask!')
        return
      }
      else {
        console.log('We have the ethereum object', ethereum)
        const accounts = await ethereum.request({method:'eth_accounts'})
        if (accounts.length !== 0) {
          const account = accounts[0]
          console.log('Found an authorized account: ', account)
          setCurrentAccount(account)
        }
        else {
          console.log('No authorized account found')
        }
      }
    }
    catch (error) {
      console.error('app err', error)
    }
  }

  const connectWalletAction = async() => {
    try {
      const {ethereum} = window
      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }
      const accounts = await ethereum.request({method: 'eth_requestAccounts'})
      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])
    }
    catch (error) {
      console.error('connectWallet err', error)
    }
  }

  const renderContent = () => {
    /*
    * Scenario #1
    */
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://media1.giphy.com/media/3o7WTDcWSb5aibrg8U/200w.webp?cid=ecf05e47f05pjseiw9yabcn35ttwf5y6cqbzuemmy50o88k0&rid=200w.webp&ct=g"
            alt="Genshin Probst"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
      * Scenario #2
      */
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    }
  };
  
  useEffect(()=>{
    checkIfWalletIsConnected();
  }, [])

  useEffect(() => {
    const fetchNFTMetaData = async () => {
      console.log('Checking for Character NFT on address:', currentAccount)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      )

      const txn = await gameContract.checkIfUserHasNFT()
      if (txn.name) {
        console.log('User has character NFT')
        setCharacterNFT(transformCharacterData(txn))
      }
      else {
        console.log('No character NFT found')
      }
    }

    if (currentAccount) {
      console.log('Current account:', currentAccount)
      fetchNFTMetaData()
    }
  }, [currentAccount])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">🎭原神 Survivor🎭</p>
          <p className="sub-text">!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
