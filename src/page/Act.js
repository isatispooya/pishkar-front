import { useState, useEffect ,useContext} from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import DateP from "../componet/context"

const Act = () =>{
    const datePeriod = useContext(DateP)
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [ListAct , setListAct] = useState(null)
    const [ActDefult , setActDefult] = useState(0)
    const [HoursDefult , setHoursDefult] = useState(0)
    const [VactionDefult , setVactionDefult] = useState(0)
    const [ActInLow , setActInLow] = useState(0)
    const [dayOfMonth , setDayfoMonth] = useState(30)

    const setAct = (v,g) =>{
        if(ListAct!=null){
        var newAct = ListAct.map(j=>{
            if(j == g){
                return {...g,act:v}
            }
            return j
        })
        setListAct(newAct)}
    }

    const setActHour = (v,g) =>{
        if(ListAct!=null){
        var newAct = ListAct.map(j=>{
            if(j == g){
                return {...g,hours:v}
            }
            return j
        })
        setListAct(newAct)}
    }

    const setVaction = (v,g) =>{
        if(ListAct!=null){
        var newAct = ListAct.map(j=>{
            if(j == g){
                return {...g,vaction:v}
            }
            return j
        })
        setListAct(newAct)}
    }

    const handleActDefult = (v) =>{
        if(ListAct!=null){
        setActDefult(v)
        var newAct = ListAct.map(j=>{
                return {...j,act:v}
        })
        setListAct(newAct)}
    }

    const handleHourDefult = (v) =>{
        if(ListAct!=null){
        setHoursDefult(v)
        var newAct = ListAct.map(j=>{
                return {...j,hours:v}
        })
        setListAct(newAct)}
    }

    const handleVactionDefult = (v) =>{
        if(ListAct!=null){
        setVactionDefult(v)
        var newAct = ListAct.map(j=>{
                return {...j,vaction:v}
        })
        setListAct(newAct)}
    }


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


    const copyLastMonth = () =>{
        axios({method:'POST',url:OnRun+'/consultant/actcopylastmonth',data:{cookie:LginKy,date:datePeriod}
        }).then(response=>{
            if(response.data.replay){
                getAllConsultant()
            }else{
                setMsg(response.data.msg)
            }
        })
    }

    const getAllConsultant = () =>{
        if(datePeriod!=''){
            axios({method:'POST',url:OnRun+'/consultant/getatc',data:{cookie:LginKy,today:datePeriod}
            }).then(response=>{
                if (response.data.replay){
                    setListAct(response.data.df)
                }else{
                    setMsg(response.data.msg)
                }
            })
        }
    }


    const handleSetAct = () =>{
        if(ListAct!=null){
        axios({method:'POST',url:OnRun+'/consultant/setatc',data:{cookie:LginKy,listatc:ListAct}
        }).then(response=>{
            if(response.data.replay){
                setMsg('ثبت شد')
            }
        })}
    }

    const getActLow = () =>{
        if(datePeriod!=''){
            axios({method:'POST',url:OnRun+'/management/getaworkinghour', data:{cookie:LginKy,date:datePeriod}
            }).then(response=>{
                setActInLow(response.data.df)
            })
        }


    }

    const handleDayOfMonth = () =>{
        if(datePeriod!=''){
            if(typeof datePeriod.date == 'number'){
                
            }else{
                setDayfoMonth(datePeriod.date.month.length)
            }
        }
    }

    useEffect(verificationCookie,[LginKy])
    useEffect(getAllConsultant,[datePeriod])
    useEffect(getActLow,[datePeriod])
    useEffect(handleDayOfMonth,[datePeriod])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <div className="OnlyForm">
                <div className="Feild rowly">
                    <label className="ttl">
                        <p>دوره (ماه)</p>
                        {datePeriod!=''?<p>{datePeriod.Show}</p>:null}
                        <p>کارکرد قانونی {ActInLow==0?'تعریف نشده':ActInLow + 'ساعت'}</p>
                    </label>
                    {ListAct==null?null:
                        <label>
                            <p>پیش فرض برای همه</p>
                            <div className="inpMrg">
                                <input type='number' value={HoursDefult} onChange={(e)=>handleHourDefult(e.target.value)}/>
                                <span>ساعات کارکرد</span>
                            </div>
                            <div className="inpMrg">
                                <input type='number' value={VactionDefult} onChange={(e)=>handleVactionDefult(e.target.value)}/>
                                <span>ساعات مرخصی</span>
                            </div>
                            <div>

                            </div>
                            <div className="inpMrg">
                                <input type='number' value={ActDefult} onChange={(e)=>handleActDefult(e.target.value)}/>
                                <span>روز</span>
                            </div>
                        </label>
                    }
                    {ListAct==null?null:ListAct.map(g=>{
                        return(
                            <label key={g.nationalCode}>
                                <p>{g.gender +' '+ g.fristName +' '+ g.lastName}</p>
                                <div className="inpMrg">
                                    <input type='number' value={g.hours} onChange={e=>setActHour(e.target.value,g)}/>
                                    <span>ساعات کارکرد</span>
                                </div>
                                <div className="inpMrg">
                                    <input type='number' value={g.vaction} onChange={e=>setVaction(e.target.value,g)}/>
                                    <span>ساعات مرخصی</span>
                                </div>
                                <div className="inpMrg">
                                    {
                                        ActInLow==0?
                                        <p>ساعات کارکرد قانونی ثبت نشده</p>:
                                        <span>{Math.round((((Math.floor(g.vaction) + Math.floor(g.hours))/ActInLow)*dayOfMonth)*100)/100} روز</span>
                                    }
                                </div>
                                <div className="inpMrg">
                                    <input type='number' value={g.act} onChange={e=>setAct(e.target.value,g)}/>
                                    <span>روز</span>
                                </div>
                            </label>
                            )
                        })}
                </div>
                <button onClick={handleSetAct}>ثبت</button>
                <button onClick={copyLastMonth}>رونویسی از اخرین ماه</button>
            </div>
        </div>
    )
}

export default Act