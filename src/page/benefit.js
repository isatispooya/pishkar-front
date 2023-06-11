import { useState, useEffect ,useContext} from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import DateP from "../componet/context"

const Benefit = () =>{
    const datePeriod = useContext(DateP)
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [ListBenefit , setListBenefit] = useState(null)

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

    const setBenefit = (v,i) =>{
        if(ListBenefit!=null){
            var newV = ListBenefit.map(j=>{
                if(j == i){return {...j,benefit:v}}
                return j
            })
            setListBenefit(newV)
        }
    }

        const getAllConsultant = () =>{
            if(datePeriod!=''){
                axios({method:'POST',url:OnRun+'/pay/getbenefit',data:{cookie:LginKy,today:datePeriod}
                }).then(response=>{
                    console.log(response.data)
                    if (response.data.replay){
                        setListBenefit(response.data.df)
                    }else{
                        setMsg(response.data.msg)
                    }
                })
            }
        }
    
    const handleSetBenefit = () =>{
        if(ListBenefit!=null){
        axios({method:'POST',url:OnRun+'/pay/setbenefit',data:{cookie:LginKy,ListBenefit:ListBenefit,date:datePeriod}
        }).then(response=>{
            console.log(response.data)
            if(response.data.replay){
                setMsg('ثبت شد')
            }
        })}
    }

    const copyLastMonth = () =>{
        axios({method:'POST',url:OnRun+'/benefit/copylastmonth',data:{cookie:LginKy,date:datePeriod}
        }).then(response=>{
            if(response.data.replay){
                getAllConsultant()
            }else{
                setMsg(response.data.msg)
            }
        })
    }

    useEffect(verificationCookie,[LginKy])
    useEffect(getAllConsultant,[datePeriod])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <div className="TtlHeader">
                <h1>سایر مزایایی غیر نقدی</h1>
            </div >
            <div className="OnlyForm">
                <div className="Feild">
                    <label>
                        <p>دوره (ماه)</p>
                        <p>{datePeriod.Show}</p>
                    </label>
                    {ListBenefit==null?null:
                        ListBenefit==undefined?null:
                            ListBenefit.map(i=>{
                                return(
                                    <label key={i.nationalCode}>
                                        <p>{i.fristName +' '+ i.lastName}</p>
                                        <input type='number' value={i.benefit} onChange={e=>setBenefit(e.target.value,i)}/>
                                    </label>
                                )
                            })
                    }
                </div>
                <button onClick={handleSetBenefit}>ثبت</button>
                <button onClick={copyLastMonth}>رونویسی از اخرین ماه</button>

            </div>
        </div>
    )
}


export default Benefit