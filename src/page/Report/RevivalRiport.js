import { useState, useEffect} from "react"
import { OnRun} from '../../config/config'
import axios from "axios"
import Alarm from "../../componet/Alarm"
import { setCookie , getCookie} from "../../componet/cookie"
import { useNavigate } from 'react-router-dom'
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../../componet/exportPdf"
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {IoRefreshSharp,IoInformationCircleOutline} from "react-icons/io5";
import { BsFileEarmarkSpreadsheetFill,BsFillFilePdfFill} from "react-icons/bs"
import Loader from "../../componet/Loader"
import FromToDateEmpty from "../../componet/Fild/FromToDateEmpty"


const LifeRevival = (props) =>{

    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [consultantList, setConsultantList] = useState(null)
    const [consultant, setConsultant] = useState(null)
    const [type, setType] = useState(props.type)
    const [df, setDf] = useState(null)
    const [AddElement, setAddElement] = useState(false)
    const [RevivalResponse, setRevivalResponse] = useState('extended')
    const [dataRevival, setDataRevival] = useState({'پرداخت کننده حق بیمه':'','تاريخ پایان':'','cunsoltant':'','comp':'','کد رایانه صدور بیمه نامه':''})
    const [loaderAct, setLoaderAct] = useState(false)
    const [Date, setDate] = useState(null)
    const [Operation, setOperation] = useState(false)



    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    if(df!=null){
        var table = new Tabulator("#data-table", {
            data:df,
            layout:"fitColumns",
            responsiveLayout:true,
            columnHeaderSortMulti:true,
            pagination:"local",
            paginationSize:25,
            paginationSizeSelector:[5, 10, 25, 50, 100, 200],
            movableColumns:true,
            layoutColumnsOnNewData:false,
            textDirection:"rtl",
            autoResize:false,
            columns:[
                {title:"مشاور", field:"cunsoltant", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"پرداخت کننده حق بیمه", field:"پرداخت کننده حق بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"تلفن همراه", field:"تلفن همراه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"بيمه گر", field:"comp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input"},                
                {title:"رشته", field:"رشته", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input"},                
                {title:"نوع", field:"ExpirationName", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input"},                
                {title:"مدت زمان روز", field:"Expiration", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input"},
                {title:"تاريخ پایان", field:"تاريخ پایان", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"مبلغ کل حق بیمه", field:"مبلغ کل حق بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"کد رایانه صدور بیمه نامه", field:"کد رایانه صدور بیمه نامه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"عملیات", field:"عملیات", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,
                    cellClick:function(e, cell){
                        if (Operation) {
                            let row = cell.getRow();
                            let data = row.getData();
                            processesRevival(data)
                        }else{
                            setMsg('عملیات غیر فعال است')
                        }
                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">عملیات</div>'}
                },
            ],
        })
    }

    const processesRevival = (data) =>{
        setAddElement(true)
        setDataRevival(data)
    }
    
    const GetDf = () =>{
        if(consultant!=null){
            setLoaderAct(true)
            axios({method:'POST',url:OnRun+'/systemmassage/revival',data:{cookie:LginKy ,consultant:consultant,Date:Date ,type:type}
            }).then(response=>{
                console.log(response.data.df)
                setLoaderAct(false)
                if(response.data.replay){
                    setDf(response.data.df)
                }else{
                    setDf(null)
                    setMsg(response.data.msg)
                }
            })
        }
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

    const GetConsultantAll = () =>{
        axios({method:'POST',url:OnRun+'/management/getcunsoltantandall',data:{cookie:LginKy}
        }).then(response=>{
            setConsultantList(response.data.df)
            setConsultant(response.data.df[response.data.df.length-1].nationalCode)
            setOperation(response.data.operation)
        })    }

    const handleRevivalResponse = () =>{
        axios({method:'POST',url:OnRun+'/issuing/revival',data:{cookie:LginKy,dataRevival:dataRevival,RevivalResponse:RevivalResponse}
        }).then(response=>{
            GetDf()
            setAddElement(false)
        })
    }


    useEffect(GetConsultantAll,[])
    useEffect(verificationCookie,[LginKy])
    useEffect(GetDf,[consultant,type])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Loader enable={loaderAct}/>
            <div className="FrmTbl">
                {AddElement?
                    <div className="FormPlus">
                        <div className="FldPlus">
                            <label>
                                <p>پرداخت کننده حق بیمه</p>
                                <p>{dataRevival['پرداخت کننده حق بیمه']}</p>
                            </label>
                            <label>
                                <p>تاريخ پایان</p>
                                <p>{dataRevival['تاريخ پایان']}</p>
                            </label>
                            <label>
                                <p>بیمه گر</p>
                                <p>{dataRevival['comp']}</p>
                            </label>
                            <label>
                                <p>کد رایانه صدور بیمه نامه</p>
                                <p>{dataRevival['کد رایانه صدور بیمه نامه']}</p>
                            </label>
                            <label>
                                <p>عملیات تمدید</p>
                                <select value={RevivalResponse} onChange={(e)=>setRevivalResponse(e.target.value)}>
                                    <option value='extended'>تمدید شد</option>
                                    <option value='not extended'>تمدید نشد</option>
                                    <option value='no need'>عدم نیاز</option>
                                </select>
                            </label>
                        </div>
                        <div className="BtnBx">
                            <button className="AplBtn" onClick={handleRevivalResponse}>تایید</button>
                            <button className="CnlBtn" onClick={()=>setAddElement(false)}>لغو</button>
                        </div>
                    </div>
                    :null
                }
                <div className="TblPlus">
                <div className="TblTools">
                        <div className="LeftTls">
                            <div className="BtnTools TlsDwnld" onClick={() => { table.download("xlsx", "data.xlsx") }}>
                                <span><BsFileEarmarkSpreadsheetFill/></span>
                                <span>خروجی اکسل</span>
                            </div>
                            <div className="BtnTools TlsDwnld" onClick={exportPdf}>
                                <span><BsFillFilePdfFill/></span>
                                <span>خروجی پی دی اف</span>
                            </div>
                        </div>
                        <div className="RightTls">
                            <div className="BtnTools" onClick={GetDf}>
                                <span><IoRefreshSharp/><p>بارگذاری</p></span>
                            </div>
                            <div className="BtnTools">
                                <span><IoInformationCircleOutline/><p>راهنما</p></span>
                            </div>
                            <div className="BtnTools">
                                <p>مشاور</p>
                                {consultantList==null?null:
                                    <select value={consultant} onChange={(e)=>setConsultant(e.target.value)}>
                                        {consultantList.map(i=>{
                                            return(
                                                <option key={i.nationalCode} value={i.nationalCode}>{i.gender + ' '+i.fristName+ ' '+i.lastName}</option>
                                            )                                        })}
                                    </select>                                }
                            </div>
                            <div className="BtnTools">
                                <p>نوع</p>
                                <select value={type} onChange={(e)=>setType(e.target.value)}>
                                    <option>همه</option>
                                    <option>منقضی شده</option>
                                    <option>اخطار انقضا</option>
                                    <option>هشدار انقضا</option>
                                    <option>اعلان انقضا</option>
                                    <option>تمدید شد</option>
                                    <option>تمدید نشد</option>
                                    <option>عدم نیاز</option>
                                </select>
                            </div>
                            <FromToDateEmpty setDate={setDate} />

                        </div>
                    </div>
                    <div id="data-table"></div>
                </div>
            </div>
        </div>

    )
}


export default LifeRevival