import React, { useEffect, useState } from "react";
import M from "materialize-css";
import "./Login.css";
import img from "../Content/121.svg";
import { useNavigate } from "react-router-dom";



const Login = ({ P2P,curAcc,setUser,setUserId}) => {
  // she is good at talking
  // get the value
  //  make the login uthentication page over here
  //  we need cjson then we need the
  /* Steps for Login 
        1. Make the frontend
        2. Changes in Smartcontract
            i. Add citizen construct to store 
                Username password msg.sender name email phone number 
                Store all these details in the struct 
                write a funtion to add to register 
                for login we need to just check 2 things  1. is it present 
                                                          2. Is the password right 
                                                          done with it 
        3. Integrate with the frontend 
            login for view and check 
            register call register and add the details to the mapping 
            we are gonna get the cid of a particular citizen through which we can navigate   
            register the value with making                 
            just a little weed with a little bit o cash with a little bit of this with a little bit of that
        now we need to add the user to the blockchain so let us start with that
    */
  // let us start with login and details so what is the value
  // start with it now  let us begin
  // so what are the changes needed
  // getting the location +-100 then it will display
  // change the name to lost and
  const navigate = useNavigate();
  useEffect(() => {
    const options = {
      swipeable: true,
    };

    let el = document.querySelectorAll(".tabs");
    M.Tabs.init(el, options);
  }, []);

  const [username, setUsername] = useState();
  const [lpassword, setLpassword] = useState();
  const [matched, setMatched] = useState();
  // const [name, setName] = useState();
  // const [email, setemail] = useState();
  const [rpassword01, setRpassword01] = useState();
  const [rpassword02, setRpassword02] = useState();

  // set up  the  registration details
  // we need to pass this cid to so let us define it in App.js


  //? DRIVER 

  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [email, setEmail] = useState();
  const [aadhar, setAadhar] = useState();
  const [vehicle, setVehicle] = useState()
  const [vehicleNumber, setVehicleNumber] = useState()
  const [et,setEt] = useState("");
  const [per,setPer] = useState();

  const handleLogin = async (e) => {
    
    console.log("Inside Login");
    e.preventDefault();
    if (username && lpassword) {
      const id = await P2P.methods.LoginCitizen(username, lpassword).call();
      const p = await P2P.methods.getDriver(curAcc).call();
      console.log(id);
      setPer(p);
      if (id > 0) {
        setUserId(id);
        // const us = await P2P.methods.viewCitizen(id).call();
        // setUser(us);
        // console.log(us);
        console.log("success Login");
        setMatched(true);
      } else {
        setMatched(false);
      }
    }
    // if the matched is true move to next page
    // else give an error message saying that username or password is incorrect
    // call linking function
  };

  const renderError = (e) => {
    console.log("inside render error");
    if (matched == false) {
      return (
        <div className="red-text">
          <p>Incorrect Email/Password</p>
        </div>
      );
    } else if (matched == true) {
      // then route to the home page
      // get the address and the account
      // route to the home page how to do that
      console.log("Inside navigate");
      if(per.id>0){
        navigate("/addRide");
      }else{
        navigate("/view");
      }
    } else {
      return <div></div>;
    }
  };


  const handleRiderRegistration = (e) => {
    e.preventDefault();
    console.log("inside register Rider");
    
    P2P.methods.registerCitizen(name, email, rpassword01, address,aadhar,0,et,et).send({ from: curAcc }).on("transactionHash", (hash) => {
        setLpassword(null);
        setMatched(null);
        setName(null);
        setRpassword01(null);
        setUsername(null);
        setAadhar(null);
        setEmail(null);
        setName(null);
        setVehicle(null);
        setVehicleNumber(null);
        console.log("successful Rider");
      }).catch((err) => {
        console.log("Error: Message: " + err.message);
      });


      const cust = P2P.methods
      .getCustomer(curAcc)
      .call();
      console.log(cust);
  };


  const handleDriverRegistration = (e) => {
    e.preventDefault();
    console.log("inside register driver");  
    console.log(typeof( name)+" "+typeof(email)+" "+typeof(rpassword01)+" "+typeof(address)+" "+typeof(aadhar)+" "+typeof(vehicleNumber)+" "+typeof(vehicle));
    P2P.methods.registerCitizen(name, email, rpassword01, address,aadhar,1,vehicleNumber,vehicle ).send({ from: curAcc }).on("transactionHash", (hash) => {
      console.log("success Driver");  
      setLpassword(null);
        setMatched(null);
        setName(null);
        setRpassword01(null);
        setUsername(null);
        setAadhar(null);
        setEmail(null);
        setName(null);
        setVehicle(null);
        setVehicleNumber(null);
      }).catch((err) => {
        console.log("Error: Message: " + err.message);
      });
  };


  
  console.log("In Login");

  // return (
  //   <div>
  //     <h1>This is it I want</h1>
  //   </div>
  // )
  return (
    <div className="main">
      
      <div className="row">

        <div className="col s12 m4 formdiv first ">
        <h3 className="center">Login</h3>
        <div className="divider"></div>
        <div className="col s10 offset-s1 m8 l12 center-align">
                <div className="section ">
                    <div className="row">
                      <div className="col s12 input-field">
                        <input
                          type="email"
                          id="email1"
                          className="validate"
                          onChange={(e) => {
                            setUsername(e.target.value);
                          }}
                          required
                        />
                        <label htmlFor="email1">Email</label>
                      </div>

                      <div className="col s12 input-field">
                        <input
                          type="password"
                          className="validate"
                          id="password"
                          onChange={(e) => {
                            setLpassword(e.target.value);
                          }}
                          required
                        />
                        <label htmlFor="password">Password</label>
                      </div>
                      <div className="col s12 left-align">
                        <form action="">
                          <label>
                            <input type="checkbox" id="cb" />
                            <span htmlFor="cb">Keep Me Logged in</span>
                          </label>
                        </form>
                      </div>

                      <div className="col s12 btnm">
                        <a
                          href=""
                          onClick={handleLogin}
                          className="btn-large"
                          style={{ width: "100%" }}
                        >
                          LOGIN
                        </a>
                      </div>
                      <div className="col s12">
                        <a href="">Forgot Password?</a>
                      </div>
                      <div className="col s12">{renderError()}</div>
                    </div>
          </div>
          </div>
        </div>




        <div className="col s12 m8 formdiv ">
          <h3 className="center">REGISTER</h3>
          <div className="divider"></div>
          <div className="row">
            <div className="col s12 m2 l1 "></div>
            <div className="col s10 offset-s2 m8 l10 center-align">
              <div className="row">
                <ul id="tabs-swipe-demo" className="tabs transparent">
                  <li className="tab col s6">
                    <a className="active black-text" href="#test-swipe-1">
                      DRIVER
                    </a>
                  </li>
                  <li className="tab col s6">
                    <a className="black-text" href="#test-swipe-2">
                      RIDER
                    </a>
                  </li>
                </ul>
                <div id="test-swipe-1" className="col s12 ">
                  {/* get the value of */}
                  <div className="row">
                    <div className="col s12">
                      <div className="row">
                        <div className="col s12 m6 input-field">
                        <input
                          type="text"
                          id="name"
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                          required
                        />
                        <label htmlFor="name">Name</label>
                        </div>
                        <div className="col s12 m6 input-field">
                      <input
                        type="text"
                        id="address"
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                        required
                      />
                      <label htmlFor="name">Address</label>
                        </div>
                      </div>
                    </div>
                    <div className="col s12">
                      <div className="row">
                        <div className="col s12 m4 input-field">
                            <input
                              type="text"
                              id="vehicleNumber"
                              onChange={(e) => {
                                setVehicleNumber(e.target.value);
                              }}
                              required
                            />
                            <label htmlFor="name">Vehicle No.</label>
                          </div>
                        <div className="col s12 m8 input-field">
                          <input
                            type="text"
                            id="vehicle"
                            onChange={(e) => {
                              setVehicle(e.target.value);
                            }}
                            required
                          />
                          <label htmlFor="name">Vehicle Details</label>
                        </div>
                      </div>
                    </div>
                    <div className="col s12">
                      <div className="row">
                        <div className="col s12 m6 input-field">
                          <input
                            type="email"
                            id="email2"
                            className="validate"
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                            required
                          />
                          <label htmlFor="email2">Email</label>
                          </div>
                          <div className="col s12 m6 input-field">
                              <input
                                type="password"
                                className="validate"
                                id="password01"
                                onChange={(e) => {
                                  setRpassword01(e.target.value);
                                }}
                                required
                              />
                              <label htmlFor="password01">Password</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col s12">
                      <div className="row"> 
                          <div className="col s12 m4 input-field">
                            <input
                              type="text"
                              id="aadhar"
                              onChange={(e) => {
                                setAadhar(e.target.value);
                              }}
                              required
                            />
                            <label htmlFor="name">Aadhaar Card No.</label>
                          </div>
                          <div className="col s12 m8">
                          <a
                            href=""
                            className="btn-large"
                            style={{ width: "100%" }}
                            onClick={handleDriverRegistration}
                          >
                            REGISTER DRIVER
                          </a>
                          </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
                <div id="test-swipe-2" className="col s12 ">
                  {/* get the value of */}
                  <div className="row">
                    <div className="col s12">
                      <div className="row">
                        <div className="col s12 m6 input-field">
                        <input
                          type="text"
                          id="name"
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                          required
                        />
                        <label htmlFor="name">Name</label>
                        </div>
                        <div className="col s12 m6 input-field">
                      <input
                        type="text"
                        id="address"
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                        required
                      />
                      <label htmlFor="name">Address</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col s12">
                      <div className="row">
                        <div className="col s12 m6 input-field">
                          <input
                            type="email"
                            id="email2"
                            className="validate"
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                            required
                          />
                          <label htmlFor="email2">Email</label>
                          </div>
                          <div className="col s12 m6 input-field">
                              <input
                                type="password"
                                className="validate"
                                id="password01"
                                onChange={(e) => {
                                  setRpassword01(e.target.value);
                                }}
                                required
                              />
                              <label htmlFor="password01">Password</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col s12">
                      <div className="row"> 
                          <div className="col s12 m4 input-field">
                            <input
                              type="text"
                              id="aadhar"
                              onChange={(e) => {
                                setAadhar(e.target.value);
                              }}
                              required
                            />
                            <label htmlFor="name">Aadhaar Card No.</label>
                          </div>
                          <div className="col s12 m8">
                          <a
                            href=""
                            className="btn-large "
                            style={{ width: "100%" }}
                            onClick={handleRiderRegistration}
                          >
                            REGISTER RIDER
                          </a>
                          </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
            <div className="col s12 m2 l3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
