import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Table from 'react-bootstrap/Table';
import ReactApexChart from 'react-apexcharts';
import CircularProgress from '@mui/material/CircularProgress';
import swal from 'sweetalert';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import { nodeAdress,analyticsAdress } from '../../ipAdress';
import Wheeledinsolarphase2 from './Wheeledinsolarphase2';
import { RiArrowDropDownLine } from "react-icons/ri";

function WheeledInsolar() {
  exportingInit(Highcharts);
  exportDataInit(Highcharts);
  const host='43.205.196.66'
    const [selectedDate, setSelectedDate] = useState(null);
    const [singledaydata,setSingledaydata]=useState([])
    const [wmsMeterdata,setWmsMeterdata]=useState([])
    const [loading, setLoading] = useState(false);
    const inveterApi=`${analyticsAdress}/Analysis/InverterHourly`
    const WmsMeterResponse=`${analyticsAdress}/Analysis/Wheeledin`


    const [inverterInitial,setInverterInitial]=useState([])
    const[wmsMeter,setWmsMeter]=useState([])






  
    
    //-----------function for date change----------//
    const handleDateChange = (selectedDate) => {
      setSelectedDate(selectedDate);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      fetchDataResponse();
    };


  //---------post request for graphs according to date filters---------//
    const fetchDataResponse = async () => {
      setLoading(true);
      try {
        const formattedDate = selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
        const response = await axios.post(`${analyticsAdress}/Analysis/InverterHourly/Filtered`, { date: formattedDate });
        const meterresponse = await axios.post(`${analyticsAdress}/Analysis/Wheeledin/Filtered`, { date: formattedDate });
        
        setSingledaydata(response.data);
        console.log(singledaydata)
        setWmsMeterdata(meterresponse.data)
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };


    useEffect(()=>{
      fetchDataResponse()
    },[selectedDate])
  //-----------end of function------------------//
    
    //---------------get request for initial graph-------------//
    const FetchInverterData=()=>{
      axios.get(inveterApi).then((response)=>{
        const dataresponse=response.data
        setInverterInitial(dataresponse)

      }).catch((error)=>{
        console.log(error)
      })

    }

    const FetchWmsMeterData=()=>{
      axios.get(WmsMeterResponse).then((response)=>{
        const dataresponse=response.data
        setWmsMeter(dataresponse)

      }).catch((error)=>{
        console.log(error)
      })

    }

    useEffect(()=>{
      FetchInverterData()
      FetchWmsMeterData()

    },[])


    // const filterValue=selectedDate===null?inverterInitial:singledaydata
    // console.log(filterValue)

 
  const InverterData={
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
      text:null,
      style: {
        color: '#cc0000	' // You can replace 'red' with any desired color value
    }
    },
    // subtitle: {
    //     text: 'Source: WorldClimate.com'
    // },
    xAxis: {
        categories: selectedDate ==null?inverterInitial.map((Time)=>Time.polledTime):singledaydata.map((Time)=>Time.polledTime),
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Energy(kWh)'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}(kWh)</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'inverter1',
        data:selectedDate == null ? inverterInitial.map((value)=>(value.inverter1)):singledaydata.map((value)=>(value.inverter1)),
        marker: {
          enabled: false, // Disable markers for the series
        },
        //type: 'column'
  
    },
    {
      name: 'inverter2',
      data: selectedDate == null ? inverterInitial.map((value)=>(value.inverter2)):singledaydata.map((value)=>(value.inverter2)),
      marker: {
        enabled: false, // Disable markers for the series
      },
      //type: 'column'
  
  },
  {
    name: 'inverter3',
    data: selectedDate == null ? inverterInitial.map((value)=>(value.inverter3)): singledaydata.map((value)=>(value.inverter3)),
    marker: {
      enabled: false, // Disable markers for the series
    },
    //type: 'column'

},
{
    name: 'inverter4',
    data:selectedDate == null ? inverterInitial.map((value)=>(value.inverter4)):singledaydata.map((value)=>(value.inverter4)),
    marker: {
      enabled: false, // Disable markers for the series
    },
    //type: 'column'

},
{
    name: 'inverter5',
    data: selectedDate == null ? inverterInitial.map((value)=>(value.inverter5)):singledaydata.map((value)=>(value.inverter5)),
    marker: {
      enabled: false, // Disable markers for the series
    },
    //type: 'column'

},
{
  name: 'inverter6',
  data:selectedDate == null ? inverterInitial.map((value)=>(value.inverter6)):singledaydata.map((value)=>(value.inverter6)),
  marker: {
    enabled: false, // Disable markers for the series
  },
  //type: 'column'

},
{
  name: 'inverter7',
  data: selectedDate == null ? inverterInitial.map((value)=>(value.inverter7)):singledaydata.map((value)=>(value.inverter7)),
  marker: {
    enabled: false, // Disable markers for the series
  },
  //type: 'column'

}
,{
  name: 'inverter8',
  data: selectedDate == null ?  inverterInitial.map((value)=>(value.inverter8)):singledaydata.map((value)=>(value.inverter8)),
  marker: {
    enabled: false, // Disable markers for the series
  },
  //type: 'column'

}


]
  };

  //----------------------------------------------------//

  //---------wmsMeter current value-----------------//
  const WmsMetergraph={
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text:null,
        style:{
          color: '#cc0000	',
         
        },
    },
    // subtitle: {
    //     text: 'Source: WorldClimate.com'
    // },
    xAxis: {
      categories: selectedDate==null?wmsMeter.map((value) => (value.polledTime)):wmsMeterdata.map((value) =>value.polledTime),
        crosshair: true
    },
    yAxis:[{
        min: 0,
        title: {
            text: 'Energy(kWh)'
        },
      },
       {
          title: {
              text: 'irradiation'
          },
          opposite: true // This makes the axis appear on the opposite side
      }
   ],
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}(kWh)</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Energy(kWh)',
        data:selectedDate==null?wmsMeter.map((value) => (value.Energy)):wmsMeterdata.map((value) =>value.Energy),
        marker: {
          enabled: false, // Disable markers for the series
        },
        yAxis: 0
  
    },
    {
      name: 'Irradiation (kWh/m2)',
      data: selectedDate==null?wmsMeter.map((value) => (value.Irradiation)):wmsMeterdata.map((value) =>value.Irradiation),
      marker: {
        enabled: false, // Disable markers for the series
      },
      yAxis: 1
  
  },]
  };


  const Actual_ExpectedEnergy={
        chart: {
            type: 'line',
            zoomType: 'x'
        },
        title: {
            text:null,
            style:{
              color: '#cc0000	' 
            },
        },
        xAxis: {
            categories: selectedDate==null?wmsMeter.map((Time) => Time.polledTime):wmsMeterdata.map((Time) =>Time.polledTime),
            crosshair: true
        },
        yAxis: [{
          min: 0,
          title: {
              text: 'Energy Generation (kWh)'
          }
      }
      // , {
      //     title: {
      //         text: 'irradiation'
      //     },
      //     opposite: false // This makes the axis appear on the opposite side
      // } 
    ],
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}(kWh)</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        
        series: [{
            name: 'Actual Energy (kWh)',
            data: selectedDate==null?wmsMeter.map((value) => (value.Energy)):wmsMeterdata.map((value) =>value.Energy),
            type: 'column',
            yAxis: 0, // Use the first y-axis,
            color:"#81B622"


        },
        {
            name: 'Expected Energy (kWh)',
            data:selectedDate==null?wmsMeter.map((value) => (value.expextedEnergy)):wmsMeterdata.map((value) =>value.expextedEnergy),
            type: 'column',
            yAxis: 0, // Use the first y-axis
            //color:"#DBA40E"
        },
        // {
        //     name: 'Wms irradiation',
        //     data: selectedDate==null?wmsMeter.map((value) => parseFloat((value.wmsirradiation))):wmsMeterdata.map((value) =>parseFloat((value.wmsirradiation))),
        //     type: 'line',
        //     yAxis: 1 // Use the first y-axis
        // },
        ]
}

    
  const now = new Date();
  const local = now.toLocaleDateString(); // Use toLocaleDateString() instead of toLocaleString()
  const [month, day, year] = local.split("/"); // Split the date by "/"
  const currentdate = `${day}/${month}/${year}`; // Rearrange the day and month
