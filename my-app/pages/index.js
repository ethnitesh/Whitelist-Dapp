import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from "react";
import web3Modal from "web3modal";
import { providers, Contract } from 'ethers';
import { WHITELIST_CONTRACT_ADDRESS,abi } from "../constants";
import styles from '../styles/Home.module.css'


export default function Home() {
  // numberOfWhitelisted tracks the number of addresses's whitelisted
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  
  const[loading, setLoading] = useState(false);
  const [_joinedWhitelist, setJoinedWhitelist] = useState(false);
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();
  
  const getProviderOrSigner = async (needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const { chainId } = await web3Provider.getNetwork();

      if (chainId != 4) {
        window.alert("Change the network to ropsten");
        throw new Error("Change the network to ropsten");
      }
      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    } catch (error) {
      console.log(error);
    }
  }

  const addAddressToWhitelist = async() => {
    try {
      var signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
      const tx = await whitelistContract.addAddressToWhitelisted();
      setLoading(true);
      await tx.wait();
      setLoading(false); 
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } 
     catch (error) {
      console.log(error);
    }
  }

  const checkIfAddressIsWhitelisted = async () => {
    try {
      var signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(address);
      setJoinedWhitelist(_joinedWhitelist);
    } catch (error) {
      console.log(error);
    }
  }

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner(true);
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, provider);
      const _numOfWhitelisted = await whitelistContract.numAddressWhitelisted();
      setNumberOfWhitelisted(_numOfWhitelisted);
    } catch (error) {
      console.log(error);
    }
  }
 
  const renderButton = () =>{
    if(walletConnected){
      if(_joinedWhitelist)
      {
        return(
          <div className={styles.description}>
            Thanks for joioning the whitelist!
          </div>
        );
      }else if(loading) {
        return <button className='{style.button}'>loading......</button>
      }
      else{
        return (
        <button onClick={addAddressToWhitelist} className={styles.description}> join the whitelist </button>
        );
      }
    } else{
      return(
        <button onClick={addAddressToWhitelist} className={styles.description}> join the whitelist </button>
        );
      }
    };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new web3Modal({
        network: "ropsten",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);


  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.png" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Nitesh
      </footer>
    </div>
  );
}
