import { setCookie } from "./cookie"
import { useNavigate } from 'react-router-dom'
import Profile from "../page/Profile"
import SystemMassage from "./Header/SystemMassage";
import {IoExitOutline, IoInformationCircleOutline, IoNotificationsCircleOutline} from "react-icons/io5";
import packageJson from '../../package.json';
import axios from "axios";
import { OnRun } from "../config/config";
import { getCookie } from "./cookie";
import { useEffect } from "react";
import { useState } from "react";
import Revival from './Header/revival'

const Header = (props) =>{
    const LginKy = getCookie('LginKy')
    const native = useNavigate()
    const Exit = () =>{
        setCookie('LginKy','',0)
        native('/')
    }

    const [Notification, setNotification] = useState(false)

    const AddTab = (row) =>{
        var LoopObject = row
        LoopObject.key = row.id
        if(!props.ActiveTab.map(i=>i.key).includes(LoopObject.key)){
            if(props.ActiveTab.length>7){
                props.setActiveTab(props.ActiveTab.shift())
            }
            props.setActiveTab([...props.ActiveTab,LoopObject])
            props.setCurrentTab(props.ActiveTab.length)
        }
    }


    const CheckAlarmSystem = () =>{
        axios({method:'POST',url:OnRun+'/systemmassage/alarm',data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setNotification(response.data.Alarm)
            }
        })
    }




    useEffect(CheckAlarmSystem,[])
    if(props.user!=undefined){
        return(
            <div className="Header">
                <div className="ttlr">
                    <div className="nm">
                        <h1>{props.user.name}</h1>
                    </div>
                    <div className="brdrVrtcl"></div>
                    <div>
                        <div>
                            <p>نسخه {packageJson.version}</p>
                        </div>
                        <div>
                            <p>{props.user.limAccunt}</p>
                            <p>روز اعتبار</p>
                        </div>
                    </div>
                </div>
                <div className="btnhdr">
                    <Revival ActiveTab={props.ActiveTab} setActiveTab={props.setActiveTab} setCurrentTab={props.setCurrentTab}/>
                    <div className="brdrVrtcl"></div>
                    <div className="ttlHd" >
                        <p>دوره کار</p>
                        <p>{props.datePeriod.Show}</p>
                    </div>
                    <div className="brdrVrtcl"></div>
                    <div className="MnUsr">
                        {
                            Notification==false?null:
                            <span className="Notification"><IoNotificationsCircleOutline /></span>
                        }
                        <p>سیستم</p>
                        <img src="/icon/dropDown.png"></img>
                        <div className="MnUsr-Sb">
                            <div>
                                <p onClick={()=>AddTab({id:1010,title:'پیام ها',icon:'',element:<SystemMassage /> ,key:''})}>پیام ها</p>
                                {
                                    Notification==false?null:
                                    <span className="Notification notifblack"><IoNotificationsCircleOutline /></span>
                                }
                            </div>
                            <p onClick={()=>AddTab({id:1020,title:'پروفایل',icon:'',element:<Profile /> ,key:''})}>پروفایل</p>
                        </div>
                    </div>
                    <div className="BtnHd" >
                        <span><IoInformationCircleOutline /></span>
                        <button>آموزش</button>
                    </div>
                    <div className="BtnHd" onClick={Exit}>
                        <span><IoExitOutline /></span>
                        <button>خــــروج</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header