import { useState, useEffect } from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import MiniLoader from "../componet/miniLoader"

import DashboardIssuingSum from "../componet/dashboard/InssuingSum"
import DashboardIssuingField from "../componet/dashboard/IssunigFeild"
import DashboardIssuingInsurer from "../componet/dashboard/IssuingInsurence"
import DashboardFeeSum from "../componet/dashboard/FeeSum"
import DashboardFeeFeild from "../componet/dashboard/FeeFeild"
import DashboardFeeInsurence from "../componet/dashboard/FeeInsurence"
const Dashboard = () =>{

    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})



    const verificationCookie = () =>{
        axios({method:'POST',url:OnRun+'/sing/cookie',data:{cookie:LginKy}
        }).then(response=>{if(!response.data.replay){
            setCookie('LginKy','',0)
            native('/')
        }else{
            setUser(response.data.user)
        }
        }).catch(error=>{setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
    })        }


    useEffect(verificationCookie,[LginKy])

    return(
        <div className="DshBrd">
            <div className="RW">
                <h1 className="Title">صدور</h1>
                <DashboardIssuingSum />
                <DashboardIssuingField />
                <DashboardIssuingInsurer />
            </div>
            <div className="RW">
                <h1 className="Title">کارمزد</h1>
                <DashboardFeeSum />
                <DashboardFeeFeild />
                <DashboardFeeInsurence />
            </div>
        </div>
    )
}

export default Dashboard