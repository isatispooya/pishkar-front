import { useState, useEffect ,useContext} from "react"
import { OnRun } from "../../config/config"
import axios from "axios"
import Alarm from "../../componet/Alarm"
import { setCookie , getCookie} from "../../componet/cookie"
import { useNavigate } from 'react-router-dom'
import InssuingSumCunsoltant from "../../componet/dashboard/InssuingSumCunsoltant"
import IssunigFeildCunsoltant from "../../componet/dashboard/IssunigFeildCunsoltant"
import IssuingInsurenceCunsoltant from "../../componet/dashboard/IssuingInsurenceCunsoltant"
import DateP from "../../componet/context"
import {IoRefreshSharp,IoInformationCircleOutline} from "react-icons/io5";

const DashboardCunsoltant  = (props) =>{
    const datePeriod = useContext(DateP)
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')

    const [consultantList, setConsultantList] = useState(null)
    const [consultant, setConsultant] = useState(null)
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

    const GetConsultantAll = () =>{
        axios({method:'POST',url:OnRun+'/management/getcunsoltant',data:{cookie:LginKy}
        }).then(response=>{
            setConsultantList(response.data.df)
            setConsultant(response.data.df[0].nationalCode)
        })    }
    


    useEffect(GetConsultantAll,[])
    useEffect(verificationCookie,[LginKy])


    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>


            <div className="FrmTbl">
                <div className="TblPlus">
                    <div className="TblTools">
                    <div className="LeftTls">

                        </div>
                        <div className="RightTls">
                            <div className="BtnTools">
                            <span><IoInformationCircleOutline/><p>راهنما</p></span>
                            </div>
                            <div className="BtnTools">
                                <p>مشاور</p>
                                {consultantList==null?null:
                                    <select value={consultant} onChange={(e)=>setConsultant(e.target.value)}>
                                        {consultantList.map(i=>{
                                            return(
                                                <option key={i.nationalCode} value={i.nationalCode}>{i.gender + ' '+i.fristName+ ' '+i.lastName}</option>
                                            )                                        })}
                                    </select>                                }
                            </div>
                        </div>
                    </div>
                    <div className="DshBrd">
                    <div className="RW">
                        <h1 className="Title">صدور</h1>
                        <InssuingSumCunsoltant consultant={consultant} />
                        <IssunigFeildCunsoltant consultant={consultant} />
                        <IssuingInsurenceCunsoltant consultant={consultant} />
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardCunsoltant