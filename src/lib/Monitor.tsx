"use client";

import { useEffect, useState } from "react";


const  MonitorRow = ({title, data}) => {
    return (
        <>
        <div className="memo_mi_row">
            <div className="">{title}</div>
            <div className="">{data}</div>
        </div>
        </>
    )
}

// fields, 
const  MonitorItem = ({data})=> {
    let fnum = 0
    
    return (
        <>
        <div className="memo_monitor_item">
            {Object.entries(data).map(([title,value])=>(
                <MonitorRow key={`${title}_${(fnum++)}`} title={title} data={value}/>
            ))}
            {/* {fields.map((d: any)=>(
            <>
                <MonitorRow key={`${d}_${(fnum++)}`} title={d} data={data[d]}/>
            </>
            ))} */}
        </div>
        </>
    )
}

// {/* {console.log(`${d}_${(fnum++)}`)} */}
let moncou = 0;

const  Monitor = ({monitorData, setMonitorData})=> {
    // const [monitorData, setMonitorData] = useState({})
    // const [monitorFields, setMonitorFields] = useState([])
    // let monitor = new MonitorItem(title, fields, null, true)
    // monitor.monitor_data = data

  const formatMemoryUsage = (data: any) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;

    useEffect(()=>{
    setInterval(()=>{
        // let monitor_title = 'Memory size'
        // let monitor_fields = []
        // // monitor_fields.push('title')
        // monitor_fields.push('jsHeapSizeLimit')
        // monitor_fields.push('totalJSHeapSize')
        // monitor_fields.push('usedJSHeapSize')
        // monitor_fields.push('go')
        
        // setMonitorFields(monitor_fields)
        // // setMonitorFields([])

        let memo = window.performance.memory
        let _memoryUsage2 = {
            jsHeapSizeLimit: `${formatMemoryUsage(memo.jsHeapSizeLimit)}`,
            totalJSHeapSize: `${formatMemoryUsage(memo.totalJSHeapSize)}`,
            usedJSHeapSize: `${formatMemoryUsage(memo.usedJSHeapSize)}`,
        };
        setMonitorData((state)=>({...state, ..._memoryUsage2, 'go':'go go'}))
        // console.log('Monitor inited', moncou)
        },1000)
    },[])

    moncou++;
    // console.log('Monitor inited', moncou)
    // fields['title'] = title;
    return (
        <>
        <div className="memo_monitor" style={{"display": "block"}}>
            <MonitorItem
            data={monitorData}/>
            {/*fields={monitorFields}*/}
        </div>
        </>
    )
}

export default Monitor;