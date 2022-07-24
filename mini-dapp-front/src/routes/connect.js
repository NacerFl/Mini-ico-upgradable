import React, {useState} from 'react';
import { BigNumber, ethers } from 'ethers';

import './style.css'
import {Link, Routes, Route, useNavigate} from 'react-router-dom';
import { Alert  } from 'react-alert'


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
    

  
  
  

export default function Connector() {
    const navigate = useNavigate();

    
    const [email, setEmail] = useState(null);
    const [password,setPassword] = useState(null);

    const handleInputChange = (e) => {
        const {id , value} = e.target;
       
        if(id === "email"){
            setEmail(value);
        }
        if(id === "password"){
            setPassword(value);
        }
   

    }


    const handleClick = async() => {   
        //const newPostKey =await get(child(ref(database), '/'));

        console.log("in handle");
    const snapshot = await get(ref(database, '/'));
    if (!snapshot.exists()) {
        console.log("NOT EXIST");
      return null;
    }

    for(var key in snapshot.val()){
        console.log("snapshot key" + key);
        console.log("snapshot.val.url = " + snapshot.val()[key].email);

        console.log("snapshot.val.url = " + snapshot.val()[key].password);

        if(email == snapshot.val()[key].email && password ==  snapshot.val()[key].password){

            console.log("success");
            navigate('/home', {replace: true});
        }else(
            alert("VEUILLEZ ENTRER LE BON LOGIN ET MDP")
        )
        //console.log("snapshot.val" + snapshot.val()[key]);
        //nextUrl = snapshot.val()[key].url;
    }
   // console.log("thesnapval",snapshot.val());
    //console.log("thesnapval",newPostKey.val());

        
//    const snapshot = await get(ref(database, '/'));
//     //const query = ref.orderByChild('email');
    
//     console.log("the query",snapshot.orderByChild('email'));
  }



    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Connection</h2>

   
            <div className="email">
                <label className="form__label" for="email">Email </label>
                <input  type="email" id="email" className="form__input" value={email} onChange = {(e) => handleInputChange(e)} placeholder="Email"/>
            </div>
            <div className="password">
                <label className="form__label" for="password">Password </label>
                <input className="form__input" type="password"  id="password" value={password} onChange = {(e) => handleInputChange(e)} placeholder="Password"/>
            </div>

            <div class="footer">
            <button onClick={()=>handleClick()} type="submit" class="btn">Register</button>
        </div>
      </main>
    );
  }