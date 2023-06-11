import { useState, useEffect ,useContext} from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../componet/exportPdf"
import DateP from "../componet/context"
import {IoRefreshSharp,IoInformationCircleOutline} from "react-icons/io5";
import { BsFileEarmarkSpreadsheetFill,BsFillFilePdfFill} from "react-icons/bs"
import Loader from "../componet/Loader"

const Perforator  = (props) =>{
    const datePeriod = useContext(DateP)
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [loaderAct, setLoaderAct] = useState(true)
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [consultantList, setConsultantList] = useState(null)
    const [consultant, setConsultant] = useState(null)
    const [perforatorDf, setPerforatorDf] = useState(null)

    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');
    
    if(perforatorDf!=null){
        var table = new Tabulator("#data-table", {
            data: perforatorDf,
            layout:"fitColumns",
            responsiveLayout:true,
            columnHeaderSortMulti:true,
            pagination:"local",
            paginationSize:25,
            paginationSizeSelector:[5, 10, 25, 50, 100, 200,500,1000],
            movableColumns:true,
            layoutColumnsOnNewData:false,
            textDirection:"rtl",
            autoResize:false,
            columns:[
                {title:"بيمه گذار", field:"بيمه گذار", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"شماره بيمه نامه", field:"شماره بيمه نامه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"بیمه گر", field:"comp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"list",headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"رشته", field:"رشته", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"تاریخ صدور بیمه نامه", field:"تاریخ صدور بیمه نامه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"کارمزد", field:"fee", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:8,headerFilter:"input",bottomCalc:'sum',bottomCalcFormatter:function(cell){return(cell.getValue().toLocaleString())},formatter:function(cell){return(cell.getValue().toLocaleString())}},
            ],
            pagination:"local",
            paginationSize:25,
            paginationSizeSelector:[10, 25, 50, 100, 200,500,1000],
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

    const GetConsultantAll = () =>{
        axios({method:'POST',url:OnRun+'/management/getcunsoltant',data:{cookie:LginKy}
        }).then(response=>{
            setConsultantList(response.data.df)
            setConsultant(response.data.df[0].nationalCode)
        })    }

    const getPerforator = () =>{
        setLoaderAct(true)
        if(consultant!=null && datePeriod!=''){
            axios({method:'POST',url:OnRun+'/pay/perforator',data:{cookie:LginKy,nationalCode:consultant,date:datePeriod}
            }).then(response=>{
                if(response.data.replay){
                    setPerforatorDf(response.data.df)
                }else{
                    setMsg(response.data.msg)
                }
                setLoaderAct(false)

            })
        }
    }
    
    useEffect(GetConsultantAll,[])
    useEffect(verificationCookie,[LginKy])
    useEffect(getPerforator,[consultant,datePeriod])

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
                            <div className="BtnTools" onClick={getPerforator}>
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
                        </div>
                    </div>
                    <div id="data-table"></div>
                </div>
            </div>
        </div>
    )
}

export default Perforator