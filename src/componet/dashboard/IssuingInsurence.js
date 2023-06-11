import { useState, useEffect } from "react"
import { OnRun } from "../../config/config"
import axios from "axios"
import { setCookie , getCookie} from "../cookie"
import MiniLoader from "../miniLoader"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';




const DashboardIssuingInsurer = (props) =>{
    const [Period, setPeriod] = useState(30)
    const LginKy = getCookie('LginKy')
    const [issuingComp, setIssuingComp] = useState(null)
    const [issuingCompTable, setIssuingCompTable] = useState(null)

    const ChangPeriod = (prd) =>{
        setPeriod(prd)
        setCookie('DbIsIn',prd,15)
    }

    const CookiePeriod = ()=>{
        var cp =getCookie('DbIsIn')
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
        axios({method:'POST',url:OnRun+'/dashboard/issuniginsurer',data:{cookie:LginKy, period:Period}
        }).then(response=>{if(response.data.replay){
            setIssuingCompTable(response.data.dff)
            var df = response.data.df
            df['datasets'][0]['backgroundColor'] = response.data.color
            df['datasets'][0]['borderRadius'] = 1
            setIssuingComp(df)            }    })
    }

    useEffect(GetDataDashboard,[Period])
    useEffect(CookiePeriod,[])

    return(
        <div className="BX">
            <h1>بیمه گر</h1>
            <div className="CHR">
                <div>
                    {
                        issuingComp==null?<MiniLoader/>:<Doughnut options={options} data={issuingComp} />
                    }
                </div>
                <div className="CHRTBL">
                    {
                        issuingCompTable==null?null:
                        issuingCompTable.map(i=>{
                            return(
                                <div key={i.comp} style={{color:i.color,borderColor:i.color}}>
                                    <p className="group">{i.comp}</p>
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


export default DashboardIssuingInsurer