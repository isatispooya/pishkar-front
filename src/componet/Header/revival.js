import { useState, useEffect } from "react"
import { OnRun } from "../../config/config"
import axios from "axios"
import { setCookie , getCookie} from "../../componet/cookie"
import { useNavigate } from 'react-router-dom'
import { IoWarningOutline ,IoWarning} from "react-icons/io5";
import RevivalReport from '../../page/Report/RevivalRiport'
const Revival = (props) =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [threshold, setThreshold] = useState(null)


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


    const getRevival = () =>{
        axios({method:'POST',url:OnRun+'/systemmassage/revival',data:{cookie:LginKy,type:'len'}
        }).then(response=>{
            setThreshold(response.data.threshold)
        })
    }

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

    useEffect(verificationCookie,[LginKy])
    useEffect(getRevival,[])
    return(
        <div className="Revival" >
            {
                threshold==null?null:
                    threshold.Black==0?null:
                        <div className="notifiction black" onClick={()=>AddTab({id:1150,title:'سرسیدنامه تمدید',icon:'',element:<RevivalReport type={'منقضی شده'}/>,key:''})}>
                            <p className="ico"><IoWarning /></p>
                            <p className="number">{(threshold.Black).toLocaleString()}</p>
                            <div className="Description">
                                <p>{(threshold.Black).toLocaleString()}</p>
                                <p>بیمه نامه منقضی شد</p>
                            </div>
                        </div>
            }
            {
                threshold==null?null:
                    threshold.Red==0?null:
                        <div className="notifiction Red" onClick={()=>AddTab({id:1150,title:'سرسیدنامه تمدید',icon:'',element:<RevivalReport type={'اخطار انقضا'}/>,key:''})}>
                            <p className="ico"><IoWarning /></p>
                            <p className="number">{(threshold.Red).toLocaleString()}</p>
                            <div className="Description">
                                <p>{(threshold.Red).toLocaleString()}</p>
                                <p>بیمه نامه اخطار انقضا</p>
                            </div>
                        </div>
            }
            {
                threshold==null?null:
                    threshold.Oreng==0?null:
                        <div className="notifiction Oreng" onClick={()=>AddTab({id:1150,title:'سرسیدنامه تمدید',icon:'',element:<RevivalReport type={'هشدار انقضا'}/>,key:''})}>
                            <p className="ico"><IoWarning /></p>
                            <p className="number">{(threshold.Oreng).toLocaleString()}</p>
                            <div className="Description">
                                <p>{(threshold.Oreng).toLocaleString()}</p>
                                <p>بیمه نامه هشدار انقضا</p>
                            </div>
                        </div>
            }
            {
                threshold==null?null:
                    threshold.Yellow==0?null:
                        <div className="notifiction Yellow" onClick={()=>AddTab({id:1150,title:'سرسیدنامه تمدید',icon:'',element:<RevivalReport type={'اعلان انقضا'}/>,key:''})}>
                            <p className=" ico"><IoWarning /></p>
                            <p className="number">{(threshold.Yellow).toLocaleString()}</p>
                            <div className="Description">
                                <p>{(threshold.Yellow).toLocaleString()}</p>
                                <p>بیمه نامه اعلان انقضا</p>
                            </div>
                        </div>
            }
        </div>
    )
}

export default Revival