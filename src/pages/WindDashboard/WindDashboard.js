import React, { useState, useEffect } from 'react';
import { AiFillPlusCircle } from "react-icons/ai";
import { nodeAdress, ControlAPi, bmssAdress,analyticsAdress } from "../../ipAdress";
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import HighchartsReact from 'highcharts-react-official';
import { MdWindPower } from "react-icons/md";
import './WindDashboard.css';
import ThermostatAutoIcon from '@mui/icons-material/ThermostatAuto';
import ReactSpeedometer from "react-d3-speedometer";
import { GiSpeedometer } from "react-icons/gi";
import { SlSpeedometer } from "react-icons/sl";
import { GiWindTurbine } from "react-icons/gi";

import { TbSunWind } from "react-icons/tb";
import { TbWindElectricity } from "react-icons/tb";
import { FaWind } from "react-icons/fa";




// Define the Compass component
const Compass = ({ direction }) => {
  const directionToDegrees = {
    N: 0,
    NE: 45,
    E: 90,
    SE: 135,
    S: 180,
    SW: 225,
    W: 270,
    NW: 315,
    NS: 0, // Assuming NS is North-South, you can change this as needed
  };

  const [degree, setDegree] = useState(0);

  useEffect(() => {
    if (directionToDegrees.hasOwnProperty(direction)) {
      setDegree(directionToDegrees[direction]);
    }
  }, [direction]);

  return (
    <div className="compass-container">
      <div className="compass">
        <div className="arrow" style={{ transform: `rotate(${degree}deg)` }}></div>
        <div className="compass-label north">N</div>
        <div className="compass-label east">E</div>
        <div className="compass-label south">S</div>
        <div className="compass-label west">W</div>
      </div>
      
    </div>
  );
};

