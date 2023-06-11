import { useState, useEffect } from "react"
import { OnRun } from "../../config/config"
import axios from "axios"
import { setCookie , getCookie} from "../cookie"
import MiniLoader from "../miniLoader"
import randomColor from "randomcolor"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';


const DashboardIssuingField = (props) =>{
    const [Period, setPeriod] = useState(30)
    const LginKy = getCookie('LginKy')
    const [issuingField, setIssuingField] = useState(null)
    const [issuingFieldTable, setIssuingFieldTable] = useState(null)


    const ChangPeriod = (prd) =>{
        setPeriod(prd)
        setCookie('DbIsSm',prd,15)
    }

    const CookiePeriod = ()=>{
        var cp =getCookie('DbIsFi')
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
        axios({method:'POST',url:OnRun+'/dashboard/issunigFeild',data:{cookie:LginKy, period:Period}
        }).then(response=>{if(response.data.replay){
            var df = response.data.df
            setIssuingFieldTable(response.data.dff)
            df['datasets'][0]['backgroundColor'] = response.data.color
            df['datasets'][0]['borderRadius'] = 1
            setIssuingField(df)            }    })
    }
    
    useEffect(GetDataDashboard,[Period])
    useEffect(CookiePeriod,[])
    
    return(
        <div className="BX">
            <h1>رشته</h1>
            <div className="CHR">
                <div>
                    {
                        issuingField==null?<MiniLoader/>:<Doughnut options={options} data={issuingField} />
                    }
                </div>
                <div className="CHRTBL">
                    {
                        issuingFieldTable==null?null:
                        issuingFieldTable.map(i=>{
                            return(
                                <div key={i.groupMain} style={{color:i.color,borderColor:i.color}}>
                                    <p className="group">{i.groupMain}</p>
                                    <p className="rate">{(i.rate).toLocaleString() + '%'}</p>
                                    <p className="amount">{(i['مبلغ کل حق بیمه']).toLocaleString() + ' M'}</p>
                                </div>
                            )
                        })

                    }
                </div>
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

export default DashboardIssuingField