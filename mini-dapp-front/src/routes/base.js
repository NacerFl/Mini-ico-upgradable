import React, {useState} from 'react';
import { BigNumber, ethers } from 'ethers';

import './style.css'
import {Link, Routes, Route, useNavigate} from 'react-router-dom';
import { Alert  } from 'react-alert'

import { getAuth } from "firebase/auth";
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
  export const auth = getAuth();
  const database = getDatabase(app);
  export default app;