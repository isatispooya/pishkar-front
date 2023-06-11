
import { useState, useEffect } from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import { DatePickerToInt } from "../componet/Date"
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import Loader from "../componet/Loader"




const ConsultantsFees = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [msg, setMsg] = useState('')
    const [consultantList, setConsultantList] = useState(null)
    const [consultantNC, setConsultanNC] = useState(null)
    const [consultantFees, setConsultantFees] = useState(null)
    const [FeesDefulte, setFeesDefulte] = useState(0)
    const [loaderAct, setLoaderAct] = useState(false)
    

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


    const handleFeesDefulte = (e) =>{
        setFeesDefulte(e.target.value)
        var con = consultantFees
        for(const i in consultantFees){
            con[i]=e.target.value
        }
    }

    const getConsultantFees = () =>{
        setLoaderAct(true)
        if(consultantNC!=null){
            axios({method:'POST',url:OnRun+'/consultant/getfees',data:{cookie:LginKy,nationalCode:consultantNC}
            }).then(response=>{
                setConsultantFees(response.data.df[0])
                setLoaderAct(false)
            })
        }
    }


    const GetConsultantAll = () =>{
        axios({method:'POST',url:OnRun+'/management/getcunsoltant',data:{cookie:LginKy,integration:true}
        }).then(response=>{
            var data = response.data
            if(data.replay){
                setConsultantList(data.df)
                if(consultantNC==null){
                    setConsultanNC(data.df[0].nationalCode)
                }
            }else{
                setMsg(data.msg)
            }
        })
    }

    const handleSetConsultantFees = () =>{
        axios({method:'POST',url:OnRun+'/consultant/setfees',data:{cookie:LginKy,fees:consultantFees,nc:consultantNC}
        }).then(response=>{
            if(response.data.replay){
                setMsg('ثبت شد')
            }
        })
    }
    
    useEffect(verificationCookie,[LginKy])
    useEffect(GetConsultantAll,[])
    useEffect(getConsultantFees,[consultantNC])
    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Loader enable={loaderAct}/>

            <div className="TtlHeader">
                <h1>کارمزد مشاوران</h1>
            </div>
            <div className="OnlyForm">
                <div className="Feild">
                    <label className="FldName">
                        <p>مشاور</p>
                        {consultantNC==null?null:
                            <select value={consultantNC} onChange={(e)=>setConsultanNC(e.target.value)}>
                                {consultantList==null?null:
                                    consultantList.map(i=>{
                                        return(
                                            <option key={i.nationalCode} value={i.nationalCode}>{i.gender+' '+ i.fristName+' '+i.lastName}</option>
                                        )
                                    })
                                }
                            </select>
                        }
                    </label>
                    {consultantFees==null?null:
                        <label>
                            <p>پیش فرض برای همه</p>
                            <input type='number' value={FeesDefulte} onChange={(e)=>handleFeesDefulte(e)}/>
                        </label>
                    }
                    {consultantFees==null?null:
                                Object.keys(consultantFees).map(i=>{
                                    if(i!='employment' && i!='salary'){
                                        return(
                                            <label key={i}>
                                                <p>{i}</p>
                                                <div className="inpMrg">
                                                    <input type='number' value={consultantFees[i]} onChange={(e)=>{setConsultantFees({...consultantFees,[i]:e.target.value})}}/>
                                                    <span>%</span>
                                                </div>
                                            </label>
                                        )
                                    }

                                })
                            }
                </div>
                <button onClick={handleSetConsultantFees}>ثبت</button>
            </div>

        </div>
    )
}

export default ConsultantsFees