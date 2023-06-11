import { useState, useEffect } from "react"
import { OnRun } from "../config/config"
import axios from "axios"


const SetConsultant = (props) =>{
    const [insurnac, setInsurnac] = useState(null)
    const [consultantSelect, setConsultantSelect] = useState(0)


    const handleGetInsurnac = () =>{
        if(props.code!=null){
                axios({method:'POST',url:OnRun+'/assing/getinsurnac',data:{cookie:props.LginKy, code:props.code}
            }).then(Response=>{
                setInsurnac(Response.data.dic)
                setConsultantSelect(Response.data.dic.Consultant.code)
            })
        }
    }
    const handleSetConsultant = () =>{
        axios({method:'POST',url:OnRun+'/assing/set',data:{cookie:props.LginKy,code:props.code, consultant:consultantSelect}
        }).then(Response=>{
            //props.GetAllInsurance()
            props.setcode(null)
        })
    }

    useEffect(handleGetInsurnac,[props.code])

    if(props.code!=null){
        return(
            <div className="PopUp">
                {insurnac==null?null:
                    <div>
                        <label>
                            <p>بيمه گذار</p><span>:</span>
                            <p className="answr">{insurnac['بيمه گذار']}</p>
                        </label>
                        <label>
                            <p>شماره بيمه نامه</p><span>:</span>
                            <p className="answr">{insurnac['شماره بيمه نامه']}</p>
                        </label>
                        <label>
                            <p>رشته مورد</p><span>:</span>
                            <p className="answr">({insurnac['مورد بیمه']}) {insurnac['رشته']}</p>
                        </label>
                        <label>
                            <p>بیمه گر</p><span>:</span>
                            <p className="answr">{insurnac['comp']}</p>
                        </label>
                        <label>
                            <p>تاریخ صدور بیمه نامه</p><span>:</span>
                            <p className="answr">{insurnac['تاریخ صدور بیمه نامه']}</p>
                        </label>
                        <label>
                            <p>مشاور فعلی</p><span>:</span>
                            <p className="answr">{insurnac['Consultant']['name']}</p>
                        </label>
                        <label>
                            <p>اختصاص به</p><span>:</span>
                            <select className="answr" value={consultantSelect} onChange={e=>setConsultantSelect(e.target.value)}>
                                {props.consultant==null?null:
                                    props.consultant.df.map(i=>{
                                        return(
                                            <option key={i.nationalCode} value={i.nationalCode}>{i.gender +' '+ i.fristName +' '+ i.lastName}</option>
                                        )
                                    })
                                }
                                <option key='0' value='0'>بدون مشاور</option>
                            </select>
                        </label>
                    </div>
                }
                <button onClick={handleSetConsultant}>ثبت</button>
                <button onClick={()=>props.setcode(null)}>لغو</button>
            </div>
        )
    }
}

export default SetConsultant