
import React, { useState,useEffect } from 'react';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import axios from 'axios';
import swal from 'sweetalert';
import Dropdown from 'react-bootstrap/Dropdown';
import { TiBatteryHigh } from "react-icons/ti";
import {TiBatteryLow} from "react-icons/ti"
import {TiBatteryFull} from "react-icons/ti"
import {FaBatteryEmpty} from "react-icons/fa"
import { height } from '@mui/system';
import BatteryShedule from './BatteryShedule';
import Swal from "sweetalert2";
import './Battery.css';
import { nodeAdress,ControlAPi} from '../../../ipAdress';

// import './Controls.css'



const host = '43.205.196.66'

function Control() {

  const ActualPassKey=7230
  
  const [pinNumber,setPinNumber]=useState("")

  const [formData, setFormData] = useState({
    functioncode: "",
    starttime: "",
    endtime: ""
  });

  const [insformData,setInsformData]=useState({
    functioncode:"",
    batterystatus:""

  })
  const [batterydata,setBatterydata]=useState([])
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);



  const batteryurl=`${ControlAPi}/control/UpsDetails`
  // https://ems.tre100.in/controlapi/control/UpsDetails


//  function batteryData() {
//     return axios.get(batteryurl)
//       .then(response => {
//         // Process the data here
//         return response.data;
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }

  const batteryData=()=>{
    axios.get(batteryurl).then((res)=>{
      const dataResponse=res.data
      setBatterydata(dataResponse)
  
    }).catch((err)=>{
      console.log(err)
    })
  } 


  const handlePinPasswordChange = (event) => {
    setPinNumber(event.target.value);
  };

  // batteryData()

  // useEffect(()=>{
  //   setInterval(()=>{
  //     batteryData()
  //   },30000)
  // },[])
  useEffect(() => {
    // Call the function initially
    batteryData();

    // Set up the interval and store its ID
    const intervalId = setInterval(() => {
      batteryData();
    }, 30000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run the effect only once


  console.log(batterydata)
 let packSoc=0
 let  currentStatus=0
 let  current=0
 let voltage=0
 let mainConStatus=""
 let preConStatus=""
 

 for(let i=0;i<batterydata.length;i++){
  packSoc=batterydata[i].packSOC
  current=batterydata[i].batteryCurrent

  voltage=batterydata[i].batteryVoltage
  if(batterydata[i].mainConStatus===2.0){
    mainConStatus="OFF"
  }
  else if (batterydata[i].mainConStatus===1.0){
    mainConStatus="ON"
  }
  else if(batterydata[i].mainConStatus===3.0){
    mainConStatus="FAULT"
  }

  if(batterydata[i].preConStatus===2.0){
    preConStatus="OFF"
  }
  else if (batterydata[i].preConStatus===1.0){
    preConStatus="ON"
  }
  else if(batterydata[i].preConStatus===3.0){
    preConStatus="FAULT"
  }

 
  if(batterydata[i].batteryStatus==="CHG"){
    currentStatus="CHARGING"
   
  }
  if(batterydata[i].batteryStatus==="DCHG"){
    currentStatus="DISCHARGING"

   
  }
  if(batterydata[i].batteryStatus==="IDLE"){
    currentStatus="IDLE"

   
  }
}


  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formattedData = {
      functioncode: Number(formData.functioncode),
      starttime: formData.starttime,
      endtime: formData.endtime,
    };
    console.log(formattedData)
    swal({
      title: "Are you sure?",
      text: `the given parameters ${formattedData.functioncode},${formattedData.starttime},${formattedData.endtime}be set for battery!`,
      icon: "warning",
      buttons: {
        cancel: "Cancel",
        confirm: "OK",
      },
      dangerMode: false,
    }).then((willContinue) => {
      if (willContinue) {
        axios.post(`${nodeAdress}/controlls`, formattedData)
          .then((response) => {
            const result = response.data;
            setFormData({
              functioncode: "",
              starttime: "",
              endtime: "",
            });
            swal({
              title: formattedData.functioncode === 1 ? "battery set to charge mode" : "battery set to discharge mode",
              icon: "success",
            });
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Error",
              text: "Failed to set battery parameters",
              icon: "error",
            });
          });
      }
    });
  };

 
  

  const handleDateTimeChange = (moment, name) => {
    setFormData({
      ...formData,
      [name]: moment.format("YYYY-MM-DD HH:mm:ss"),
    });
  };

  const instantaneousSubmit = (event) => {
    event.preventDefault();
   const insformatedData={
    functioncode: Number(insformData.functioncode),
    batterystatus:insformData.batterystatus

   }
   if(parseInt(pinNumber)===ActualPassKey){
   if(insformatedData.batterystatus==="charge" && insformatedData.functioncode===1){
    insformatedData.functioncode=1
    swal({
      title: "Are you sure?",
      text: `the given parameters be set for battery!`,
      icon: "warning",
      buttons: {
        cancel: "Cancel",
        confirm: "OK",
      },
      dangerMode: false,
    }).then((willContinue) => {
      if (willContinue) {
        axios.post(`${nodeAdress}/instantaneous`, insformatedData)
          .then((response) => {
            const result = response.data;
            setInsformData({
              functioncode:"",
              batterystatus:""
      
            });
            swal({
              title: insformatedData.batterystatus==="charge" && insformatedData.functioncode===1 ?"battery set to charge ON ":" ",
              //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
              icon: "success",
            }).then(()=>{
              setIsButtonDisabled(true);
          setTimeout(() => {
            setIsButtonDisabled(false);
          },3 * 60 * 1000)
              // 
            })
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Error",
              text: "Failed to set battery parameters",
              icon: "error",
            });
          });
      }
    });


    // try {
    //   const response =  axios.post(`http://${host}:5000/instantaneous`, insformatedData);
    //   //const result=response.data
    //   setInsformData({
    //     functioncode:"",
    //     batterystatus:""

    //   })
    //   console.log(insformatedData)
    //   swal({
    //     title: insformatedData.batterystatus==="charge" && insformatedData.functioncode===1 ?"battery set to charge ON ":"battery set to discharge mode",
    //     //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
    //     icon: "success",
    //   }).then(()=>{
    //     setIsButtonDisabled(true);
    // setTimeout(() => {
    //   setIsButtonDisabled(false);
    // },3 * 60 * 1000)
    //     // 
    //   })
      


    // } catch (error) {
    //   console.error(error);
    //   //console.log(formattedData)
    // }
    console.log(insformatedData.functioncode)
   }
   else if(insformatedData.batterystatus==="charge" && insformatedData.functioncode===2){
    insformatedData.functioncode=2
    swal({
      title: "Are you sure?",
      text: `the given parameters be set for battery!`,
      icon: "warning",
      buttons: {
        cancel: "Cancel",
        confirm: "OK",
      },
      dangerMode: false,
    }).then((willContinue) => {
      if (willContinue) {
        axios.post(`${nodeAdress}/instantaneous`, insformatedData)
          .then((response) => {
            const result = response.data;
            setInsformData({
              functioncode:"",
              batterystatus:""
      
            });
            swal({
              title: insformatedData.batterystatus==="charge" && insformatedData.functioncode===2 ?"battery set to charge OFF ":" ",
              //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
              icon: "success",
            }).then(()=>{
              setIsButtonDisabled(true);
          setTimeout(() => {
            setIsButtonDisabled(false);
          },3 * 60 * 1000)
              // 
            })
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Error",
              text: "Failed to set battery parameters",
              icon: "error",
            });
          });
      }
    });
    console.log(insformatedData.functioncode)
   

   }
   else if(insformatedData.batterystatus==="discharge" && insformatedData.functioncode===1){
    insformatedData.functioncode=3
    swal({
      title: "Are you sure?",
      text: `the given parameters be set for battery!`,
      icon: "warning",
      buttons: {
        cancel: "Cancel",
        confirm: "OK",
      },
      dangerMode: false,
    }).then((willContinue) => {
      if (willContinue) {
        axios.post(`${nodeAdress}/instantaneous`, insformatedData)
          .then((response) => {
            const result = response.data;
            setInsformData({
              functioncode:"",
              batterystatus:""
      
            });
            swal({
              title: insformatedData.batterystatus==="discharge" && insformatedData.functioncode===3 ?"battery set to discharge ON ":" ",
              //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
              icon: "success",
            }).then(()=>{
              setIsButtonDisabled(true);
          setTimeout(() => {
            setIsButtonDisabled(false);
          },3 * 60 * 1000)
              // 
            })
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Error",
              text: "Failed to set battery parameters",
              icon: "error",
            });
          });
      }
    });
    console.log(insformatedData.functioncode)


   }
   else if(insformatedData.batterystatus==="discharge" && insformatedData.functioncode===2){
    insformatedData.functioncode=4
    swal({
      title: "Are you sure?",
      text: `the given parameters be set for battery!`,
      icon: "warning",
      buttons: {
        cancel: "Cancel",
        confirm: "OK",
      },
      dangerMode: false,
    }).then((willContinue) => {
      if (willContinue) {
        axios.post(`${nodeAdress}/instantaneous`, insformatedData)
          .then((response) => {
            const result = response.data;
            setInsformData({
              functioncode:"",
              batterystatus:""
      
            });
            swal({
              title: insformatedData.batterystatus==="discharge" && insformatedData.functioncode===4 ?"battery set to discharge OFF ":" ",
              //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
              icon: "success",
            }).then(()=>{
              setIsButtonDisabled(true);
          setTimeout(() => {
            setIsButtonDisabled(false);
          },3 * 60 * 1000)
              // 
            })
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Error",
              text: "Failed to set battery parameters",
              icon: "error",
            });
          });
      }
    });
    console.log(insformatedData.functioncode)
    console.log(insformatedData.functioncode)

   }
  }
  else{
    Swal.fire({
      //icon: 'error',
      //title: 'Oops...',
      //text: 'wrong! Pin',
      // imageUrl:'https://media.tenor.com/eqkjY6hklPcAAAAM/sad-mr-bean.gif',
      imageUrl:'https://img.freepik.com/premium-vector/frustrated-man-touching-his-head-holding-phone-trying-remember-forgets-password-account_199628-198.jpg',
      imageWidth: 400,
      imageHeight: 350,
      imageAlt: 'Custom image',
     
    })
  }
   //------------//
   
    console.log(insformatedData)
    
  };

  

  return (
    <>
    <div style={{marginTop:"80px",marginLeft:"40px"}}> 
      {/* <div className="battery-icon">
        
        <div className="battery-level" style={{ height: `${Math.round(packSoc[packSoc.length - 1])}%` }}></div>
        <i className="fas fa-battery-three-quarters"></i>
      </div>
      <div>Battery: {Math.round(packSoc[packSoc.length - 1])}%</div>

      <div className="battery-icon">
      <div className="battery-body">
        <div className="battery-level" style={{ height: `${Math.round(packSoc[packSoc.length - 1])}%` }}></div>
      </div>
    </div> */}


   
      <div >
        <h2 style={{fontSize:"30px",textAlign:"center"}}><b>UPS Battery Control</b></h2>
      </div>
      <br/>

      <div  class="row" style={{ marginLeft:'50px',marginRight:'10px'}}>
         
      <div style={{ display: 'inline-block' }} class="col-sm-6 mb-3 mb-sm-0">
  <h4 style={{ textAlign: "center" }}><b style={{ color: "brown" }}>Overview</b></h4>
  <br />
  <div>
    <div class="card" style={{ background: "white", width: "auto",height:"363px" }}>
      <div class="card-body" style={{ textAlign: "center" }}>
        <table style={{ width: "100%", textAlign: "left"}}>
          <tbody>
            <tr >
              <td><h4 style={{ color: "teal" }}><b>SoC(%)</b></h4></td>
              <td><h4>:</h4></td>
              <td>  
              <div class="progress" style={{height:"30px",color:"black",background:"gray"}}>
              <div class="progress-bar" role="progressbar" style={{ width: `${Math.round(packSoc)}%`,color:"white"}} aria-valuenow={Math.round(packSoc)} aria-valuemin="0" aria-valuemax="100">{Math.round(packSoc)}%</div>
              </div>
              
              
              </td>
            </tr>
           
            <tr style={{marginTop:"30px"}}>
              <td><h4 style={{ color: "teal" }}><b>Current Status</b></h4></td>
              <td><h4>:</h4></td>
              <td><h4>{currentStatus}</h4></td>
            </tr>
            {/* <tr> 
            {packSoc[packSoc.length - 1] >= 65  ? (
  <img src={batteryfull} alt="batteryfull" style={{ width: "100px", height: "100px" }} />
) : packSoc[packSoc.length - 1] <= 20 ? (
  <img src={batterylow} alt="batterylow" style={{ width: "100px", height: "100px" }} />
) : (
  <img src={image2} alt="batteryhalf" style={{ width: "100px", height: "100px" }} />
)}
            </tr> */}
            <tr> 
              <td><h4  style={{ color: "teal" }}><b>Current (A)</b></h4></td>
              <td><h4>:</h4></td>
              <td><h4>{current}</h4></td>
            </tr>
            <tr> 
              <td><h4  style={{ color: "teal" }}><b>Voltage (V)</b></h4></td>
              <td><h4>:</h4></td>
              <td><h4>{voltage}</h4></td>
            </tr>
            <tr>
              <td><h4 style={{ color: "teal" }}><b>Main Contactor Status</b></h4></td>
              <td><h4>:</h4></td>
              <td>
                <h4>{mainConStatus}</h4>
              </td>

              
            </tr>
            <tr>
              <td><h4 style={{ color: "teal" }}><b>Precharge Contactor Status</b></h4></td>
              <td><h4>:</h4></td>
              <td>
                <h4>{preConStatus}</h4>
              </td>
            </tr>
          </tbody>
        </table>
        <h1></h1>
      </div>
    </div>
  </div>
</div>

  <div style={{ display: 'inline-block'}} class="col-sm-6 mb-2 mb-sm-0" >
  <h4 style={{textAlign:"center"}}><b style={{color:"brown"}}>Instantaneous Control</b></h4>
  <br/>
    <div class="card" style={{background:"white",width:"auto",height:"363px",marginLeft:"10px"}}>
      <div class="card-body" style={{justifyContent:"center",alignItems:'center',display:"flex"}}>
      <form onSubmit={instantaneousSubmit}> 
  <div class="row">
  <div class="col-sm-6">
    <div class="cards">
      <div class="card-body">
        {/* <h5 class="card-title">Battery Charge</h5> */}

        <div class="input-group mb-3"  style={{width:"300px"}}>
      <label class="input-group-text" for="inputGroupSelect01" style={{color:"gray",fontSize:"18px"}} ><b>Status</b> </label>
      <select class="form-select" id="inputGroupSelect01" value={insformData.batterystatus} onChange={(e) =>setInsformData({ ...insformData, batterystatus: e.target.value })}>
  <option value="" disabled>CHARGE/DISCHARGE</option>
  <option value="charge" style={{ color: "green", fontSize: "17px" }}>CHARGE</option>
  <option value="discharge" style={{ color: "red" ,fontSize: "17px"}}>DISCHARGE</option>
</select>

  </div>
        <br/>
        <div class="input-group mb-3"  style={{width:"300px"}}>
      <label class="input-group-text" for="inputGroupSelect01" style={{color:"gray",fontSize:"18px"}}><b>Function</b></label>
  <select class="form-select" id="inputGroupSelect01" value={insformData.functioncode} onChange={(e) => setInsformData({ ...insformData, functioncode: e.target.value })}>
  <option value="" disabled> ON/OFF</option>
        <option value={1}  style={{ color: "green", fontSize: "17px" }}>ON</option>
        <option value={2}  style={{ color: "red", fontSize: "17px" }}>OFF</option>
  </select>
  </div>
      <br/>
      {/* <br/>
      <br/> */}

      <div class="input-group mb-3" style={{width:"300px"}}>
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1" style={{color:"gray"}}><b>PIN</b></span>
  </div>
  <input name="pin" type="password" class="form-control" placeholder="*****" aria-label="Username" aria-describedby="basic-addon1" onChange={handlePinPasswordChange}  value={pinNumber}/>
</div>
      <div style={{justifyItems:"center",marginLeft:"120px",justifyTracks:'center'}}> 
      {
        isButtonDisabled=== false ? <button type="submit" class="btn btn-primary bt-lg" style={{height:"40px"}}>Submit</button>:<button type="button" class="btn btn-secondary btn-lg" disabled>Submit</button>
      }

</div>
     
      </div>
    </div>
  </div>
</div>
</form>
       
      </div>
    </div>
  </div>

      <div style={{ display: 'inline-block',marginTop:"40px"}} class="col-sm-12 mb-3 mb-sm-0">
      <h4 style={{textAlign:"center"}}><b style={{color:"brown"}}>Scheduled Control</b></h4>
      <br/>
    <div class="card" style={{background:"white",width:"auto", height:"auto",marginLeft:"10px",marginBottom:"30px"}} >
      <div class="card-body" style={{justifyContent:"center",alignItems:'center',display:"flex"}}>
     <BatteryShedule/>

      </div>
    </div>
  </div>
  {/* //---- */}


  
</div>



  
  </div>

    </>
  );
}

