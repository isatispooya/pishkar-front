import { useState, useEffect , useContext } from "react"
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
import {ImTable} from "react-icons/im";
import Loader from "../../componet/Loader"
import { VscGroupByRefType } from "react-icons/vsc";
import DateP from "../../componet/context"


const LifeRevivalYear = (props) =>{

    const datePeriod = useContext(DateP)
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [consultantList, setConsultantList] = useState(null)
    const [consultant, setConsultant] = useState(null)
    const [df, setDf] = useState(null)
    const [AddElement, setAddElement] = useState(false)
    const [AddElementGroup, setAddElementGroup] = useState(false)
    const [RevivalFilter, setRevivalFilter] = useState('در انتظار')
    const [Status, setStatus] = useState('جاری')
    const [loaderAct, setLoaderAct] = useState(false)
    const [insurer , setInsurer] = useState(null)
    const [tableSelect , setTableSelect] = useState([])
    const [Comp , setComp] = useState('')
    const [Date, setDate] = useState(null)

    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    const getInsurer = () =>{
        axios({method:'POST',url:OnRun+'/feesreports/getinsurername', data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setInsurer(response.data.insurer)
                setComp(response.data.insurer[0])
            }else{
                setMsg(response.data.msg)
            }
        })
    }


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
            selectable:true,
            columns:[
                {title:"شماره بيمه نامه", field:"شماره بيمه نامه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input"},
                {title:"مشاور", field:"consultant", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"نام بیمه گذار", field:"نام بیمه گذار", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"تلفن همراه", field:"تلفن همراه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"بيمه گر", field:"comp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input"},
                {title:"حق بیمه", field:"حق بیمه هر قسط \n(جمع عمر و پوششها)", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"روش پرداخت", field:"روش پرداخت", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"دوره", field:"period", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"تاريخ شروع", field:"تاريخ شروع", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"طرح", field:"طرح", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
            ],
        })
    }


    const GroupAction = () =>{
            setTableSelect(table.getSelectedData())
            if(table.getSelectedData().length>0){
                setAddElementGroup(true)
            }else{
                setMsg('هیچ موردی انتخاب نشده')
            }
    }




    


    const GetDf = () =>{
        if(consultant!=null){
            setLoaderAct(true)
            axios({method:'POST',url:OnRun+'/systemmassage/liferevivalyear',data:{cookie:LginKy ,consultant:consultant,RevivalFilter:RevivalFilter,Comp:Comp,Date:datePeriod}
            }).then(response=>{
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
        }else{            setUser(response.data.user)
        }
        }).catch(error=>{setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
    })        }

    const GetConsultantAll = () =>{
        axios({method:'POST',url:OnRun+'/management/getcunsoltantandall',data:{cookie:LginKy}
        }).then(response=>{
            setConsultantList(response.data.df)
            setConsultant(response.data.df[response.data.df.length-1].nationalCode)
        })    }




    useEffect(GetConsultantAll,[])
    useEffect(verificationCookie,[LginKy])
    useEffect(getInsurer , [])

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
                            <div className="BtnTools" onClick={GetDf}>
                                <span><ImTable/><p>گزارش</p></span>
                            </div>
                            <div className="BtnTools">
                                <span><IoInformationCircleOutline/><p>راهنما</p></span>
                            </div>
                            {
                                df==null?null:
                                <div className="BtnTools" onClick={GroupAction}>
                                    <span><VscGroupByRefType/><p>عملیات گروهی</p></span>
                                </div>
                            
                            }
                            <div className="BtnTools">
                                <p>مشاور</p>
                                {consultantList==null?null:
                                    <select value={consultant} onChange={(e)=>setConsultant(e.target.value)}>
                                        {consultantList.map(i=>{
                                            return(
                                                <option key={i.nationalCode} value={i.nationalCode}>{i.gender + ' '+i.fristName+ ' '+i.lastName}</option>
                                            )                                        })}
                                    </select>                                }
                                <p>شرکت بیمه</p>
                                {insurer==null?null:
                                        <select value={Comp} onChange={(e)=>setComp(e.target.value)}>
                                            {insurer.map(i=>{
                                                return(
                                                    <option key={i}>{i}</option>
                                                )
                                            })}
                                            <option key="all">همه</option>
                                        </select>
                                }
                                
                            </div>
                            <div className="BtnTools">
                                <p>تمدید</p>
                                    <select value={RevivalFilter} onChange={(e)=>setRevivalFilter(e.target.value)}>
                                        <option value='در انتظار'>در انتظار</option>
                                        <option value='چک دریافت شد'>چک دریافت شد</option>
                                        <option value='چک ثبت شد'>چک ثبت شد</option>
                                        <option value='واریز به حساب'>واریز به حساب</option>
                                        <option value='واریز به بیمه گر'>واریز به بیمه گر</option>
                                        <option value='تمدید شد'>تمدید شد</option>
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


export default LifeRevivalYear