const dateValue = selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toLocaleDateString('en-GB') : currentdate;
  
  return (
    <div style={{marginTop:"10px",marginLeft:"80px"}}>

      <div style={{display:"flex",justifyContent:"space-between"}}> 
      <p style={{fontSize:"20px",fontWeight:"600",marginLeft:"40px",color:"#212529"}}>Wheeled In Solar PHASE I </p>
      <div  style={{width:"170px",marginRight:"40px",position:"relative"}}>
        
         <DatePicker id="date" className="form-control" selected={selectedDate} onChange={handleDateChange} style={{ width: "200px" }} placeholderText={dateValue}/>
         <div style={{ position: "absolute", top: "40%", right: "10px", transform: "translateY(-50%)" }}>
    <RiArrowDropDownLine  size="40px" color='gray' />
  
    </div>
        
      </div>
      </div>

      

  
 

   <br/>
   <Grid sx={{ flexGrow: 1 }} container spacing={2} >

   <Grid item xs={12} sm={6} >
    <div> 
      <p style={{fontSize:"20px",fontWeight:"600",marginLeft:"40px",color:"#212529"}}>Daily Solar data</p>
   {
     <HighchartsReact highcharts={Highcharts} options={WmsMetergraph} />
   }
    </div>
    </Grid>

  <Grid item xs={12} sm={6} > 
  <div id="chart2">
  <p style={{fontSize:"20px",fontWeight:"600",marginLeft:"40px",color:"#212529"}}>Inverter Active Power</p>
{

<HighchartsReact highcharts={Highcharts} options={InverterData} />


}

</div>
</Grid>
  
   
    </Grid>
  
    
  

<br/>
  
   <div>
   <p style={{fontSize:"20px",fontWeight:"600",marginLeft:"40px",color:"#212529"}}>Expected VS Actual Generation (kwh)</p>
   <HighchartsReact highcharts={Highcharts} options={Actual_ExpectedEnergy} />
   </div>

   </div>
  )
}

export default WheeledInsolar
