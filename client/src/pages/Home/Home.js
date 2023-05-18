import React from 'react'
import "./Home.css"
import { useNavigate } from 'react-router-dom'
// we need two things now the partition and the User or Driver just that decide the colors later 
const Home = () => {
  const navigate = useNavigate();

  const handleDriver = async(e)=>{
    e.preventDefault();
    navigate("/loginDriver");
  }

  const handleUser = async(e)=>{
    e.preventDefault();
    navigate("/loginUser");
  }
  return (
    <div>
        <div className="container centerContainer">
            <h1 className="title center">PEER TO PEER RIDE SHARING</h1>
            <div className="divider"></div>
            <div className="row center ">
                <div className="col s12 l6 ">   
                    <button class= "btn-large choice" onClick={handleDriver}>
                        DRIVER 
                    </button>
                </div>
                <div className="col s12 l6 " onClick={handleUser}>
                    <button class= "btn-large choice">
                        USER
                    </button>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default Home