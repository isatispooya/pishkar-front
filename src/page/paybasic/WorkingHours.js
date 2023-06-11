import { useState, useEffect } from "react"
import { OnRun } from "../../config/config"
import axios from "axios"
import Alarm from "../../componet/Alarm"
import { setCookie , getCookie} from "../../componet/cookie"
import { useNavigate } from 'react-router-dom'
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../../componet/exportPdf"
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {IoRefreshSharp,IoAddCircleOutline,IoInformationCircleOutline} from "react-icons/io5";
import { BsFileEarmarkSpreadsheetFill,BsFillFilePdfFill} from "react-icons/bs"
import { DatePickerToInt } from "../../componet/Date"
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import Del from "../../componet/del"


const WorkingHours = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [msg, setMsg] = useState('')
    const [AddElement, setAddElement] = useState(false)
    const [Hours, setHours] = useState(null)
    const [Period,setPeriod] = useState({Show:'',date:''})
    const [df, setDf] = useState(null)
    const [dataDel ,setDataDel] = useState(false)

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
                {title:"دوره", field:"Period", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"ساعات کارکرد قانونی", field:"hours", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:5,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"date", field:"date",visible:false, hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:5,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setDataDel({data:{Show:data['Period'],date:data['date']},msg:'ایا از حذف "'+data['Period']+'" مطمعن هستید؟'})
                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">حذف</div>'}
                },
                {title:"ویرایش", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setAddElement(true)
                        setHours(data['hours'])
                        setPeriod({Show:data['Period'],date:data['date']})

                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">ویرایش</div>'}
                },
            ]
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
        setAddElement(false)
        }).catch(error=>{setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
    })        }


    const add = () =>{
        if(Hours==''){setMsg('ساعت کارکرد را وارد کنید')
        }else if(Period.Show==''){setMsg('دوره را وارد کنید')
        }else{
            axios({method:'POST',url:OnRun+'/management/workinghour',data:{cookie:LginKy,Hours:Hours,Period:Period}
            }).then(response=>{
                if(response.data.replay){
                    setMsg('ثبت شد')
                    get()
                }else{setMsg(response.data.msg)}
            })
        }
    }

    const get = () =>{
        axios({method:'POST',url:OnRun+'/management/getworkinghour',data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setDf(response.data.df)
            }
        })
    }
    
    const del = (date) =>{
        axios({method:'POST',url:OnRun+'/management/delworkinghour',data:{cookie:LginKy,date:date}
            }).then(response=>{
                if(response.data.replay){setMsg('حذف شد')
                }else{setMsg(response.data.msg)}
            })
    }


    const handleDate = (date) =>{
        setPeriod({Show:DatePickerToInt(date),date:date})
    }


    useEffect(verificationCookie,[LginKy])
    useEffect(get,[msg])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Del dataDel={dataDel} setDataDel={setDataDel} fnc={del}/>

            <div className="FrmTbl">
            {AddElement?
                <div className="FormPlus">
                    <div className="FldPlus clander">
                        <label>
                            <p>دوره</p>
                            {<DatePicker inputClass="InpBsc" onlyMonthPicker calendar={persian} locale={persian_fa} value={Period.date} onChange={handleDate} />}
                        </label>
                        <label>
                            <p>ساعت کارکرد قانونی</p>
                            <input step='1' type='number' value={Hours} onChange={(e)=>setHours(e.target.value)}/>
                        </label>
                    </div>
                    <div className="BtnBx">
                        <button className="AplBtn" onClick={add}>تایید</button>
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
                            <div className="BtnTools" onClick={get}>
                                <span><IoRefreshSharp/><p>بارگذاری</p></span>
                            </div>
                            <div className="BtnTools">
                                <span><IoInformationCircleOutline/><p>راهنما</p></span>
                            </div>
                            <div className="BtnTools" onClick={()=>setAddElement(!AddElement)}>
                                <span><IoAddCircleOutline/><p>افزودن</p></span>                                
                            </div>
                        </div>
                    </div>
                    <div id="data-table"></div>
                </div>
            </div>
        </div>
    )
}


export default WorkingHours