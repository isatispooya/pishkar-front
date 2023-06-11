import { useState, useEffect } from "react"
import { OnRun } from "../../config/config"
import axios from "axios"
import { setCookie , getCookie} from "../cookie"
import MiniLoader from "../miniLoader"
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import randomColor from "randomcolor"

const DashboardFeeSum = (props) =>{

    const LginKy = getCookie('LginKy')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [FeeSum, setFeeSum] = useState(null)
    const [Period, setPeriod] = useState(6)

    const ChangPeriod = (prd) =>{
        setPeriod(prd)
        setCookie('DbFeSm',prd,15)
    }

    const CookiePeriod = ()=>{
        var cp =getCookie('DbFeSm')
        if(cp.length>0){
            setPeriod(cp)
        }
    }

    ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);

    const GetDataDashboard = () =>{
        axios({method:'POST',url:OnRun+'/dashboard/feesum',data:{cookie:LginKy, period:Period}
        }).then(response=>{
            var df = response.data.df
            df['datasets'][0]['backgroundColor'] = randomColor({count: df['labels'].length})
            df['datasets'][0]['borderRadius'] = 1
            setFeeSum(df)
        })
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins:{
            legend:{
                display:false
            }
        }
    }
    useEffect(CookiePeriod,[])
    useEffect(GetDataDashboard,[Period])
    return(
        <div className="BX">
        <h1>دریافتی</h1>
        <div className="CHR">
            {
                FeeSum==null?<MiniLoader/>:<Bar options={options} data={FeeSum} />
            }
        </div>
        <div className="Field">
            <label>
                <select value={Period} onChange={(e)=>{ChangPeriod(e.target.value)}}>
                    <option value={3}>سه ماهه</option>
                    <option value={6}>شش ماهه</option>
                    <option value={9}>نه ماهه</option>
                    <option value={12}>سالانه</option>
                    <option value={99}>همه</option>
                </select>
            </label>
        </div>
    </div>
    )
}

export default DashboardFeeSum