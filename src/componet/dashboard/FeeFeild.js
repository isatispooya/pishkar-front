import { useState, useEffect } from "react"
import { OnRun } from "../../config/config"
import axios from "axios"
import { setCookie , getCookie} from "../cookie"
import MiniLoader from "../miniLoader"
import randomColor from "randomcolor"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';


const DashboardFeeFeild = (props) =>{
    const [Period, setPeriod] = useState(6)
    const LginKy = getCookie('LginKy')
    const [FeeFeild, setFeeFeild] = useState(null)
    const [FeeFeildTable, setFeeFeildTable] = useState(null)

    const ChangPeriod = (prd) =>{
        setPeriod(prd)
        setCookie('DbFeFi',prd,15)
    }

    const CookiePeriod = ()=>{
        var cp =getCookie('DbFeFi')
        if(cp.length>0){
            setPeriod(cp)
        }
    }

    ChartJS.register(ArcElement, Tooltip, Legend);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
              position: 'top',
              display: false,
            },
            title: {
              display: false,
              text: 'Chart.js Line Chart',
            },
          },
    }

    const GetDataDashboard = () =>{
        axios({method:'POST',url:OnRun+'/dashboard/feefeild',data:{cookie:LginKy, period:Period}
        }).then(response=>{if(response.data.replay){
            var df = response.data.df
            df['datasets'][0]['backgroundColor'] = response.data.color
            df['datasets'][0]['borderRadius'] = 1
            setFeeFeild(df)
            setFeeFeildTable(response.data.dff)


            }    
        })
    }

    useEffect(GetDataDashboard,[Period])
    useEffect(CookiePeriod,[])
    
    return(
        <div className="BX">
            <h1>رشته</h1>
            <div className="CHR">
                <div>
                    {
                        FeeFeild==null?<MiniLoader/>:<Doughnut options={options} data={FeeFeild} />
                    }
                </div>
                <div className="CHRTBL">
                    {
                        FeeFeildTable==null?null:
                        FeeFeildTable.map(i=>{
                            return(
                                <div key={i.groupMain} style={{color:i.color,borderColor:i.color}}>
                                    <p className="group">{i.groupMain}</p>
                                    <p className="rate">{(i.rate).toLocaleString() + '%'}</p>
                                    <p className="amount">{(i['كارمزد قابل پرداخت']).toLocaleString() + ' M'}</p>
                                </div>
                            )
                        })
                    }
                </div>


            </div>
            <div className="Field">
                <label>
                    <select value={Period} onChange={(e)=>{ChangPeriod(e.target.value)}}>
                        <option value={1}>ماهانه</option>
                        <option value={3}>سه ماهه</option>
                        <option value={6}>شش ماهه</option>
                        <option value={12}>سالانه</option>
                        <option value={99}>همه</option>
                    </select>
                </label>
            </div>
        </div>
    )
}

export default DashboardFeeFeild