import { useState, useEffect } from "react"
import { OnRun } from "../../config/config"
import axios from "axios"
import { setCookie , getCookie} from "../cookie"
import MiniLoader from "../miniLoader"
import randomColor from "randomcolor"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';


const DashboardFeeInsurence = (props) =>{
    const [Period, setPeriod] = useState(6)
    const LginKy = getCookie('LginKy')
    const [FeeInsurence, setFeeInsurence] = useState(null)
    const [FeeInsurenceTable, setFeeInsurenceTable] = useState(null)

    const ChangPeriod = (prd) =>{
        setPeriod(prd)
        setCookie('DbFeIn',prd,15)
    }

    const CookiePeriod = ()=>{
        var cp =getCookie('DbFeIn')
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
        axios({method:'POST',url:OnRun+'/dashboard/feeinsurence',data:{cookie:LginKy, period:Period}
        }).then(response=>{if(response.data.replay){
            setFeeInsurenceTable(response.data.dff)
            var df = response.data.df
            df['datasets'][0]['backgroundColor'] = response.data.color
            df['datasets'][0]['borderRadius'] = 1
            setFeeInsurence(df)
            }    
        })
    }

    useEffect(GetDataDashboard,[Period])
    useEffect(CookiePeriod,[])
    
    return(
        <div className="BX">
            <h1>بیمه گر</h1>
            <div className="CHR">
                <div>
                    {
                        FeeInsurence==null?<MiniLoader/>:<Doughnut options={options} data={FeeInsurence} />
                    }
                </div>
                <div className="CHRTBL">
                    {
                        FeeInsurenceTable==null?null:
                        FeeInsurenceTable.map(i=>{
                            console.log(i)
                            return(
                                <div key={i.comp} style={{color:i.color,borderColor:i.color}}>
                                    <p className="group">{i.comp}</p>
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

export default DashboardFeeInsurence