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



const ReportRevivalAll = (props) =>{

    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})

    const [type, setType] = useState(props.type)
    const [df, setDf] = useState(null)

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
                {title:"پرداخت کننده حق بیمه", field:"پرداخت کننده حق بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"رشته", field:"رشته", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"تاريخ پایان", field:"تاريخ پایان", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input"},                
                {title:"مدت زمان", field:"مدت زمان", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input"},                
                {title:"کد رایانه صدور بیمه نامه", field:"کد رایانه صدور بیمه نامه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input"},
                {title:"نتیجه", field:"RevivalResponse", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input"},
            ],
        })
    }


    
    const GetDf = () =>{
        axios({method:'POST',url:OnRun+'/issuing/revivalall',data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setDf(response.data.df)
                console.log(response.data.df)
            }else{
                setDf(null)
                setMsg(response.data.msg)
            }
        })
    }

    const verificationCookie = () =>{
        axios({method:'POST',url:OnRun+'/sing/cookie',data:{cookie:LginKy}
        }).then(response=>{if(!response.data.replay){
            setCookie('LginKy','',0)
            native('/')
        }else{            setUser(response.data.user)
        }
        }).catch(error=>{setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
    })        }




    useEffect(verificationCookie,[LginKy])
    useEffect(GetDf,[])

    return(
        <div className="PgLine">
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
                            <div className="BtnTools" onClick={GetDf}>
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


export default ReportRevivalAll