export default Control;

// ------------------------------------------------
//  ---------------flip card----------
// <div class="flip-card">
//   <div class="flip-card-inner">
//     <div class="flip-card-front">
//       {/* <img src="img_avatar.png" alt="Avatar" style={{width:'300px',height:'300px'}}/> */}
//       <h1 style={{justifyContent:"center",alignItems:"center",display:'flex'}}>Card summary</h1>
//     </div>
//     <div class="flip-card-back">
//       {/* <h1>John Doe</h1> 
//       <p>Architect & Engineer</p> 
//       <p>We love that guy</p> */}
//     </div>
//   </div>
// </div>
// ------------------card styling---------------
// .flip-card {
//   background-color: transparent;
//   width: 300px;
//   height: 300px;
//   perspective: 1000px;
// }

// .flip-card-inner {
//   position: relative;
//   width: 100%;
//   height: 100%;
//   text-align: center;
//   transition: transform 0.6s;
//   transform-style: preserve-3d;
//   box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
// }

// .flip-card:hover .flip-card-inner {
//   transform: rotateY(180deg);
// }

// .flip-card-front, .flip-card-back {
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   -webkit-backface-visibility: hidden;
//   backface-visibility: hidden;
// }

// .flip-card-front {
//   background-color: #bbb;
//   color: black;
// }

// .flip-card-back {
//   background-color: #2980b9;
//   color: white;
//   transform: rotateY(180deg);
// }

	
