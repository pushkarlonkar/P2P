import React, { Component, useState, useEffect } from "react";
import Web3 from "web3";
import RideJson from "./contracts/Ride.json";
// import "./App.css";
import { BrowserRouter as Router,Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login/Login.js";
import Home from "./pages/Home/Home.js";
import View from "./pages/View/View.js";
import AddRide from "./pages/AddRide/AddRide.js";

function App() {

  const [loader, setLoader] = useState(false);
  const [P2P, setP2P] = useState();
  const [curAcc, setCuracc] = useState();
  const [web3, setWeb3] = useState();
  // we need two states 
  // user 
  // driver
  const [userId, setUserId] = useState();
  const [user, setUser] = useState(); 
  const [rideDetails, setrideDetails] = useState("")


  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected . You should consider trying metamask!"
      );
    }
    console.log("Inside loadweb3");
  };


  const loadBlockchainData = async () => {
    // get the blockchain data here
    // let us code the smart contract now
    // what to do now let us start with making
    // we have to do the browser location
    setLoader(true);
    const web3 = window.web3;
    setWeb3(web3);
    // console.log("inside loadbc");
    const accounts = await web3.eth.getAccounts();
    // this.state.curAccount= accounts[0];
    setCuracc(accounts[0]);
    const networkId = await web3.eth.net.getId();

    const networkData = RideJson.networks[networkId];
    if (networkData) {
      const P2P = new web3.eth.Contract(
        RideJson.abi,
        networkData.address
      );
      setP2P(P2P);
      // pass this CN
      // and access the methods and variable using CN.methods().methodName().call();
      // console.log(CN);
    } else {
      window.alert("Contract Not Deployed to the net");
    }
    setLoader(false);
    console.log("inside load bc after false");
  };

  if (!window.ethereum) {
    return (
      <div>
        <p>No Ethereum Wallet Found</p>
      </div>
    );
  }

  const handlePostRide = (e) => {
    e.preventDefault();
    console.log("inside Post Ride");
    console.log(rideDetails);
    P2P.methods.postRide(rideDetails).send({ from: curAcc }).on("transactionHash", (hash) => {
        
        console.log("RIDE POSTED");
      }).catch((err) => {
        console.log("Error: Message: " + err.message);
      });
  };
  // loader
  if (loader) {
    return <div>LOADING.....</div>;
  }

  console.log(P2P);
  return (
    <div className="App">
      {/* <input
        type="text"
        id="ride"
        onChange={(e) => {
          setrideDetails(e.target.value);
        }}
        required
      />
      <div>
        <a
          href=""
          className="btn-large "
          style={{ width: "100%" }}
          onClick={handlePostRide}
        >
          REGISTER RIDER
        </a>
      </div> */}
      {/* <h1>hello world</h1>
      <p>{curAcc}</p> */}
      <Router>
        <Routes>
          
          {/* <Route exact path={"/home"} render={(props) => (<Home/>)}/> */}
          <Route exact path={"/home"} element={<Home P2P ={P2P} curAcc = {curAcc}/>}/> 
          <Route exact path={"/"} element={<Login P2P ={P2P} curAcc = {curAcc} setUserId = {setUserId} setUser = {setUser}/>}/>
          <Route exact path={"/view"} element={<View P2P ={P2P} curAccount = {curAcc} web3 = {web3} setUserId = {setUserId} setUser = {setUser}/>}/>
          <Route exact path={"/addRide"} element={<AddRide P2P ={P2P} curAcc = {curAcc} setUserId = {setUserId} setUser = {setUser} />}/>

          {/* <Route exact path={"/"} render={(props) => ( <Login
                cjson={P2P}
                curAccount={curAcc}
                setcitId={setcitId}
                setCitizen={setCitizen}
              />
            )}
          /> */}

          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
