import React, {useState} from 'react';
import './style.css'
import {Link, Routes, Route, useNavigate} from 'react-router-dom';

const { initializeApp } = require ("firebase/app");

const { getDatabase, set,get,push,ref,child,update } = require ("firebase/database");

const firebaseConfig = {

  apiKey: "REPLACE WITH YOUR CONFIG",

  authDomain: "REPLACE WITH YOUR CONFIG",

  databaseURL: "REPLACE WITH YOUR CONFIG",

  projectId: "registrationdb-14662",

  storageBucket: "REPLACE WITH YOUR CONFIG",

  messagingSenderId: "REPLACE WITH YOUR CONFIG",

  appId: "REPLACE WITH YOUR CONFIG"

};

  
  
  // Initialize Firebase
  
  const app = initializeApp(firebaseConfig);

  const database = getDatabase(app);



function RegistrationForm() {
    const navigate = useNavigate();
    const [currentAccount, setCurrentAccount] = useState(null);


    //DB REGISTRATION FORM
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password,setPassword] = useState(null);
    const [confirmPassword,setConfirmPassword] = useState(null);

    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "firstName"){
            setFirstName(value);
        }
        if(id === "lastName"){
            setLastName(value);
        }
        if(id === "email"){
            setEmail(value);
        }
        if(id === "password"){
            setPassword(value);
        }
        if(id === "confirmPassword"){
            setConfirmPassword(value);
        }

    }

    const handleSubmit = async() =>{
        const { ethereum } = window;

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        let obj = {
                firstName : firstName,
                lastName:lastName,
                email:email,
                address:currentAccount,
                password:password,
                confirmPassword:confirmPassword,
            }       
        const newPostKey = push(child(ref(database), 'posts')).key;
        const updates = {};
        updates['/register' + newPostKey] = obj
         update(ref(database), updates);
        console.log("in handle");
        navigate('/home', {replace: true});
    }
    

    //ETHEREUM CONNECT WALLET BUTTON

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
      ///////////////////


    return(
        <div className="form">
                  {currentAccount ? null : connectWalletButton()}

        <div className="form-body">
            <div className="username">
                <label className="form__label" for="firstName">First Name </label>
                <input className="form__input" type="text" value={firstName} onChange = {(e) => handleInputChange(e)} id="firstName" placeholder="First Name"/>
            </div>
            <div className="lastname">
                <label className="form__label" for="lastName">Last Name </label>
                <input  type="text" name="" id="lastName" value={lastName}  className="form__input" onChange = {(e) => handleInputChange(e)} placeholder="LastName"/>
            </div>
            <div className="email">
                <label className="form__label" for="email">Email </label>
                <input  type="email" id="email" className="form__input" value={email} onChange = {(e) => handleInputChange(e)} placeholder="Email"/>
            </div>
            <div className="password">
                <label className="form__label" for="password">Password </label>
                <input className="form__input" type="password"  id="password" value={password} onChange = {(e) => handleInputChange(e)} placeholder="Password"/>
            </div>
            <div className="confirm-password">
                <label className="form__label" for="confirmPassword">Confirm Password </label>
                <input className="form__input" type="password" id="confirmPassword" value={confirmPassword} onChange = {(e) => handleInputChange(e)} placeholder="Confirm Password"/>
            </div>
        </div>
        <div class="footer">
            <button onClick={()=>handleSubmit()} type="submit" class="btn">Register</button>
        </div>
    </div> 
    )       
}
export default RegistrationForm;