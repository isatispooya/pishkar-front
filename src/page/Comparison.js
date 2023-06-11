import { useState, useEffect ,useContext} from "react"
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
import DateP from "../componet/context"

const Comparison = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [loaderAct, setLoaderAct] = useState(true)
    const [dfTable, setdfTable] = useState(null)
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [OnBase, setOnBase] = useState('group')
    const datePeriod = useContext(DateP)

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
            dataTree:true,
            dataTreeStartExpanded:false,
            columns:[
                {title:"بیمه گر", field:"comp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list",headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"بيمه گذار", field:"بيمه گذار", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list",headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"گروه رشته", field:"groupMain", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list",headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"گروه مورد", field:"groupSub", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list",headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"عنوان بیمه نامه", field:"Title", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list",headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"نرخ کارمزد مورد انتظار", field:"rate", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"میانگین نرخ کارمزد", field:"RealFeeRate", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"اختلاف", field:"OutLine", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
            ],
            pagination:"local",
            paginationSize:25,
            paginationSizeSelector:[10, 25, 50, 100, 200],
            movableColumns:true,
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


    const getComparison = () =>{
        setLoaderAct(true)
        axios({method:'POST',url:OnRun+'/report/comparisom',data:{cookie:LginKy,datePeriod:datePeriod,OnBase:OnBase}
        }).then(response=>{
            if(response.data.replay){
                console.log(response.data.df)
                setdfTable(response.data.df)
            }else{
                setMsg(response.data.msg)
            }
            setLoaderAct(false)
        })
    }


    useEffect(verificationCookie,[LginKy])
    useEffect(getComparison,[datePeriod,OnBase])

    return(
        <div className="PgLine">
            <Loader enable={loaderAct}/>
            <Alarm msg={msg} smsg={setMsg}/>
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
                            <div className="BtnTools" onClick={getComparison}>
                                <span><IoRefreshSharp/><p>بارگذاری</p></span>
                            </div>
                            <div className="BtnTools">
                                <span><IoInformationCircleOutline/><p>راهنما</p></span>
                            </div>
                            <div className="BtnTools">
                                <p>مبنا</p>
                                <select value={OnBase} onChange={(e)=>setOnBase(e.target.value)}>
                                    <option value={'Group'}>گروه های اسناندارد</option>
                                    <option value={'Title'}>عنوان بیمه نامه</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div id="data-table"></div>
                </div>
            </div>
        </div>

    )
}

export default Comparison