function WindDashboard() {
  exportingInit(Highcharts);
  exportDataInit(Highcharts);

  // const [direction, setDirection] = useState('SW'); // Add state for direction

  // Other states and variables
  const [windGraphData, setWindGraphData] = useState([]);
  const [windGraphDataDateFiltered, setWindGraphDataDateFiltered] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const windGraphData_API = `${bmssAdress}/wind/speedVSpower`;
  const windGraphDataDateFiltered_API = `${bmssAdress}/wind/speedVSpower/Filtered`;
  

  const [WindParameters,setWindParameters]=useState([])
  const WindParameters_API=`${bmssAdress}/wind/parameters`

  const WindTotalEnergy_API=`${analyticsAdress}/wind/totalEnergy`
  const [WindTotalEnergy,setWindTotalEnergy]=useState([])


  const WindMonthTotalEnergy_API=`${analyticsAdress}/wind/monthTotalEnergy`
  const [WindMonthTotalEnergy,setWindMonthTotalEnergy]=useState([])


  const WindExpectedVSActualData_API=`${bmssAdress}/wind/expVSact`
  const [WindExpectedVSActualData,setWindExpectedVSActualData]=useState([])


//   get : http://ems.tre100.in/bms/wind/expVSact



// get : http://ems.tre100.in/analytics/wind/monthTotalEnergy

// get : http://ems.tre100.in/analytics/wind/totalEnergy/Filtered

  // Fetch wind graph data
  useEffect(() => {
    axios.get(windGraphData_API)
      .then((res) => {
        const dataResponse = res.data;
        setWindGraphData(dataResponse);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  // Fetch wind Parameters data
  useEffect(() => {
    axios.get(WindParameters_API)
      .then((res) => {
        const dataResponse = res.data;
        setWindParameters(dataResponse);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let windSpeed=0
  let temperature=0
  let rotorSpeed=0
  let genSpeed=0
  let CompassDirection=""
  let nacelleDirection=""

  for(let i=0;i<WindParameters.length;i++){
    windSpeed=Math.trunc(WindParameters[i].windSpeed)
    temperature=Math.trunc(WindParameters[i].temperature)
    rotorSpeed=Math.trunc(WindParameters[i].rotorSpeed)
    genSpeed=Math.trunc(WindParameters[i].genSpeed)
    if(WindParameters[i].nacelleDirection==="N"){
      nacelleDirection="North"
    }
    if(WindParameters[i].nacelleDirection==="S"){
      nacelleDirection="South"
    }
   if(WindParameters[i].nacelleDirection==="E"){
      nacelleDirection="East"
    }
    if(WindParameters[i].nacelleDirection==="W"){
      nacelleDirection="West"
    }
    if(WindParameters[i].nacelleDirection==="NE"){
      nacelleDirection="North East"
    }
    if(WindParameters[i].nacelleDirection==="SE"){
      nacelleDirection="South East"
    }
    if(WindParameters[i].nacelleDirection==="SW"){
      nacelleDirection="South West"
    }
    if(WindParameters[i].nacelleDirection==="NW"){
      nacelleDirection="North West"
    }
    if(WindParameters[i].nacelleDirection==="Ns"){
      nacelleDirection="North South"
    }
     CompassDirection=WindParameters[i].nacelleDirection
  }



//-----------------------------Wind Total Energy -----------------------//
  useEffect(() => {
    axios.get(WindTotalEnergy_API)
      .then((res) => {
        const dataResponse = res.data;
        setWindTotalEnergy(dataResponse);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  
let TotalEnergy=0
let PLFValue=0

for(let i=0;i<WindTotalEnergy.length;i++){
  TotalEnergy=Math.trunc(WindTotalEnergy[i].Energy)
  PLFValue=Math.trunc(WindTotalEnergy[i].PLF)
}


//-----------------------------Wind Total Energy -----------------------//


//-------------------------------wind Month Total Energy--------------------//
useEffect(() => {
  axios.get(WindMonthTotalEnergy_API)
    .then((res) => {
      const dataResponse = res.data;
      setWindMonthTotalEnergy(dataResponse);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);

let MonthTotalEnrgy=0
let MonthEnergyMeter=0

for(let i=0;i<WindMonthTotalEnergy.length;i++){
  MonthTotalEnrgy=Math.trunc(WindMonthTotalEnergy[i].windEnergy)
}

//-------------------------------wind Month Total Energy--------------------//



//-------------------------------wind Expected vs actual Energy--------------------//
useEffect(() => {
  axios.get(WindExpectedVSActualData_API)
    .then((res) => {
      const dataResponse = res.data;
      setWindExpectedVSActualData(dataResponse);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);

let WindSpeed=0
let ExpectedPower=0
let AveragePower=0
for(let i=0;i<WindExpectedVSActualData.length;i++){
  WindSpeed=Math.trunc(WindExpectedVSActualData[i].windSpeed)
  ExpectedPower=Math.trunc(WindExpectedVSActualData[i].expexctedPower)
  AveragePower=Math.trunc(WindExpectedVSActualData[i].averagePower)

}

//-------------------------------wind Expected vs actual Energy--------------------//


  // Handle date change
  const handleDateChange = (selectedDate) => {
    setSelectedDate(selectedDate);
  };

  // Fetch filtered wind graph data
  const fetchData = async () => {
    try {
      const formattedStartDate = selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
      const windGraphDataDateFilteredResponse = await axios.post(windGraphDataDateFiltered_API, { date: formattedStartDate });
      setWindGraphDataDateFiltered(windGraphDataDateFilteredResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const WindDataGraph = {
    chart: {
      type: 'line',
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: selectedDate == null ? windGraphData.map((Time) => Time.polledTime) : windGraphDataDateFiltered.map((Time) => Time.polledTime),
      crosshair: true,
      tickInterval: 10 * 10,
      gridLineWidth: 0,
    },
    yAxis: [{
      title: {
        text: ' Active Power (kW)',
        gridLineWidth: 0,
      },
    }, {
      title: {
        text: 'Wind Speed (m/s)',
        gridLineWidth: 0,
      },
      opposite: true,
    }],
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [{
      name: 'Active Power (kW)',
      data: selectedDate == null ? windGraphData.map((value) => value.activePower) : windGraphDataDateFiltered.map((value) => value.activePower),
      type: 'line',
      yAxis: 0,
    },
    {
      name: 'Wind Speed (m/s)',
      data: selectedDate == null ? windGraphData.map((value) => value.windSpeed) : windGraphDataDateFiltered.map((value) => value.windSpeed),
      type: 'line',
      yAxis: 1,
    }],
  };





  const WindExpectedVSactual= {

    chart: {
        type: 'column'
    },
  
    title: {
        text: `Percentage Of Apparent Power crossing   kVA`,
        align: 'center'
    },
  
    xAxis: {
      // categories:selectedDate==null?peakDemandRangeWiseGraphData.map((Time)=>Time.polledTime):peakDemandRangeWiseGraphDataDateFiltered.map((Time)=>Time.polledTime),
      crosshair: true
  },
  
  yAxis: {
    min: 0,
    title: {
        text: `% Of Apparent Power crossing  kVA`
    }
  },
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f}%</b></td></tr>',
    footerFormat: '</table>',
    shared: true,
    useHTML: true
  },
  
    plotOptions: {
        column: {
            stacking: 'normal',
            pointWidth: 20
        }
    },
  
    series: [
          
  {
    name: 'Active Power (kW)',
    data: WindExpectedVSActualData.map((value) => value.expectedSpeed),
    //type: 'column'
    color:"#53C530"
  
  },
  
  
  {
    name:"Wind Speed (m/s)",
    data:WindExpectedVSActualData.map((value) => value.windSpeed),
    color:"#119E57"
    //type: 'column'
  
  }, 
  
  ]
  };

  const now = new Date();
  const local = now.toLocaleDateString();
  const [month, day, year] = local.split("/");
  const currentdate = `${day}/${month}/${year}`;
  const dateValue = selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toLocaleDateString('en-GB') : currentdate;

  const data = [
    { name: 'Actual', value: 8 },
  ];
  
  const expectedValue = 10;

  return (
    <div>
      <div style={{ marginTop: "90px", marginLeft: "80px", overflowX: "hidden" }}>
        <p style={{ textAlign: "center", color: "brown", fontSize: "18px", fontWeight: "700" }}>Active Power (kW) and Wind Speed (m/s)</p>
        <br />
        <div className="row" style={{ marginLeft: "10px", marginTop: "20px" }}>
          <div className="col-10">
            <div className="input-group mb-3" style={{ width: "300px" }}>
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="inputGroupSelect01">
                  <h5 style={{ color: "brown" }}><b> Date :- </b></h5><DatePicker id="date" selected={selectedDate} onChange={handleDateChange} placeholderText={dateValue} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='windGraph'>
        <HighchartsReact highcharts={Highcharts} options={WindDataGraph} />
      </div>
      <div className='WindDetails'>
        <div className='WindDetailsTotally'>
          <div className='windEndline'>
            <div>
              <p style={{ fontSize: "16px", fontWeight: "500", textAlign: "center" }}>Todays Energy</p>
              <div style={{ fontSize: "18px", fontWeight: "700", textAlign: "center" }}>{TotalEnergy}</div>
              <div style={{ textAlign: "center", color: "gray" }}>Calculated (kWh)</div>
            </div>
            <div style={{ marginTop: "40%" }}>
              <p style={{ fontSize: "16px", fontWeight: "500", textAlign: "center" }}>Todays PLF </p>
              <div style={{ fontSize: "18px", fontWeight: "700", textAlign: "center" }}>{PLFValue}</div>
              <div style={{ fontSize: "18px", fontWeight: "700", textAlign: "center", color: "gray" }}>(%)</div>
            </div>
          </div>
          <div className='windEndline'>
            <div>
              <p style={{ fontSize: "16px", fontWeight: "500", textAlign: "center", whiteSpace: "pre" }}>Monthly Energy <br /> Calculated </p>
              <div style={{ fontSize: "18px", fontWeight: "700", textAlign: "center" }}>{MonthTotalEnrgy}</div>
              <div style={{ textAlign: "center", color: "gray" }}>(kWh)</div>
            </div>
            <div style={{ marginTop: "30%" }}>
              <p style={{ fontSize: "16px", fontWeight: "500", textAlign: "center" }}>Montly Energy Meter </p>
              <div style={{ fontSize: "18px", fontWeight: "700", textAlign: "center" }}>19</div>
              <div style={{ fontSize: "18px", fontWeight: "700", textAlign: "center", color: "gray" }}>(kWh)</div>
            </div>
          </div>
        </div>
        <div className='expectedspeedmain'>
            <div className='expectedspeed'> 
            <div style={{border:"4px solid #FF9900",borderTopRightRadius:"100%",borderBottomRightRadius:"50%",backgroundColor:"#FF9900",color:"#FFFF",fontSize:"18px",fontWeight:"700",display:"flex",justifyContent:"center",alignItems:"center"}}>
              m/s
              </div>
               <div>
                {/* <p style={{textAlign:"end",fontSize:"16px",fontWeight:"600",marginRight:"5px"}}>Speed   <span style={{fontSize:"23px",fontWeight:"800",color:"#C72525",paddingLeft:"4px"}}>10.9</span></p> */}
               <div style={{textAlign:"center",paddingTop:"20px"}}>
                  <div style={{fontSize:"30px",fontWeight:"800",color:"#FF7338"}}>{WindSpeed}  <TbSunWind/> </div>
                  <p style={{fontSize:"18px",fontWeight:"700"}}>Average Wind Speed</p>
               </div>
               </div>
            </div>

            <div className='expectedspeed'> 
              <div style={{border:"4px solid #FF9900",borderTopRightRadius:"100%",borderBottomRightRadius:"50%",backgroundColor:"#FF9900",color:"#FFFF",fontSize:"18px",fontWeight:"700",display:"flex",justifyContent:"center",alignItems:"center"}}>
              kW
              </div>
               <div>
                <p style={{textAlign:"end",fontSize:"16px",fontWeight:"600",marginRight:"5px"}}>Expected Power   <span style={{fontSize:"23px",fontWeight:"800",color:"#4CAF50",paddingLeft:"4px"}}>{ExpectedPower}</span></p>
               <div style={{textAlign:"center"}}>
                  <div style={{fontSize:"30px",fontWeight:"800",color:"#FF7338"}}>{AveragePower}  <FaWind />  </div>
                  <p style={{fontSize:"18px",fontWeight:"700"}}>Today`s Average Power</p>
               </div>
               </div>
            </div>
        </div>
        <div> 
          <div className='WindSpecs'>
            <div> 
              <GiWindTurbine size="80px" color='#4CAF50'/>
              
              <p style={{fontSize:"16px",fontWeight:"500"}}>Wind Speed</p>
              <div style={{fontSize:"18px",fontWeight:"600",textAlign:"center"}}>{windSpeed}</div>
              <div style={{fontSize:"18px",fontWeight:"600",textAlign:"center",color:"gray"}}>(m/s)</div>
            </div>
            <div> 
             <div>
                <Compass direction={CompassDirection}/>
                <p style={{fontSize:"16px",fontWeight:"500",textAlign:"center"}}>Nacelle<br/>Direction</p>
                <div style={{fontSize:"18px",fontWeight:"600",textAlign:"center"}}>{nacelleDirection}</div>

            </div>
            </div>
            <div> 
            <ThermostatAutoIcon style={{height:"80px",width:"90px",color:'#4CAF50'}} />
            <p style={{fontSize:"16px",fontWeight:"500",textAlign:"center"}}>Temperature</p>
            <div style={{fontSize:"18px",fontWeight:"600",textAlign:"center"}}>{temperature}</div>
              <div style={{fontSize:"18px",fontWeight:"600",textAlign:"center",color:"gray"}}>(oC)</div>
            </div>



            
           
            
           
          </div>
          <br/>
          <br/>

          <div className='WindSpecsLayer2'> 
            <div> 
              <GiSpeedometer size="90px" color='#4CAF50'/>
              
              <p style={{fontSize:"16px",fontWeight:"500"}}>Rotor Speed</p>
              <div style={{fontSize:"18px",fontWeight:"600",textAlign:"center"}}>{rotorSpeed}</div>
              <div style={{fontSize:"18px",fontWeight:"600",textAlign:"center",color:"gray"}}>(rev/min)</div>
            </div>

            <div> 
            <SlSpeedometer
        size="80px"
        color='#4CAF50'
        style={{
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
          background: 'radial-gradient(circle, #fff 60%, #ddd 100%)',
          borderRadius: '50%' // Optional: if you want the background to be circular
        }}
      />
              
              <p style={{fontSize:"16px",fontWeight:"500",textAlign:"center"}}>Generator <br/>Speed</p>
              <div style={{fontSize:"18px",fontWeight:"600",textAlign:"center"}}>{genSpeed}</div>
              <div style={{fontSize:"18px",fontWeight:"600",textAlign:"center",color:"gray"}}>(rev/min)</div>
            </div>
    
            </div>
        </div>


        
      </div>
    </div>
  )
}

export default WindDashboard;


{/* <div >
<ReactSpeedometer
  forceRender={true}
  width={180}
  height={180}
  needleHeightRatio={0.3}
  needleColor={"black"}
  needleTransition={"easeCircleInOut"}
  maxSegmentLabels={12}
  segments={12}
  customSegmentStops={[
    10,
    20,
    30,
    40,
    50,
    60,
    70,
    80,
    90,
    100,
    120,
    130
  ]}
  minValue={10} //<---here
  maxValue={130} //<---here
  segmentColors={[
    "#cdeb73",
    "#77fc03",
    "#c2fc03",
    "#d2fc03",
    "#c2fc03",
    "#fcf003",
    "#fcc203",
    "#fca503",
    "#fc9003",
    "#fc6f03",
    "#fc6f03",
    "#f53333",
    
  
  ]}
  value={75}
  labelFontSize={"10px"}  // Adjust the segment labels font size
  valueTextFontSize={"10px"}  // Adjust the value text font size
/>
</div> */}