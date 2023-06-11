import { useState, useEffect } from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import Header from "../componet/header"
import Menu from "../componet/Menu"
import { Outlet } from "react-router-dom"


const Management = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState(null)

    const listMenu =[
        {key:0, title:'پروفایل',icon:'/icon/dashboard.png',navigate:'profile'},
        {key:1, title:'جدول حقوق',icon:'/icon/dashboard.png',navigate:'salaryyear'},
        {key:2, title:'حداقل حقوق',icon:'/icon/dashboard.png',navigate:'minsalary'},
        {key:3, title:'مشاوران',icon:'/icon/dashboard.png',navigate:'consultant'},
        {key:4, title:'شعب',icon:'/icon/dashboard.png',navigate:'branches'},
        {key:5, title:'بیمه گر',icon:'/icon/dashboard.png',navigate:'insurer'},
        {key:6, title:'مالیات',icon:'/icon/dashboard.png',navigate:'taxe'},
        {key:7, title:'حساب های فرعی',icon:'/icon/dashboard.png',navigate:'subaccunt'},
    ]

    const verificationCookie = () =>{
        axios({method:'POST',url:OnRun+'/sing/cookie',data:{cookie:LginKy}
        }).then(response=>{
            if(!response.data.replay){
            setCookie('LginKy','',0)
            native('/')
            }else{
                setUser(response.data.user)
            }
        }).catch(error=>{setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
    })        }

    useEffect(verificationCookie,[LginKy])



    if(user!=undefined){
        if(user.management){
            return(
                <div>
                    <Header user={user}/>
                    <div className="DM">
                        <Menu listMenu={listMenu} />
                        <Outlet/>
                    </div>
                </div>
            )
        }else{
            native('/desk')
        }
    }


}

export default Management