import { useState, useEffect ,useContext} from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../componet/exportPdf"
import Loader from "../componet/Loader"
import DateP from "../componet/context"
import {IoRefreshSharp,IoAddCircleOutline,IoInformationCircleOutline} from "react-icons/io5";
import { BsFileEarmarkSpreadsheetFill,BsFillFilePdfFill} from "react-icons/bs"
import { headerMenu, handleGSC } from "../componet/headermenu"

const MonthlySalaryReportSummary = () =>{
    const datePeriod = useContext(DateP)
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [Pay , setPay] = useState(null)
    const [loaderAct, setLoaderAct] = useState(false)


    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');


    if(Pay!=null){
        var listColumns = ['reward','insuranceEmployer','insuranceWorker','freeTaxe','taxe','inTax',
            'childern','eydi','homing','subsidy','base','sanavat','sanavatDaily','baseDaily','act',
            'nationalCode','fullName','paybeforTax','SubReward','afterPay','PayBalance','benefit']
        var columnsTable=[
                {title:"نام",visible:handleGSC('نام'), field:"fullName", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:5,headerFilter:"input",headerMenu: headerMenu},
                {title:"کارکرد",visible:handleGSC('کارکرد'), field:"act", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",formatter:function(cell){return(cell.getValue().toLocaleString())}},
                {title:"پایه",visible:handleGSC('پایه'), field:"base", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},headerMenu: headerMenu},
                {title:"بن خواربار",visible:handleGSC('بن خواربار'), field:"subsidy", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},headerMenu: headerMenu},
                {title:"مسکن",visible:handleGSC('مسکن'), field:"homing", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},headerMenu: headerMenu},
                {title:"عیدی",visible:handleGSC('عیدی'), field:"eydi", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list",bottomCalc:'sum',headerFilterParams:{valuesLookup:true, clearable:true},formatter:function(cell){return(cell.getValue().toLocaleString())},headerMenu: headerMenu},
                {title:"حق اولاد",visible:handleGSC('حق اولاد'), field:"childern", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},headerMenu: headerMenu},
                {title:"سایر مزایایی غیر نقدی",visible:handleGSC('سایر مزایایی غیر نقدی'), field:"benefit", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:5,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},headerMenu: headerMenu},
                {title:"قابل پرداخت قبل از کسورات",visible:handleGSC('قابل پرداخت قبل از مالیات'), field:"paybeforTax", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},headerMenu: headerMenu},
                {title:"مالیات",visible:handleGSC('مالیات'), field:"taxe", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},headerMenu: headerMenu},
                {title:"حق بیمه پرسنل",visible:handleGSC('حق بیمه پرسنل'), field:"insuranceWorker", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},headerMenu: headerMenu},
                {title:"قابل پرداخت",visible:handleGSC('قابل پرداخت'), field:"afterPay", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:5,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},headerMenu: headerMenu},
                {title:"قابل پرداخت شعب",visible:handleGSC('قابل پرداخت شعب'), field:"PayBalance", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:5,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},headerMenu: headerMenu},
                {title:"کارمزد اصلی",visible:handleGSC('کارمزد اصلی'), field:"reward", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:5,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},headerMenu: headerMenu},
                {title:"کارمزد فرعی",visible:handleGSC('کارمزد فرعی'), field:"SubReward", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:5,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},headerMenu: headerMenu},
                
            ]
        for(var i in Pay[0]){
            if(!listColumns.includes(i)){
                columnsTable.unshift({title:i,visible:handleGSC(i), field:i, hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:5,headerFilter:"input",bottomCalc:'sum',formatter:function(cell){return(cell.getValue().toLocaleString())},headerMenu: headerMenu},)
            }
        }
        var table = new Tabulator("#data-table", {
            data:Pay,
            columns:columnsTable,
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



    const getPay = () =>{
        setPay(null)
        if(datePeriod!=''){
            setLoaderAct(true)
            axios({method:'POST',url:OnRun+'/pay/get',data:{cookie:LginKy,period:datePeriod}
            }).then(response=>{
                if(response.data.replay){
                    setPay(response.data.pay)
                }else{
                    setPay(null)
                    setMsg(response.data.msg)
                }
                setLoaderAct(false)

            })
        }
    }
    useEffect(verificationCookie,[LginKy])
    useEffect(getPay,[datePeriod])

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
                            <div className="BtnTools" onClick={getPay}>
                                <span><IoRefreshSharp/><p>بارگذاری</p></span>
                            </div>
                            <div className="BtnTools">
                                <span><IoInformationCircleOutline/><p>راهنما</p></span>
                            </div>
                        </div>
                    </div>
                    <div id="data-table"></div>
                </div>
            </div>
        </div>
    )
}
export default MonthlySalaryReportSummary