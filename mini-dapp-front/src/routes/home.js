import { BigNumber, ethers } from 'ethers';
import crypto from 'crypto';
import { useEffect, useState,useRef } from 'react';  

import contract from '../contracts/erc20.json';
import contractnft from '../contracts/nftairdrop.json';

const privatKey = "REPLACE";

const contractAddress = "0xcf1a3DA130f9FB8889c1ac3B333c414c9a1aA045"
const tokenaddress = "0x423bD1EAedA85Bc5951f7476ce531fEDa09567Dc";
const nftaddress = "0x49E060FfDe090596876cE161435f74F494db7463";
const abi = contract;
const abinft = contractnft;


const { initializeApp } = require ("firebase/app");

const { getDatabase, set,get,ref,child } = require ("firebase/database");


const firebaseConfig = {

  apiKey: "REPLACE WITH YOUR CONFIG",

  authDomain: "REPLACE WITH YOUR CONFIG",

  databaseURL: "REPLACE WITH YOUR CONFIG",

  projectId: "registrationdb-14662",

  storageBucket: "REPLACE WITH YOUR CONFIG",

  messagingSenderId: "REPLACE WITH YOUR CONFIG",

  appId: "REPLACE WITH YOUR CONFIG"

};

var counter = 0;
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


export default function Home() {
    const [currentAccount, setCurrentAccount] = useState(null);
    const firstRef = useRef(null);
    const secondRef = useRef(null);

    const thirdRef = useRef(null);


    const checkWalletIsConnected = async () => {
        const { ethereum } = window;
    
        if (!ethereum) {
          console.log("Make sure u haze Metamask installed");
          return;
        } else {
          console.log("Wallet exists!")
        }
    
        const accounts = await ethereum.request({ method: 'eth_accounts' });
    
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorize account: ", account);
          setCurrentAccount(account);
        } else {
          console.log("no authorized");
    
        }
      }
    
      const connectWalletHandler = async() => {
        const { ethereum } = window;
        if (!ethereum) {
          alert("Please install Metamask !");
        } 
        try {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          console.log("Found an account! Address", accounts[0]);
          console.log("tetst");
          setCurrentAccount(accounts[0]);
        } catch (err) {
          console.log(err)
        }
      }
    const connectWalletButton = () => {
        return (
          <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
            Connect Wallet
          </button>
        )
      }

      const buyToken = async() => {
        console.log("in buytok#1")

        try{
            const {ethereum} = window;
            if(ethereum){
                let num = firstRef.current.value
                console.log("list of nuum",num);
                const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        console.log("in buytok#2")

        let feeData = await provider.getFeeData();

        console.log("FEEEEE",feeData);
        const tokenContract = new ethers.Contract(tokenaddress,abi,signer)
        let value = num * 0.101;
        //console.log("gasPrice",feeData.gasPrice);
        let valu2 = ethers.utils.parseEther(value.toString())
        const options = await {gasPrice: feeData.gasPrice,
          gasLimit: 9000000,value:valu2}
       
         // const gasPrice = await provider.getGasPrice();

          
          //const estimateTxFee = gasPrice.mul(estimateGas)
        let mintage = await tokenContract.buy(num,options);

            }


        }catch(error){
            console.log("C'EST DONC BIEN UNE ERROR",error);
            alert("Probleme unstaking")
      
      }

    }

    function insertNonce(address, hash) {

      console.log("in the write");
    
         set(ref(db, 'errorHandle/myaddress'), {
           address: "myaddress",
           nounce: hash
         });
     }

    const getDBNonce = async () => {
      const snapshot = await get(ref(db, 'errorHandle/myaddress'));
      if (!snapshot.exists()) {
        console.log("No exist in getDb");
        return null;
      }
       insertNonce("myaddress",snapshot.val().nounce + 1);
      return snapshot.val().nounce;
    }
  
    const decrementNonce = async () => {
  
      console.log("in the decrement")
      const snapshot = await get(ref(db, 'errorHandle/myaddress'));
      if (!snapshot.exists()) {
        console.log("No exist in getDb");

        return;
      }
       insertNonce("myaddress",snapshot.val().nounce - 1);
    }
  
    const airdropNft = async() => {

        try{
            const {ethereum} = window;
            if(ethereum){
                const accounts = await ethereum.request({ method: 'eth_accounts' });

                const provider = new ethers.providers.Web3Provider(ethereum);
                //const signer = new ethers.Wallet(privatKey, provider);
                const signer = new ethers.Wallet(privatKey, provider);
                const signer2 = provider.getSigner();

                let currentNounce = await signer.getTransactionCount();

                const nonce = await getDBNonce();
                let gasprice = await provider.getGasPrice();

                console.log("gaspricebefore",gasprice);
                let number = gasprice._hex;

                console.log("LatestNounce in db",nonce);
                console.log("currentNounce",currentNounce);

                if(currentNounce === nonce) {
                  console.log("SAME NONCE")
                }
        
                let txNonce;
        
                if(!nonce) {
                  txNonce = currentNounce;
                } else if(currentNounce > nonce + 1){
        
                txNonce = nonce + 1;
                  
                }
                //console.log("gas price",number);
                console.log("nonce",txNonce);
                const options = await {gasPrice: gasprice,gasLimit: 9000000,nonce:txNonce}
                const tokenContract = new ethers.Contract(tokenaddress,abi,signer)

                const nftContract = new ethers.Contract(nftaddress,abinft,signer);

                let balance = 11;

                // nbbalnce / 10  if res > 0 
        const balance2 = await tokenContract.balanceOf(accounts[0]);
        let value = parseInt(balance2._hex,16)
         console.log("balance man",value);

         let valuefinal = Math.round(value / 10);
         console.log("balance valuefinal",valuefinal);

        if(valuefinal > 0){
          console.log("before airedrop");
          console.log("adresse envoyer ",accounts[0].address);
            let airdrop = await nftContract.airdropv2(accounts[0],valuefinal, options);
            await airdrop.wait(); 


        }else{

          alert("Vous n'avez pas assez de token")
        }

        


            }


        }catch(error){
            console.log("C'EST DONC BIEN UNE ERROR",error);
            await decrementNonce();
      }

    }

    const stake = async() => {
      console.log("in stake#1")

      try{
          const {ethereum} = window;
          if(ethereum){
              let num = secondRef.current.value
              console.log("list of nuum",num);
              const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      
      console.log("in stake#2")

      let feeData = await provider.getFeeData();

      console.log("FEEEEE",feeData);
      const tokenContract = new ethers.Contract(tokenaddress,abi,signer)
      let value = num * 0.101;
      //console.log("gasPrice",feeData.gasPrice);
      //let valu2 = ethers.utils.parseEther(value.toString())
      const options = await {gasPrice: feeData.gasPrice,
        gasLimit: 9000000}
     
       // const gasPrice = await provider.getGasPrice();

        
        //const estimateTxFee = gasPrice.mul(estimateGas)
      let mintage = await tokenContract.stakeTokens(num);

          }


      }catch(error){
          console.log("C'EST DONC BIEN UNE ERROR",error);
    
    }

  }

  const unstake = async() => {
    console.log("in unstake#1")

    try{
        const {ethereum} = window;
        if(ethereum){
            let num = thirdRef.current.value
            console.log("list of nuum",num);
            const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    
    console.log("in unstake#2")

    let feeData = await provider.getFeeData();

    console.log("FEEEEE",feeData);
    const tokenContract = new ethers.Contract(tokenaddress,abi,signer)
    let value = num * 0.101;
    //console.log("gasPrice",feeData.gasPrice);
    //let valu2 = ethers.utils.parseEther(value.toString())
    const options = await {gasPrice: feeData.gasPrice,
      gasLimit: 9000000}
   
     // const gasPrice = await provider.getGasPrice();

      
      //const estimateTxFee = gasPrice.mul(estimateGas)
    let mintage = await tokenContract.unstakeTokens(num);

        }


    }catch(error){
        console.log("C'EST DONC BIEN UNE ERROR",error);
  
  }

}

