import { useState, useEffect } from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../componet/exportPdf"
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {IoRefreshSharp,IoAddCircleOutline,IoInformationCircleOutline} from "react-icons/io5";
import { BsFileEarmarkSpreadsheetFill,BsFillFilePdfFill, BsPlusCircle, BsDashCircle} from "react-icons/bs"


const Integration = () =>{
    
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [IntergationDf, setIntergationDf] = useState(null)
    const [AddElement, setAddElement] = useState(false)
    const [consultantList, setConsultantList] = useState(null)
    const [ConsultantSelected, setConsultantSelected] = useState(null)
    const [nameIntegration, setNameIntegration] = useState('')


    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    const delIntegration = (code) =>{
        axios({method:'POST',url:OnRun+'/consultant/delintegration',data:{cookie:LginKy,code:code}
        }).then(response=>{
            if(response.data.replay){
                setMsg('حذف شد')
            }else{
                setMsg(response.data.msg)
            }
        })
    }

    if(IntergationDf!=null){
        var table = new Tabulator("#data-table", {
            data:IntergationDf,
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
                {title:"گروه", field:"gender", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"نوع", field:"fristName", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"نام", field:"lastName", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"تعداد", field:"count", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"جزئیات", field:"ditaile", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:6,headerFilter:"input"},
                {title:"nationalCode",visible:false, field:"nationalCode", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                cellClick:function(e, cell){
                    let row = cell.getRow();
                    let data = row.getData();
                    delIntegration(data)
                },
                formatter:function(e,cell){
                    return '<div className="TblBtnDynEdt">حذف</div>'
                }
            },  
            ]
        })
    }

    const AddIntegration = () =>{
        var SumFee = ConsultantSelected.map(i=>{return(i.fee)}).reduce((partialSum, a) => partialSum + a, 0)
        if(SumFee>100){setMsg('مجموع کارمزد میبایست برابر 100 دردصد باشد')
        }else if(SumFee<100){setMsg('مجموع کارمزد میبایست برابر 100 دردصد باشد')
        }else if(nameIntegration==''){setMsg('نام گروه تلفیق را کامل کنید')
        }else{
            axios({method:'POST',url:OnRun+'/consultant/addintegration',data:{cookie:LginKy,name:nameIntegration,ConsultantSelected:ConsultantSelected}
            }).then(response=>{
                if(response.data.replay){
                    setMsg('ثبت شد')
                    setAddElement(false)
                }else{
                    setMsg(response.data.msg)
                }
            })
        }
    }

    const GetIntegration = () =>{
        axios({method:'POST',url:OnRun+'/consultant/getintegration',data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setIntergationDf(response.data.df)
            }else{
                setMsg(response.data.msg)
            }
        })
    }

    const ChangeConsultant = (er,j)=>{
        var duplicat = ConsultantSelected.map(i=>{return(i.code)}).find(element => element == er)==undefined
        if(duplicat){
            var newValue = ConsultantSelected.map(i=>{
                if(i==j){
                    return {code:er, fee:0}
                }else{
                    return i
                }
            })
            setConsultantSelected(newValue)
        }else{
            setMsg('مشاوران انتخابی میبایست غیر تکراری باشند')
        }
    }

    const ChangeFee = (er,j)=>{
        var newValue = ConsultantSelected.map(i=>{
            if(Math.floor(er)<100){
                if(i.code==j){
                    return {code:j, fee:Math.floor(er)}
                }else{
                    return i
                } 
            }else{
                setMsg('حداکثر کارمزد برای یک مشاور میبایست کمتر از 100 دردصد باشد')
            }
        })
        setConsultantSelected(newValue)
    }


    const GetConsultantAll = () =>{
        axios({method:'POST',url:OnRun+'/management/getcunsoltant',data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setConsultantList(response.data.df)
                if(response.data.df.length>1){
                    if(ConsultantSelected==null){
                        setConsultantSelected([{code:response.data.df[0].nationalCode, fee:0},{code:response.data.df[1].nationalCode , fee:0}])
                    }
                }else{
                    setMsg('تعداد مشاوران برای تلفیق میبایست بیش از یک نفر باشد')
                }

            }else{
                setMsg(response.data.msg)
            }
        })
    }

    const AddConsultant = () =>{
        if(ConsultantSelected.length<consultantList.length){
            setConsultantSelected([...ConsultantSelected,{code:consultantList[ConsultantSelected.length].nationalCode, fee:0}])
        }else{
            setMsg('محدودیدت حداکثر تعداد مشاور')
        }
    }

    const DropConsultant = () =>{
        if(ConsultantSelected.length>2){
            setConsultantSelected(ConsultantSelected.slice(0, -1))
        }else{
            setMsg('برای ایجاد گروه تلفیق میبایست حداقل دو مشاور انتخاب شوند')
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

    useEffect(verificationCookie,[LginKy])
    useEffect(GetConsultantAll,[])
    useEffect(GetIntegration,[msg])

    return(
        <div className="PgLine"> 
            <Alarm msg={msg} smsg={setMsg}/>
            <div className="FrmTbl">
                {AddElement?
                <div className="FormPlus">
                    <div className="FldPlus">
                        <label>
                            <p>نام گروه تلفیقی</p>
                            <input value={nameIntegration} onChange={(e)=>setNameIntegration(e.target.value)} />
                        </label>
                        {
                            ConsultantSelected==null?null:consultantList==null?null:
                            ConsultantSelected.map(i=>{
                                return(
                                    <label key={i.code}>
                                        <p>مشاور</p>
                                        <select value={i.code} onChange={(e)=>ChangeConsultant(e.target.value,i)}>
                                            {
                                                consultantList.map(j=>{
                                                    return(
                                                        <option key={j.nationalCode} value={j.nationalCode}>{String(j.fristName) +' '+ String(j.lastName)}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <p>سهم کارمزد</p>
                                        <input value={i.fee} onChange={(e)=>ChangeFee(e.target.value, i.code)}/>
                                    </label>
                                )
                            })
                        }
                        <label className="Add-Field">
                            <div onClick={AddConsultant}>
                                <span><BsPlusCircle /></span>
                                <p>افزودن مشاور</p>
                            </div>
                            <div onClick={DropConsultant}>
                                <span><BsDashCircle /></span>
                                <p>کاهش مشاور</p>
                            </div>
                        </label>
                    </div>
                    <div className="BtnBx">
                        <button className="AplBtn" onClick={AddIntegration}>تایید</button>
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
                            <div className="BtnTools" onClick={GetIntegration}>
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

export default Integration