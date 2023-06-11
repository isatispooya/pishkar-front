import { useState, useEffect } from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'

const Profile = () =>{
    
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

    const handlerApplyProfile = () =>{
        axios({method:'POST',url:OnRun+'/management/profile',data:{cookie:LginKy,userNew:user}
        }).then(response=>{

        })

    }

    useEffect(verificationCookie,[LginKy])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <div className="TtlHeader">
                <h1>پروفایل</h1>
            </div>
            <div className="OnlyForm">
                <div className="Feild">
                    <label>
                        <p>نام کامل</p>
                        <input value={user.name} onChange={(e)=>setUser({...user, name:e.target.value})} />
                    </label>
                    <label>
                        <p>نام شرکت/سازمان/شعبه</p>
                        <input value={user.company} onChange={(e)=>setUser({...user, company:e.target.value})} />
                    </label>
                    <label>
                        <p>ادرس</p>
                        <input value={user.address} onChange={(e)=>setUser({...user, address:e.target.value})} />
                    </label>
                    <label>
                        <p>ایمیل</p>
                        <input value={user.email} onChange={(e)=>setUser({...user, email:e.target.value})} />
                    </label>
                    <label>
                        <p>تلفن همراه</p>
                        <input value={user.phone} disabled />
                    </label>
                    <label>
                        <p>تلفن ثابت</p>
                        <input value={user.phonework} onChange={(e)=>setUser({...user, phonework:e.target.value})} />
                    </label>
                    <label>
                        <p>تاریخ ثبت نام</p>
                        <input value={user.registerdate} disabled/>
                    </label>
                    <label>
                        <p>تاریخ اشتراک</p>
                        <input value={user.limitDate} disabled/>
                    </label>
                </div>
                <button onClick={handlerApplyProfile}>ثبت</button>
            </div>
        </div>
    )
}

export default Profile