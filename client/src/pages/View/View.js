import React, { useState, useEffect, useReducer } from "react";
import M from "materialize-css";
import "./View.css";
import { Redirect } from "react-router-dom";
import Web3 from "web3";
import { ethers } from "ethers";

// const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:" + port));

const View = ({ P2P, curAccount, web3, citizen }) => {
  // get the rides and display them then look for the action
  // we need to get the total number of rides
  // we need to get the status it is in the complain
  // so we do not need the police access
  // we want to propose the solution to the customer and if he is satisfied then then he can resolve and transfer funds
  // we need to make some changes in the smartcontract first
  // finish it up today
  // so let us start with what we want to be the features of this app
  // first register done
  // we need you are not authorised for making the changes necessary
  // so what are different status     Pending Proposed and Resolved are the 3 states
  // remove the police
  // what are the button required
  // 1. funding 2.Proposed Solution 3. Accept the proposal 4. decline the request
  // let us start with funding we need to just increase the reward by the value
  // so we need to start with making the resolve work
  // resolve should only be accessed by the owner of the complaint
  // and then the transfer would take place from the owner to the contributors
  // So what are the extra things we need to do
  // 1. Clean up the project
  // 2. Handle the errors
  // ? Cards
  // 3. Improve the UI
  // 4. Propose Solution and get
  // Let us start handling the errors
  // handling the errors  let us get started with it
  // if curAccount != complainUser Account then dont show the accept and reject buttons
  // done with it now let us start with making the values
  // now we need to make some changes in register first
  // how to update without reloading just reload the state in react
  // which state we need ot
  // so where to start with
  // let us make it right and do the necessary things
  // toasts are working but some things need refreshing
  // let us start with error handling
  // we need to detect the error before opening the contract and transaction and display the error
  // so that the user will know about it
  // so what are the things left to do
  // let us start with some designing so what to add in the back
  // so we need to start with making the location to be equal to th
  // so how to solve the location problem it is not getting the current

  useEffect(() => {
    // getLocation();
    getRides();
  }, []);
  const [rides, setRides] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [complainCount, setComplainCount] = useState();
  const [loader, setLoader] = useState(false);
  const [fundSt, setFundSt] = useState();
  const [fundId, setFundId] = useState();
  const [fund, setFund] = useState();
  const [propId, setPropId] = useState();
  const [propSt, setPropSt] = useState();
  const [solution, setSolution] = useState();
  const [status, setStatus] = useState();
  const [solnarray, setsolnarray] = useState([]);
  const [curFile, setcurFile] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  const getRides = async () => {
    setLoader(true);
    setLoggedIn(true);
    // getLocation();
    // getlocation is not setting the get the location in home then pass it down to here
    // get the rides here
    // first get the complain count
    // that is the total number of complaints and then iterate over them and then
    // display them on the table
    // got the counter
    // work on status and action today so let us start
    // show rides in my area only
    // start with transfering the funds how to transfer the funds
    // send it from
    // load everything in the array just show the one where condtion is satisfied

    console.log("Inside P2P");
    if (P2P) {
      console.log("Inside ");
      const r = await P2P.methods.getRideCount().call();
      const a = await P2P.methods.getAuctionCount().call();
      setComplainCount(r);
      // set the
      // the problem is the rides are not getting set
      // make the rides
      console.log(r);
      for (var i = 1; i <= r; i++) {
        const ride = await P2P.methods.fetchRide(i).call();
        if(ride.id>0){
          setRides((rides) => [...rides, ride]);
        } 
        // console.log(ride);
        // console.log(comp[].substr(0,3));
  
          // add it to the array
        // setsolnarray((solnarray) => [...solnarray, sol]);np
      }

      // for (var i = 1; i <= a; i++) {
      //   const auction = await P2P.methods.fetchAuction(i).call();
        
      //   // console.log(auction);
      //   // console.log(comp[].substr(0,3));
  
      //     // add it to the array
      //   setRides((auctions) => [...auctions, auction]);
      //   // setsolnarray((solnarray) => [...solnarray, sol]);
      // }
    }
    console.log(rides);
    // console.log(rides);
    // console.log(auctions);
    
    // console.log(P2P);
    // if (rides.length != 0) {
    //   console.log(rides);
    // }
    setLoader(false);
  };


  


  
  const handleAcceptSolution = (e, file,arr) => {
    e.preventDefault();
    // what is there in accept solution
    // console.log(tid);
    const tid = file[0];
    console.log("Inside Ride complete");
    // get the reward and transfer it from here value :
    // we need to get the reciever here
    // transfer is not working so what to do make
    // get the reward and then the complain solver
    const result = file.driver;

    
      // so what can we do to get the rewards start with making
    const rew = arr[4];
    const weival = rew*6_720_081_932_796;
    if(file.driver==curAccount || file.customer==curAccount){
      web3.eth.sendTransaction(
        { from: curAccount, to: result, value: weival },
        function (err, transactionHash) {
          if (err) {
            console.log(err);
            M.toast({
              html: "Error in Transaction",
              classes: " red accent-4 darken-1 white-text",
            });
          } else {
            console.log("TRANSACTION HASH " + transactionHash);
            P2P.methods
              .completeRide(tid)
              .send({ from: curAccount })
              .then(() => {
                console.log("FUNCTION RESOLVED AND FUND TRANSFERRED");
                M.toast({
                  html: "RIDE COMPLETED",
                  classes: " green accent-4 darken-1 white-text",
                });
                window.location.reload();
              })
              .catch((err) => {
                console.log(err);
                M.toast({
                  html: "Error in Transaction",
                  classes: " red accent-4 darken-1 white-text",
                });
                console.log("ERROR IN RIDE COMPLETION");
              });
          }
        }
      );
    }
    

    // we have sent the complain to the
  };




  const handleDeclineSolution = (e, tid) => {
    e.preventDefault();
    P2P.methods
      .cancelRide(tid)
      .send({ from: curAccount })
      .then(() => {
        console.log("RIDE CANCELLED");
        M.toast({
          html: "RIDE CANCELLED",
          classes: " red accent-4 white-text",
        });

        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        console.log("ERROR IN DECLINE PROPOSAL");
      });
  };

  
  
  const renderStatus = (f) => {
    if (f == 0) {
      return (
        <div className="blue-text">
          <p style={{ fontSize: "15px", fontWeight: "bold" }}>POSTED</p>
        </div>
      );
    } else if (f == 1) {
      return (
        <div className="green-text">
          <p style={{ fontSize: "15px", fontWeight: "bold" }}>CONFIRMED</p>
        </div>
      );
    } else if (f == 2) {
      return (
        <div className="red-text">
          <p style={{ fontSize: "15px", fontWeight: "bold" }}>CANCELLED</p>
        </div>
      );
     
    } else {
      return (
        <div className="grey-text">
          <p style={{ fontSize: "15px", fontWeight: "bold" }}>COMPLETED</p>
        </div>
      );
    }
  };
  const showMyComplains = () => {};
  
  // const descHand= (S)=>{
  //   console.log("Inside descHand");
  //   const arr = S.split(' ');
  //   // got the array now 
  //   console.log(S);
  //   console.log(arr);
  //   var s = "";
  //   for(var i = 0;i<arr.length;i++){
  //     if(i%4==0){
  //       s.concat("\n");
  //     }
  //     s.concat(arr[i]+" ");
  //   }
  //   console.log(s);
  //   return(
  //   <div>
  //     {s}
  //   </div>
  //   )
  // }
  

  // if (loader) {
  //   return <div>Loading....</div>;
  // }

  const handleBookRide = (e, file) => {
    e.preventDefault();
    const tid = file[0];
    console.log(curAccount);
    // const cust = P2P.methods
    //   .getCustomer(curAccount)
    //   .call();

    console.log(tid);

    P2P.methods
      .bookRide(tid)
      .send({ from: curAccount })
      .then(() => {
        console.log("RIDE BOOKED");
        M.toast({
          html: "RIDE BOOKED SUCCESSFULLY",
          classes: " green accent-4 white-text",
        });

        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        console.log("ERROR IN BOOKING RIDE");
      });
  };


  const buttons = (file,arr)=>{
    // e.preventDefault();
    // console.log("Inside buttons");
    // console.log(file);
    if(file.status==0){
      // console.log("Inside booked");
      return (
          <div className="col s6 m6 l2 btn-div">
            <a
              href=""
              className="btn-small btna blue"
              onClick={(e) => {
                handleBookRide(e, file);
              }}
            >
              BOOK
            </a>
        </div>
      )
    }else if(file.status==1){
      return(
        <div>
        <div className="col s6 m6 l2 offset-l1 btn-div"></div>      
        <div className="col s6 m6 l2 offset-l1">
          <a
            href=""
            className="btn-small btna green lighten-1"
            onClick={(e) => {
              handleAcceptSolution(e, file,arr);
            }}
          >
            <i className="material-icons">done</i>
          </a>
        </div>
        <div className="col s6 m6 l2 offset-l1">
          <a
            href=""
            className="btn-small btna red darken-1"
            onClick={(e) => {
              handleDeclineSolution(e, file[0]);
            }}
          >
            <i className="material-icons">delete</i>
          </a>
        </div>
        </div>
      )
    }
  }

  const handleFare = (fare) => {
    const twei = Math.round((fare*6481.35)/10)/100;
    return(
      <div> 
        <h6 className="green-text">
          <strong>
          ₹ {fare}
          </strong>
        </h6>
        <div>
          {twei} twei
        </div>
      </div>
    )
  }

  return (
    <div className="main">
      <div className="c">
        <div className="section center teal darken-3 white-text">
          <h3>RIDES</h3>
        </div>
        <div className="divider"></div>
        <div className="section">
          <table className=" responsive-table highlight centered">
            <thead>
              <tr>
                <th>ID</th>
                <th>SOURCE</th>
                <th>DESTINATION</th>
                <th>DISTANCE</th>
                <th>DURATION</th>
                <th>FARE<span class="iconify" data-icon="mdi:ethereum"></span></th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {rides.map((file, key) => {

                
                var ride = file[4]+'';
                const arr = ride.split("#");
                // console.log(arr);
                return (
                  <tr key={key} className="blue lighten-5">
                    <td>{file.id}</td>
                    <td>{arr[0]}</td>
                    <td>{arr[1]}</td>
                    <td>{arr[2]}</td>
                    <td>{arr[3]}</td>
                    <td>{handleFare(arr[4])}</td>
                    <td>{renderStatus(file.status)}</td>
                    <td>
                    <div className="row">
                      {buttons(file,arr)}
                    </div>
                    </td>
                  </tr>
                );
              })}
              <tr></tr>
            </tbody>
          </table>
        </div>
        {/* <div className="divider"></div> */}
        <div className="section">
          <div className="row">
            <div className="col s12 l6">
              </div>
            <div className="col s12 l6 hide-on-small-only">
              <p style={{ fontSize: "18px" }}>CurentUser : {curAccount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
