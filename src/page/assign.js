import { useState, useEffect , useContext} from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../componet/exportPdf"
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import Loader from "../componet/Loader"
import SetConsultant from "../componet/setConsultant"
import {IoRefreshSharp,IoInformationCircleOutline} from "react-icons/io5";
import { BsFileEarmarkSpreadsheetFill,BsFillFilePdfFill} from "react-icons/bs"
import DateP from "../componet/context"

const Assing = () =>{
    const datePeriod = useContext(DateP)
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [loaderAct, setLoaderAct] = useState(true)
    const [consultant, setConsultant] = useState(null)
    const [consultantCode, setConsultantCode] = useState(null)
    const [showAll, setShowAll] = useState(false)
    const [dfTable, setdfTable] = useState(null)
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})

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
                {title:"رشته", field:"رشته", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"مورد بیمه", field:"مورد بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"بيمه گذار", field:"بيمه گذار", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:8,headerFilter:"input"},
                {title:"کد رایانه صدور", field:"کد رایانه صدور", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"شماره بيمه", field:"شماره بيمه نامه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"تاریخ صدور بیمه نامه", field:"تاریخ صدور بیمه نامه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"مشاور واحد صدور", field:"issuing", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list",headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"بیمه گر", field:"comp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"list",headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"مشاور", field:"consultant", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list",headerFilterParams:{valuesLookup:true, clearable:true},
                    formatter:function(cell){
                        var selected = cell.getValue()==''?'بدون مشاور':cell.getValue()
                        return selected
                    },
                    cellClick:function(e, cell){setConsultantCode(cell.getData()['شماره بيمه نامه'])},
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

    const GetAllInsurance = () =>{
        setLoaderAct(true)
        setdfTable(null)
        axios({method:'POST',url:OnRun+'/assing/get',data:{cookie:LginKy, showAll:showAll, datePeriod:datePeriod}
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

    const GetAllInsuranceNoLoader = () =>{

        setdfTable(null)
        axios({method:'POST',url:OnRun+'/assing/get',data:{cookie:LginKy,showAll:showAll,datePeriod:datePeriod}
        }).then(response=>{
            if(response.data.replay){
                setdfTable(response.data.df)
            }else{
                setMsg(response.data.msg)
            }
        }).catch(error=>{setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
        })     
    }

    const GetConsultantAll = () =>{
        axios({method:'POST',url:OnRun+'/management/getcunsoltant',data:{cookie:LginKy,integration:true}
        }).then(response=>{
            var data = response.data
            setConsultant(data)
        })
    }

    
    useEffect(verificationCookie,[LginKy])
    useEffect(GetConsultantAll,[])
    useEffect(GetAllInsurance,[showAll])
    useEffect(GetAllInsuranceNoLoader,[consultant,consultantCode])


    return(
        <div className="PgLine">
            <Loader enable={loaderAct}/>
            <Alarm msg={msg} smsg={setMsg}/>
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
                        <div className="BtnTools" onClick={GetAllInsurance}>
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
            <SetConsultant code={consultantCode} setcode={setConsultantCode} LginKy={LginKy} consultant={consultant} GetAllInsurance={GetAllInsurance}/>
        </div>
    )
}

export default Assing