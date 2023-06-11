import { useState, useEffect ,useContext} from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import DateP from "../componet/context"


const ManegBranches = () =>{
    const datePeriod = useContext(DateP)
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [loaderAct, setLoaderAct] = useState(true)
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [BranchesList, setBranchesList] = useState(null)
    const [Branches, setBranches] = useState(null)
    const [valueBranche , setValueBranche] = useState([])

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




    const getBranche = () =>{
        axios({method:'POST',url:OnRun+'/management/getbranche',data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setBranchesList(response.data.df)
                setBranches(response.data.df[0].BranchesName)
            }else{
                setMsg(response.data.msg)
            }
        })
    }

    const getValueBranche = () =>{
        if(Branches!=null && datePeriod!=''){
            axios({method:'POST',url:OnRun+'/branche/getvalue',data:{cookie:LginKy,Branches:Branches,date:datePeriod}
            }).then(response=>{
                if(response.data.replay){
                    setValueBranche(response.data.df)
                }else{
                    setValueBranche([])
                }
            })
        }
    }

    const addSubConsultant = () =>{
        setValueBranche(valueBranche.concat({id:valueBranche.length,title:'',value:0}))
    }
    
    const copyLastMonth = () =>{
        if(Branches!=null && datePeriod!=''){
            axios({method:'POST',url:OnRun+'/branche/copypreviousmonth',data:{cookie:LginKy,Branches:Branches,date:datePeriod}
            }).then(response=>{
                if(response.data.replay){
                    getValueBranche()
                }else{
                    setMsg(response.data.msg)
                }
            })
        }
    }

    const updateBrancheTitle = (v,i) =>{
        var newAct = valueBranche.map(j=>{if(j.id == i){return {...j,title:v}}return j})
        setValueBranche(newAct)
    }
    const updateBrancheValue = (v,i) =>{
        var newAct = valueBranche.map(j=>{if(j.id == i){return {...j,value:v}}return j})
        setValueBranche(newAct)
    }
    const handleCheckfild = ()=>{
        var cheakTitle = valueBranche.map(i=>{
            if(i.title=='' && i.value==''){
                return false
            }else{
                return true
            }
        })
        return cheakTitle
    }

    const addbrancheValue = () =>{
        if(Branches==null){setMsg('شعبه را انتخاب کنید')
        }else if(datePeriod==''){setMsg('دوره را انتخاب کنید')
        }else if(valueBranche.length==0){setMsg('هیچ موردی افزوده نشده')
        }else if(!handleCheckfild()){setMsg('همه ورودی ها کامل نیست')
        }else{
            axios({method:'POST',url:OnRun+'/branche/addvalue',data:{cookie:LginKy,Branches:Branches,date:datePeriod,valueBranche:valueBranche}
            }).then(response=>{
                if(response.data.replay){
                    setMsg('ثبت شد')
                }
            })
        }
    }

    useEffect(verificationCookie,[LginKy])
    useEffect(getBranche,[])
    useEffect(getValueBranche,[Branches,datePeriod])

    return(
        <div className="PgLine">
            <div className="TtlHeader">
                <h1>فعالیت شعب</h1>
            </div>
            <Alarm msg={msg} smsg={setMsg}/>
            <div className="OnlyForm">
                <div className="Feild">
                    <label>
                        <p>دوره</p>
                        <p>{datePeriod.Show}</p>
                    </label>
                    <label>
                        <p>شعبه</p>
                        {BranchesList==null?<p>هیچ شعبه ای یافت نشد</p>:
                            <select value={Branches} onChange={(e)=>setBranches(e.target.value)}>
                                {BranchesList.map(i=>{
                                    return(
                                        <option key={i.BranchesName} value={i.BranchesName}>{i.BranchesName}</option>
                                    )
                                })}
                            </select>
                        }
                    </label>
                    {valueBranche.length==0?null:
                        valueBranche.map(i=>{
                            return(
                                <div key={i.id}>
                                    <label>
                                        <p>عنوان</p>
                                        <input value={i.title} onChange={(e)=>updateBrancheTitle(e.target.value,i.id)} />
                                        <p>مقدار</p>
                                        <input type='Number' value={i.value} onChange={(e)=>updateBrancheValue(e.target.value,i.id)}/>
                                    </label>
                                </div>
                            )
                        })
                    }
                </div>
                <button onClick={addSubConsultant}>افزودن</button>
                <button onClick={copyLastMonth}>رونویسی از اخرین ماه</button>
                <button onClick={addbrancheValue}>ثبت</button>
            </div>
        </div>
    )
}


export default ManegBranches