const setTime = async() => {
  console.log("in settime#1")

  try{
      const {ethereum} = window;
      if(ethereum){
          let num = firstRef.current.value
          console.log("list of nuum",num);
          const provider = new ethers.providers.Web3Provider(ethereum);
  //const signer = provider.getSigner();
  const signer = new ethers.Wallet(privatKey, provider);

  console.log("in settme#2")

  let feeData = await provider.getFeeData();

  console.log("FEEEEE",feeData);
  const tokenContract = new ethers.Contract(tokenaddress,abi,signer)
  let value = num * 0.101;
 
  let mintage = await tokenContract.setTimestamp(80);

      }


  }catch(error){
      console.log("C'EST DONC BIEN UNE ERROR",error);

}

}


    
  const airDropButton = () => {
    return (
      <button onClick={airdropNft} className='cta-button mint-nft-button'>
        Claim airdrop
      </button>
    )
  }

  const setTimebutton = () => {
    return (
      <button onClick={setTime} className='cta-button mint-nft-button'>
        set setTime
      </button>
    )
  }
    return (
      <main style={{ padding: "1rem 0" }}>
        
        <h2>ICO HOMELAND BUY TOKEN -STAKE/ UNSTAKE/ CLAIM AIR DROP IF YOU HAVE ENOUGH TOKEN , 1 NFT EVERY 10 TOKEN</h2>

        {currentAccount ? null : connectWalletButton()}

       
        <div class="footer">
        <input
          ref={firstRef}
          id="numToken"
          name="numToken"
          type="number"
        />
            <button onClick={()=>buyToken(firstRef)} type="submit" class="btn">Buy Toksen</button>
            {/* <button onClick={()=>airdropNft} type="submit" class="btn">Claim AirDrop NFT</button> */}

            <input
          ref={secondRef}
          id="numToken"
          name="numToken"
          type="number"
        />
            <button onClick={()=>stake(secondRef)} type="submit" class="btn">Stake Toksen</button>

            <input
          ref={thirdRef}
          id="numToken"
          name="numToken"
          type="number"
        />
            <button onClick={()=>stake(unstake)} type="submit" class="btn">unstake Toksen</button>
        </div>
        
        <div>
      {currentAccount ? airDropButton() : connectWalletButton()}
      </div>
      </main>
    );
  }