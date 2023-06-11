import { useState, useEffect } from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../componet/exportPdf"
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import Loader from "../componet/Loader"
import {IoRefreshSharp,IoInformationCircleOutline} from "react-icons/io5";
import { BsFileEarmarkSpreadsheetFill,BsFillFilePdfFill} from "react-icons/bs"


const AssingInssuing = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [loaderAct, setLoaderAct] = useState(true)
    const [showAll, setShowAll] = useState(false)
    const [dfTable, setdfTable] = useState(null)
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [AddElement, setAddElement] = useState(false)
    const [consultantList, setConsultantList] = useState(null)
    const [consultant, setConsultant] = useState(null)
    const [InsurenceData, setInsurenceData] = useState(null)


    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    if(dfTable!=null){
        var table = new Tabulator("#data-table", {
            data:dfTable,
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
                {title:"پرداخت کننده", field:"پرداخت کننده حق بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"بیمه گذار", field:"comp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"رشته", field:"رشته", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"مورد بیمه", field:"مورد بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"تاریخ عملیات", field:"تاریخ عملیات", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"شماره بيمه نامه", field:"شماره بيمه نامه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"مبلغ کل حق بیمه", field:"مبلغ کل حق بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"cunsoltant",visible:false, field:"cunsoltant", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"مشاور", field:"cunsoltantName", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list",headerFilterParams:{valuesLookup:true, clearable:true},
                    formatter:function(cell){
                        var selected = cell.getValue()==''?'بدون مشاور':cell.getValue()
                        return selected
                    },
                    cellClick:function(e, cell){
                        var row = cell.getData()
                        if(row['cunsoltant']==''){
                            setConsultant(consultantList[0].nationalCode)
                        }else{
                            setConsultant(row['cunsoltant'])
                        }
                        setAddElement(true)
                        setInsurenceData(row)
                    },
                },
            ],

        })
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

    const GetInssuingCunsoltant = () =>{
        setLoaderAct(true)
        setdfTable(null)
        axios({method:'POST',url:OnRun+'/inssuing/getcunsoltant',data:{cookie:LginKy,showAll:showAll}
        }).then(response=>{
            if(response.data.replay){
                setdfTable(response.data.df)
                setLoaderAct(false)
            }else{
                setMsg(response.data.msg)
                setLoaderAct(false)
            }
        }).catch(error=>{setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
        })     
    }

    const GetConsultantAll = () =>{
        axios({method:'POST',url:OnRun+'/management/getcunsoltant',data:{cookie:LginKy,integration:true}
        }).then(response=>{
            setConsultantList(response.data.df)
            setConsultant(response.data.df[0].nationalCode)
        })
    }

    const AssingCunsoltant = () =>{
        axios({method:'POST',url:OnRun+'/inssuing/assingcunsoltant',data:{cookie:LginKy,InsurenceData:InsurenceData,consultant:consultant}
        }).then(response=>{
            if(response.data.replay){
                setAddElement(false)
                setMsg('ثبت شد')
            }
        })
    }

    useEffect(verificationCookie,[LginKy])
    useEffect(GetInssuingCunsoltant,[consultant,showAll,msg])
    useEffect(GetConsultantAll,[])

    return(
        <div className="PgLine">
            <Loader enable={loaderAct}/>
            <Alarm msg={msg} smsg={setMsg}/>
            <div className="FrmTbl">
            {AddElement?
                    <div className="FormPlus">
                    <div className="FldPlus">
                        <label>
                            <p>بیمه گر</p>
                            <p>{InsurenceData['comp']}</p>
                        </label>
                        <label>
                            <p>پرداخت کننده حق بیمه</p>
                            <p>{InsurenceData['پرداخت کننده حق بیمه']}</p>
                        </label>
                        <label>
                            <p>مورد بیمه</p>
                            <p>{InsurenceData['مورد بیمه']}</p>
                        </label>
                        <label>
                            <p>رشته</p>
                            <p>{InsurenceData['رشته']}</p>
                        </label>
                        <label>
                            <p>کد رایانه صدور بیمه نامه</p>
                            <p>{InsurenceData['کد رایانه صدور بیمه نامه']}</p>
                        </label>
                        <label>
                            <p>مبلغ کل حق بیمه</p>
                            <p>{InsurenceData['مبلغ کل حق بیمه']}</p>
                        </label>
                        <label>
                            <p>تاريخ بيمه نامه يا الحاقيه</p>
                            <p>{InsurenceData['تاريخ بيمه نامه يا الحاقيه']}</p>
                        </label>
                        <label>
                            <p>تاریخ عملیات</p>
                            <p>{InsurenceData['تاریخ عملیات']}</p>
                        </label>
                        <label>
                            <p>مشاور صدور</p>
                            {consultantList==null?null:
                                <select value={consultant} onChange={(e)=>setConsultant(e.target.value)}>
                                    {consultantList.map(i=>{
                                        return(
                                            <option key={i.nationalCode} value={i.nationalCode}>{i.gender + ' '+i.fristName+ ' '+i.lastName}</option>
                                        )
                                    })}
                                </select>
                            }
                        </label>
                    </div>
                    <div className="BtnBx">
                        <button className="AplBtn" onClick={AssingCunsoltant}>ثبت</button>
                        <button className="CnlBtn" onClick={()=>setAddElement(false)}>لغو</button>
                    </div>
                </div>:null}
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
                            <div className="BtnTools" onClick={GetInssuingCunsoltant}>
                                <span><IoRefreshSharp/><p>بارگذاری</p></span>
                            </div>
                            <div className="BtnTools">
                                <span><IoInformationCircleOutline/><p>راهنما</p></span>
                            </div>
                            <div className="BtnTools">
                                <p>نمایش همه</p>
                                <input value={showAll} onChange={()=>setShowAll(!showAll)} type="checkbox"/>
                            </div>
                        </div>
                    </div>
                    <div id="data-table"></div>
                </div>
            </div>
        </div>
    )
}

export default AssingInssuing