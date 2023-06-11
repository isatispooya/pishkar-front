import { useState, useEffect , Fragment} from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../componet/exportPdf"
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {IoRefreshSharp,IoAddCircleOutline,IoInformationCircleOutline} from "react-icons/io5";
import { BsFileEarmarkSpreadsheetFill,BsFillFilePdfFill} from "react-icons/bs"
import { DatePickerToIntFull } from "../componet/Date"
import DatePicker, { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { minMaxFilterEditor, minMaxFilterFunction } from "../componet/headerFilter"
import Del from "../componet/del"

const StandardFee = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [msg, setMsg] = useState('')
    const [AddElement, setAddElement] = useState(false)
    const [StandardFees, setStandardFees] = useState(null)
    const [AllField, setAllField] = useState(null)
    const [GroupField, setGroupField] = useState(null)
    const [GroupFieldSelected, setGroupFieldSelected] = useState({main:null,sub:null})
    const [FieldSelected, setFieldSelected] = useState(null)
    const [RateField, setRateField] = useState(0)
    const [years, setYears] = useState(1)
    const [DateField, setDateField] = useState(0)
    const [dataDel ,setDataDel] = useState(false)


    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    if(StandardFees!=null){
        var table = new Tabulator("#data-table", {
            data:StandardFees,
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
                {title:"گروه رشته", field:"groupMain", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"گروه مورد", field:"groupSub", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"عنوان بیمه نامه", field:"field", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"نرخ کارمزد ثابت", field:"rate", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false,formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"سال", field:"years", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false,formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"تاریخ اعمال", field:"dateshow", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"تاریخ", visible:false, field:"date", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setDataDel({data:[data['field'],data['dateshow']],msg:'ایا از حذف "'+data['field']+'" مطمعن هستید؟'})

                        },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">حذف</div>'}
                },
            {title:"ویرایش", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                cellClick:function(e, cell){
                    let row = cell.getRow();
                    let data = row.getData();
                    let date = new DateObject()
                    let state = new Date(data['date'])
                    setAddElement(true)
                    setFieldSelected(data['field'])
                    setRateField(data['rate'])
                    setDateField({Show:data['dateshow'],date:state})
                    },
                formatter:function(e,cell){return '<div className="TblBtnDynEdt">ویرایش</div>'}
            },
            ]
        })
    }

    const handleDate = (date) =>{
        setDateField({Show:DatePickerToIntFull(date),date:date})
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

    const handleGetAllStandardFee = () =>{
        axios({method:'POST',url:OnRun+'/standardfees/get',data:{cookie:LginKy}
        }).then(response=>{
            setStandardFees(response.data.df)
        })
    }

    const handleGetAllField = () =>{
        axios({method:'POST',url:OnRun+'/standardfees/getField',data:{cookie:LginKy}
        }).then(response=>{
            setAllField(response.data.Field)
            setFieldSelected(response.data.Field[0])
            setGroupField(response.data.GroupField)
            setGroupFieldSelected({main:Object.keys(response.data.GroupField)[0],sub:response.data.GroupField[Object.keys(response.data.GroupField)[0]][0]})
        })
    }

    const AddField = () =>{
        if(FieldSelected==null){setMsg('لطفا رشته مورد را انتخاب کنید')
        }else if(DateField==0){setMsg('لطفا تاریخ اعمال را وارد کنید')
        }else{

        axios({method:'POST',url:OnRun+'/standardfees/addfield',data:{cookie:LginKy, field:FieldSelected, rate:RateField, date:DateField, GroupFieldSelected:GroupFieldSelected, years:years}
            }).then(response=>{
                if(response.data.replay){
                    setMsg('ثبت شد')
                }
            })
        }
    }

    const delField = (date) =>{
        axios({method:'POST',url:OnRun+'/standardfees/delfield',data:{cookie:LginKy,field:date[0],date:date[1]}
        }).then(response=>{
            if(response.data.replay){
                setMsg('حذف شد')
            }
        })
    }
    useEffect(verificationCookie,[LginKy])
    useEffect(handleGetAllStandardFee,[msg])
    useEffect(handleGetAllField,[])
    useEffect(()=>{
        setYears(1)
        setRateField(0)
    },[GroupFieldSelected.sub])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Del dataDel={dataDel} setDataDel={setDataDel} fnc={delField}/>
            <div className="FrmTbl">
            {AddElement?
                <div className="FormPlus">
                    <div className="FldPlus">
                        <label>
                            <p>رشته، مورد</p>
                            {AllField==null?null:
                                <Fragment>
                                    <input list="browsers" value={FieldSelected} onChange={(e)=>setFieldSelected(e.target.value)}/>
                                    <datalist id="browsers">
                                        {
                                            AllField.map(i=>{
                                                return(
                                                    <option key={i} value={i}>{i}</option>
                                                )
                                            })
                                        }
                                    </datalist>
                                </Fragment>

                            }
                        </label>
                        <label>
                            <p>تاریخ اعمال</p>
                            <DatePicker inputClass="InpBsc" portal calendar={persian} locale={persian_fa} value={DateField.date} onChange={handleDate} />
                        </label>
                        <label>
                            <p>گروه رشته</p>
                            <select value={GroupFieldSelected.main} onChange={(e)=>setGroupFieldSelected({...GroupFieldSelected,main:e.target.value,sub:GroupField[e.target.value][0]})}>
                                {
                                    GroupField==null?null:
                                    Object.keys(GroupField).map((key, index)=>{
                                        return(
                                            <option key={index} value={key}>{key}</option>
                                        )
                                    })
                                }
                            </select>
                        </label>
                        <label>
                            <p>گروه مورد</p>
                            <select value={GroupFieldSelected.sub} onChange={(e)=>setGroupFieldSelected({...GroupFieldSelected,sub:e.target.value})}>
                                {
                                    GroupField==null?null:
                                    GroupField[GroupFieldSelected.main].map(i=>{
                                        return(
                                            <option key={i} value={i}>{i}</option>
                                        )
                                    })
                                }
                            </select>
                        </label>
                        {
                            GroupFieldSelected.main=='بیمه زندگی'?
                                    <label>

                                        <div className="inpMrg">
                                            <p>کارمزد ثابت</p>
                                            <input value={RateField} onChange={(e)=>setRateField(e.target.value)}/>
                                        </div>
                                        <div className="inpMrg">
                                            <p>سال</p>
                                            <input value={years} onChange={(e)=>setYears(e.target.value)}/>
                                        </div>
                                    </label>
                                :
                                <label>
                                    <p>کارمزد ثابت</p>
                                    <input value={RateField} onChange={(e)=>setRateField(e.target.value)}/>
                                </label>
                        }
                    </div>
                    <div className="BtnBx">
                        <button className="AplBtn" onClick={AddField}>تایید</button>
                        <button className="CnlBtn" onClick={()=>setAddElement(false)}>لغو</button>
                    </div>
                </div>
            :null}
            <div className="TblPlus">
                <div className="TblTools">
                    <div className="LeftTls">
                        <div className="BtnTools TlsDwnld" onClick={()=>{table.download("xlsx", "data.xlsx")}}>
                            <span><BsFileEarmarkSpreadsheetFill/></span>
                            <span>خروجی اکسل</span>
                        </div>
                        <div className="BtnTools TlsDwnld" onClick={exportPdf}>
                            <span><BsFillFilePdfFill/></span>
                            <span>خروجی پی دی اف</span>
                        </div>
                    </div>
                    <div className="RightTls">
                        <div className="BtnTools" onClick={handleGetAllStandardFee}>
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

export default StandardFee