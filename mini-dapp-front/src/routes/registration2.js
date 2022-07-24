import React, {useState} from 'react';
import { BigNumber, ethers } from 'ethers';

import './style.css'
import {Link, Routes, Route, useNavigate} from 'react-router-dom';
import { Alert  } from 'react-alert'


const { initializeApp } = require ("firebase/app");

const { getDatabase, set,get,push,ref,child,update } = require ("firebase/database");

const firebaseConfig = {

    apiKey: "AIzaSyAgj3ZB5uPI4KMjRRNyppCSA2f78T5BVi4",
  
    authDomain: "registrationdb-14662.firebaseapp.com",
  
    databaseURL: "https://registrationdb-14662-default-rtdb.europe-west1.firebasedatabase.app",
  
    projectId: "registrationdb-14662",
  
    storageBucket: "registrationdb-14662.appspot.com",
  
    messagingSenderId: "817365233422",
  
    appId: "1:817365233422:web:c2ed98f6ec1bbda400f15f"
  
  };
  
  
  // Initialize Firebase
  
  const app = initializeApp(firebaseConfig);

  const database = getDatabase(app);



function RegistrationForm2() {
    const navigate = useNavigate();
    const [currentAccount, setCurrentAccount] = useState(null);

    //const alert = useAlert()
    //alert = (type, mssg) => props.alert[type](mssg)
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
        //const { ethereum } = window;

        //const accounts = await ethereum.request({ method: 'eth_accounts' });
        const wallet = ethers.Wallet.createRandom();
        console.log('address:', wallet.address);
        console.log('mnemonic:', wallet.mnemonic.phrase);
        console.log('privateKey:', wallet.privateKey);

        let mnemonic =  wallet.mnemonic.phrase;
        let privateKey = wallet.privateKey;
        let obj = {
                firstName : firstName,
                lastName:lastName,
                email:email,
                address: wallet.address,
                password:password,
                confirmPassword:confirmPassword,
            }       
        const newPostKey = push(child(ref(database), 'posts')).key;
        const updates = {};
        updates['/register' + newPostKey] = obj
         update(ref(database), updates);
        console.log("in handle");
        alert('YOUR WALLET ADDRESS IS \n  '+wallet.address + '\n THE PRIVATE KEY IS'+ privateKey+ '\n THE mnemonic is: \n'+ wallet.mnemonic.phrase+'\n Please make sure to save it Use the mnemonic to connet to metamask')
        
        setTimeout( navigate('/home', {replace: true}),5000);
       
    }
    

    //ETHEREUM CONNECT WALLET BUTTON


    
      ///////////////////


    return(
        <div className="form">
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
export default RegistrationForm2;