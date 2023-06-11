import { useState, useEffect } from "react"
import { OnRun } from "../../config/config"
import axios from "axios"
import { setCookie , getCookie} from "../cookie"
import MiniLoader from "../miniLoader"
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import randomColor from "randomcolor"


const DashboardIssuingSum = (props) =>{

    const LginKy = getCookie('LginKy')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [issuingSum, setIssuingSum] = useState(null)
    const [Period, setPeriod] = useState(7)

    ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins:{
            legend:{
                display:false
            }
        }
    }


    const ChangPeriod = (prd) =>{
        setPeriod(prd)
        setCookie('DbIsSm',prd,15)
    }

    const CookiePeriod = ()=>{
        var cp =getCookie('DbIsSm')
        if(cp.length>0){
            setPeriod(cp)
        }
    }

    const GetDataDashboard = () =>{
        axios({method:'POST',url:OnRun+'/dashboard/issunigsum',data:{cookie:LginKy, period:Period}
        }).then(response=>{if(response.data.replay){
            var df = response.data.df
            df['datasets'][0]['backgroundColor'] = randomColor({count: df['labels'].length})
            df['datasets'][0]['borderRadius'] = 1
            setIssuingSum(df)
        }})
    }

    useEffect(GetDataDashboard,[Period])
    useEffect(CookiePeriod,[])
    
    return(
        <div className="BX">
        <h1>حق بیمه</h1>

        <div className="CHR">
            {
                issuingSum==null?<MiniLoader/>:<Bar options={options} data={issuingSum} />
            }
        </div> 
        <div className="Field">
            <label>
                <select value={Period} onChange={(e)=>{ChangPeriod(e.target.value)}}>
                    <option value={1}>روزانه</option>
                    <option value={7}>هفتگی</option>
                    <option value={30}>ماهانه</option>
                    <option value={90}>سه ماهه</option>
                    <option value={180}>شش ماهه</option>
                    <option value={365}>سالانه</option>
                </select>
            </label>
        </div>
    </div>
    )
}

export default DashboardIssuingSum