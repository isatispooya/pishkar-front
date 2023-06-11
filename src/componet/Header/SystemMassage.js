import { useState, useEffect } from "react"
import { OnRun } from "../../config/config"
import axios from "axios"
import Alarm from "../../componet/Alarm"
import { setCookie , getCookie} from "../../componet/cookie"
import { useNavigate } from 'react-router-dom'
import { IoWarningOutline } from "react-icons/io5";

const SystemMassage = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [NullCustomer, setNullCustomer] = useState(null)
    const [NullStandardFee, setNullStandardFee] = useState(null)
    const [CusrtomerInComp, setCusrtomerInComp] = useState(null)
    const [CusrtomerNotCode, setCusrtomerNotCode] = useState(null)
    
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

    const customerCheck = () =>{
        axios({method:'POST', url:OnRun+'/systemmassage/customercheck', data:{cookie:LginKy}
        }).then(response=>{
            setNullCustomer(response.data.df)
        })
    }

    const standardFeeCheck = () =>{
        axios({method:'POST', url:OnRun+'/systemmassage/standardfeecheck', data:{cookie:LginKy}
        }).then(response=>{
            setNullStandardFee(response.data.df)
        })
    }

    const counsultantFeeCheck = () =>{
        axios({method:'POST', url:OnRun+'/systemmassage/counsultantfee', data:{cookie:LginKy}
        }).then(response=>{
            console.log(response.data)
        })
    }

    const GetCusrtomerInComp = () =>{
        axios({method:'POST',url:OnRun+'/systemmassage/customerincomp',data:{cookie:LginKy}
        }).then(response=>{
            setCusrtomerInComp(response.data.df)
        })    }

    
    const GetCusrtomerInCompNoCode = () =>{
        axios({method:'POST',url:OnRun+'/systemmassage/customerincompnocode',data:{cookie:LginKy}
        }).then(response=>{
            setCusrtomerNotCode(response.data.df)
        })    }

    useEffect(verificationCookie,[LginKy])
    useEffect(customerCheck,[])
    useEffect(standardFeeCheck,[])
    useEffect(counsultantFeeCheck,[])
    useEffect(GetCusrtomerInComp,[])
    useEffect(GetCusrtomerInCompNoCode,[])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <div className="TtlHeader">
                <h1>پیام های سیستم</h1>
            </div>
            <div className="OnlyForm">
                {
                    NullCustomer==null?null:
                    Object.keys(NullCustomer).map(i=>{
                        if(NullCustomer[i]['len']>0){
                            console.log(NullCustomer[i])
                            return(
                                <div className="warrning">
                                    <h1><IoWarningOutline/></h1>
                                    <div>
                                        <h2>نقض اطلاعات مشتری</h2>
                                        <p>{'تعداد ' + NullCustomer[i]['len'] + ' مورد نقص در ' + ' " ' + i + ' " ' + 'از جمله' + '('+NullCustomer[i]['sample'] +')' +' وجود دارد'}</p>
                                    </div>
                                </div>
                            )
                        }
                    })
                }
                {
                    NullStandardFee==null?null:
                    NullStandardFee.map(i=>{
                        return(
                            <div className="alarm">
                                <h1><IoWarningOutline/></h1>
                                <div>
                                    <h2>نقض کارمزد های استاندارد</h2>
                                    <p>{'عنوان بیمه نامه ' + ' " ' + i + ' " ' + ' در کارمزد های استاندارد(آیین نامه) ثبت نشده است'}</p>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    CusrtomerInComp==null?null:
                    CusrtomerInComp.map(i=>{
                        return(
                            <div className="warrning">
                                <h1><IoWarningOutline/></h1>
                                <div>
                                    <h2>نقض اطلاعات مشتری</h2>
                                    {
                                        i.cuont>10?
                                        <p>{'اطلاعات' + i.cuont + ' ' + 'نفر از مشتریان بیمه گر' +  ' "' + i.comp + '" ' + 'از جمله' + ' (' + i.name.toString() +') ' + 'موجود نیست'}</p>
                                        :
                                        <p>{'اطلاعات' + ' "' + i.name + '" ' + 'از بیمه گر' +  ' "' + i.comp + '" ' + 'موجود نیست'}</p>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                {
                    CusrtomerNotCode==null?null:
                    CusrtomerNotCode.map(i=>{
                        return(
                            <div className="warrning">
                            <h1><IoWarningOutline/></h1>
                            <div>
                                <h2>نقض اطلاعات بیمه نامه</h2>
                                {

                                    <p>{'نام بیمه گذار' + ' "' + i.customer + '" ' + 'باشماره بیمه' + ' "' + i.num + '" ' + 'در شرکت بیمه' +  ' "' + i.comp + '"' + ' '+'بدون کد ثبت شده'}</p>
                                    
                                }
                            </div>
                        </div>
                        )
                    })
                }

            </div>
        </div>
    )
}

export default SystemMassage