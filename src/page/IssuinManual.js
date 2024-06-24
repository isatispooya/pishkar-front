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
import { BsFileEarmarkSpreadsheetFill,BsFillFilePdfFill} from "react-icons/bs"
import Loader from "../componet/Loader"
import Del from "../componet/del"

const IssuinManual = () =>{

    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [insurer , setInsurer] = useState(null)
    const [Dfissuing , setDfissuing] = useState(null)
    const [AddElement, setAddElement] = useState(false)
    const [IssuingDict, setIssuingDict] = useState({'_id':'','رشته':'','کد رایانه صدور بیمه نامه':'','تاريخ پایان':'','مورد بیمه':'','پرداخت کننده حق بیمه':'','شماره بيمه نامه':'','تاريخ بيمه نامه يا الحاقيه':'','تاریخ عملیات':'','تاریخ سررسید':'','مبلغ کل حق بیمه':'','مبلغ تسویه شده':'','بدهی باقی مانده':'','comp':'','additional':'اصلی'})
    const [edit, setEdit] = useState('add')
    const [loaderAct, setLoaderAct] = useState(false)
    const [dataDel ,setDataDel] = useState(false)
    window.XLSX = XLSX;
    
    if(Dfissuing!=null){
        var table = new Tabulator("#data-table", {
            data:Dfissuing,
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
                {title:"id", field:"_id",visible:false, hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"پرداخت کننده", field:"پرداخت کننده حق بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"رشته", field:"رشته", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"مورد بیمه", field:"مورد بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"بیمه گر", field:"comp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"تاريخ بيمه نامه", field:"تاريخ بيمه نامه يا الحاقيه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"تاريخ پایان",visible:true, field:"تاريخ پایان", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"مدت زمان", field:"مدت زمان", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"کد رایانه صدور", field:"کد رایانه صدور بیمه نامه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"شماره بيمه نامه", field:"شماره بيمه نامه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"مبلغ کل حق بیمه", field:"مبلغ کل حق بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"تاریخ عملیات", field:"تاریخ عملیات", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"تاریخ سررسید", field:"تاریخ سررسید", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"نوع", field:"additional", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setDataDel({data:data,msg:'ایا از حذف "'+data['پرداخت کننده'] +' '+data['comp'] +'" مطمعن هستید؟'})

                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">حذف</div>'}
                }, 
                {title:"ویرایش", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        EdtIssuing(data)
                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">ویرایش</div>'}
                },
            ],

        })
    }

    const getInsurer = () =>{
        axios({method:'POST',url:OnRun+'/feesreports/getinsurername', data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setInsurer(response.data.insurer)
                setIssuingDict({...IssuingDict,comp:response.data.insurer[0]})
            }else{
                setMsg(response.data.msg)
            }
        })
    }


    const delIssuing = (data) =>{
        axios({method:'POST',url:OnRun+'/issuing/delissuingmanual',data:{cookie:LginKy,dict:data}
        }).then(response=>{
            if(response.data.replay){
                setMsg('حذف شد')
                GetDfIssuingManual()
            }else{
                setMsg(response.data.msg)
            }
        })
    }

    const EdtIssuing = (data) =>{
        setIssuingDict(data)
        setAddElement(true)
    }

    const GetDfIssuingManual = () =>{
        setLoaderAct(true)
        axios({method:'POST',url:OnRun+'/issuing/getissuingmanual',data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setDfissuing(response.data.df)
            }
            setLoaderAct(false)
        })
    }

    const AddDfIssuingManual = () =>{
        if(IssuingDict.comp.length==0){setMsg('لطفا شرکت بیمه گر را انتخاب کنید')
        }else if(IssuingDict['رشته'].length==0){setMsg('لطفا رشته را تکمیل کنید')
        }else if(IssuingDict['کد رایانه صدور بیمه نامه'].length==0){setMsg('لطفا کد رایانه صدور بیمه نامه را تکمیل کنید')
        }else if(IssuingDict['مورد بیمه'].length==0){setMsg('لطفا مورد بیمه را تکمیل کنید')
        }else if(IssuingDict['شماره بيمه نامه'].length==0){setMsg('لطفا شماره بيمه نامه را تکمیل کنید')
        }else if(IssuingDict['تاريخ بيمه نامه يا الحاقيه'].length==0){setMsg('لطفا تاريخ بيمه نامه يا الحاقيه را تکمیل کنید')
        }else if(IssuingDict['تاریخ عملیات'].length==0){setMsg('لطفا تاریخ عملیات را تکمیل کنید')
        }else if(IssuingDict['پرداخت کننده حق بیمه'].length<4){setMsg('لطفا شرکت پرداخت کننده حق بیمه را انتخاب کنید')
        }else if(IssuingDict['تاریخ سررسید'].length==0){setMsg('لطفا تاریخ سررسید را تکمیل کنید')
        }else if(IssuingDict['تاريخ پایان'].length==0){setMsg('لطفا تاريخ پایان را تکمیل کنید')
        }else if(IssuingDict['مبلغ کل حق بیمه'].length==0){setMsg('لطفا مبلغ کل حق بیمه را تکمیل کنید')
        }else if(IssuingDict['مبلغ تسویه شده'].length==0){setMsg('لطفا مبلغ تسویه شده را تکمیل کنید')
        }else if(IssuingDict['بدهی باقی مانده'].length==0){setMsg('لطفا بدهی باقی مانده را تکمیل کنید')
        }else{
            axios({method:'POST',url:OnRun+'/issuing/addissuingmanual',data:{cookie:LginKy,IssuingDict:IssuingDict}
            }).then(response=>{
                if(response.data.replay){
                    setMsg('ثبت شد')
                    setAddElement(false)
                    setIssuingDict({...IssuingDict,'_id':''})

                }else{
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
        }else{
            setUser(response.data.user)
        }
        }).catch(error=>{setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
    })        }



    const cansel = () =>{
        setAddElement(false)
        setIssuingDict({...IssuingDict,'_id':''})

    }

    useEffect(verificationCookie,[LginKy])
    useEffect(getInsurer,[])
    useEffect(GetDfIssuingManual,[])


    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Loader enable={loaderAct}/>
            <Del dataDel={dataDel} setDataDel={setDataDel} fnc={delIssuing}/>

            <div className="FrmTbl">
            {AddElement?
                <div className="FormPlus">
                    <div className="FldPlus">
                        {insurer==null?null:
                            <label>
                                <p>شرکت بیمه</p>
                                <select value={IssuingDict.comp} onChange={(e)=>setIssuingDict({...IssuingDict,comp:e.target.value})}>
                                    {insurer.map(i=>{
                                        return(
                                            <option key={i}>{i}</option>
                                        )
                                    })}
                                </select>
                            </label>
                        }
                        <label>
                            <p>پرداخت کننده حق بیمه</p>
                            <input value={IssuingDict['پرداخت کننده حق بیمه']} onChange={(e)=>setIssuingDict({...IssuingDict,'پرداخت کننده حق بیمه':e.target.value})}></input>
                        </label>
                        <label>
                            <p>رشته</p>
                            <input value={IssuingDict['رشته']} onChange={(e)=>setIssuingDict({...IssuingDict,'رشته':e.target.value})}></input>
                        </label>
                        <label>
                            <p>مورد بیمه</p>
                            <input value={IssuingDict['مورد بیمه']} onChange={(e)=>setIssuingDict({...IssuingDict,'مورد بیمه':e.target.value})}></input>
                        </label>
                        <label>
                            <p>کد رایانه صدور بیمه نامه</p>
                            <input value={IssuingDict['کد رایانه صدور بیمه نامه']} onChange={(e)=>setIssuingDict({...IssuingDict,'کد رایانه صدور بیمه نامه':e.target.value})}></input>
                        </label>
                        <label>
                            <p>شماره بيمه نامه</p>
                            <input value={IssuingDict['شماره بيمه نامه']} onChange={(e)=>setIssuingDict({...IssuingDict,'شماره بيمه نامه':e.target.value})}></input>
                        </label>
                        <label>
                            <p>تاريخ بيمه نامه يا الحاقيه</p>
                            <input value={IssuingDict['تاريخ بيمه نامه يا الحاقيه']} onChange={(e)=>setIssuingDict({...IssuingDict,'تاريخ بيمه نامه يا الحاقيه':e.target.value})}></input>
                        </label>
                        <label>
                            <p>تاريخ پایان</p>
                            <input value={IssuingDict['تاريخ پایان']} onChange={(e)=>setIssuingDict({...IssuingDict,'تاريخ پایان':e.target.value})}></input>
                        </label>
                        <label>
                            <p>تاریخ عملیات</p>
                            <input value={IssuingDict['تاریخ عملیات']} onChange={(e)=>setIssuingDict({...IssuingDict,'تاریخ عملیات':e.target.value})}></input>
                        </label>
                        <label>
                            <p>تاریخ سررسید</p>
                            <input value={IssuingDict['تاریخ سررسید']} onChange={(e)=>setIssuingDict({...IssuingDict,'تاریخ سررسید':e.target.value})}></input>
                        </label>
                        <label>
                            <p>مبلغ کل حق بیمه</p>
                            <input value={IssuingDict['مبلغ کل حق بیمه']} onChange={(e)=>setIssuingDict({...IssuingDict,'مبلغ کل حق بیمه':e.target.value})}></input>
                        </label>
                        <label>
                            <p>مبلغ تسویه شده</p>
                            <input value={IssuingDict['مبلغ تسویه شده']} onChange={(e)=>setIssuingDict({...IssuingDict,'مبلغ تسویه شده':e.target.value})}></input>
                        </label>
                        <label>
                            <p>بدهی باقی مانده</p>
                            <input value={IssuingDict['بدهی باقی مانده']} onChange={(e)=>setIssuingDict({...IssuingDict,'بدهی باقی مانده':e.target.value})}></input>
                        </label>
                        <label>
                            <p>نوع</p>
                            <select value={IssuingDict['additional']} onChange={(e)=>setIssuingDict({...IssuingDict,'additional':e.target.value})}>
                                <option value={'اصلی'}>اصلی</option>
                                <option value={'اضافی'}>اضافی</option>
                                <option value={'برگشتی'}>برگشتی</option>
                            </select>
                        </label>
                   </div>
                   <div className="BtnBx">
                        <button className="AplBtn" onClick={AddDfIssuingManual}>تایید</button>
                        <button className="CnlBtn" onClick={cansel}>لغو</button>
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
                            <div className="BtnTools" onClick={GetDfIssuingManual}>
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

export default IssuinManual