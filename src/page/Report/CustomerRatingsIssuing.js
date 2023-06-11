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
import FromToDate from "../../componet/Fild/FromToDate"

const CustomerRatingsIssuing = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [consultantList, setConsultantList] = useState(null)
    const [consultant, setConsultant] = useState(null)
    const [df, setDf] = useState(null)
    const [loaderAct, setLoaderAct] = useState(true)
    const [Date, setDate] = useState(null)

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
            dataTree:true,
            dataTreeStartExpanded:false,
            columns:[
                {title:"نام", field:"name", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"بیمه گر", field:"comp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"گروه رشته", field:"groupMain", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"کد ملي بيمه گذار",visible:false, field:"کد ملي بيمه گذار", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:6,headerFilter:"input"},                
                {title:"مبلغ کل حق بیمه", field:"مبلغ کل حق بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},bottomCalcFormatter:function(cell){return(cell.getValue().toLocaleString())},formatter:function(cell){return(cell.getValue().toLocaleString())}},                
                {title:"تعداد", field:"count", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},bottomCalcFormatter:function(cell){return(cell.getValue().toLocaleString())},formatter:function(cell){return(cell.getValue().toLocaleString())}},
            ],
        })
    }

    const GetDf = () =>{
        if(consultant!=null && Date!=null){
            setLoaderAct(true)
            axios({method:'POST',url:OnRun+'/reports/customerratingsissuing',data:{cookie:LginKy,consultant:consultant,Date:Date}
            }).then(response=>{
                if(response.data.replay){
                    setDf(response.data.df)
                }else{
                    setDf(null)
                    setMsg(response.data.msg)
                }
                setLoaderAct(false)
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
            console.log(response.data.df[response.data.df.length-1].nationalCode)
            setConsultantList(response.data.df)
            setConsultant(response.data.df[response.data.df.length-1].nationalCode)
        })    }


    useEffect(GetConsultantAll,[])
    useEffect(verificationCookie,[LginKy])
    useEffect(GetDf,[consultant])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Loader enable={loaderAct}/>

            <div className="FrmTbl">
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
                            <FromToDate setDate={setDate} />

                        </div>
                    </div>
                    <div id="data-table"></div>
                </div>
            </div>
        </div>
    )
}

export default CustomerRatingsIssuing