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
import Del from "../../componet/del"

const AddenLife = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [insurer , setInsurer] = useState(null)
    const [Dfissuing , setDfissuing] = useState(null)
    const [NumInsList , setNumInsList] = useState(null)
    const [AddElement, setAddElement] = useState(false)
    const [IssuingDict, setIssuingDict] = useState({'شماره بيمه نامه':''})
    const [dataDel ,setDataDel] = useState(false)

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
            dataTree:true,
            dataTreeStartExpanded:false,
            columns:[
                {title:"شماره بيمه نامه", field:"شماره بيمه نامه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input" },
                {title:"بیمه گر", field:"comp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"تاريخ شروع", field:"تاريخ شروع", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"تاريخ انقضاء", field:"تاريخ  انقضاء", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"تعداد اقساط در سال", field:"تعداد اقساط در سال", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"حق بیمه هر قسط", field:"حق بیمه هر قسط \n(جمع عمر و پوششها)", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"ضریب رشد سالانه حق بیمه", field:"ضریب رشد سالانه حق بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setDataDel({data:data,msg:'ایا از حذف مطمعن هستید؟'})

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

    const getInsurenByNum=()=>{
        axios({method:'POST',url:OnRun+'/issuing/getinsurerbynum', data:{cookie:LginKy,IssuingDict:IssuingDict}
        }).then(response=>{
            if(response.data.replay){
                setIssuingDict(response.data.ins)
            }else{
                setMsg(response.data.msg)
            }
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



    const deladdenlife = (data) =>{
        axios({method:'POST',url:OnRun+'/issuing/deladdenlife',data:{cookie:LginKy,dict:data}
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
        axios({method:'POST',url:OnRun+'/issuing/addenLife',data:{cookie:LginKy}
        }).then(response=>{
            console.log(response.data)
            if(response.data.replay){
                setDfissuing(response.data.df)
            }
        })
    }

    const AddLifeAdden = () =>{
        console.log(IssuingDict['تاريخ شروع'].length)
        if(IssuingDict['شماره بيمه نامه'].length==0){setMsg('لطفا شماره بيمه نامه را تکمیل کنید')
        }else if(IssuingDict['تاريخ شروع'].length==0){setMsg('لطفا تاريخ شروع را تکمیل کنید')
        }else if(IssuingDict['تاريخ  انقضاء'].length==0){setMsg('لطفا تاريخ  پایان را تکمیل کنید')
        }else if(IssuingDict['ضریب رشد سالانه حق بیمه'].length==0){setMsg('مدت')
        }else if(IssuingDict['تعداد اقساط در سال']>12){setMsg('تعداد اقساط در سال')
        }else if(IssuingDict['تعداد اقساط در سال']<1){setMsg('تعداد اقساط در سال')
        }else if(IssuingDict['حق بیمه هر قسط \n(جمع عمر و پوششها)'].length==0){setMsg('لطفا ضریب رشد سالانه حق بیمه را تکمیل کنید')
        }else{
            axios({method:'POST',url:OnRun+'/issuing/AddLifeAdden',data:{cookie:LginKy,IssuingDict:IssuingDict}
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


    const GetNumInsList = () =>{
        axios({method:'POST',url:OnRun+'/issuing/getnuminslist',data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setNumInsList(response.data.lst)
            }else{
                setMsg(response.data.msg)
            }
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

    useEffect(verificationCookie,[LginKy])
    useEffect(getInsurer,[])
    useEffect(GetNumInsList,[])
    useEffect(GetDfIssuingManual,[])


    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Del dataDel={dataDel} setDataDel={setDataDel} fnc={deladdenlife}/>

            <div className="FrmTbl">
            {AddElement?
                <div className="FormPlus">
                    <div className="FldPlus">
                        {
                            NumInsList==null?null:
                            <label>
                                <p>شماره بيمه نامه</p>
                                <input list="nlist" value={IssuingDict['شماره بيمه نامه']} onChange={(e)=>setIssuingDict({...IssuingDict,'شماره بيمه نامه':e.target.value})}></input>
                                <datalist id="nlist">
                                    {
                                        NumInsList.map(i=>{
                                            return(
                                                <option value={i}/>
                                            )
                                        })
                                    }
                                </datalist>
                            </label>
                        }
                        {
                            !IssuingDict['تاريخ  انقضاء']?null:
                            <>
                            <label>
                                <p>تاريخ شروع الحاقیه</p>
                                <input value={IssuingDict['تاريخ شروع']} onChange={(e)=>setIssuingDict({...IssuingDict,'تاريخ شروع':e.target.value})}></input>
                            </label>
                            <label>
                                <p>تاريخ  انقضاء</p>
                                <input value={IssuingDict['تاريخ  انقضاء']} onChange={(e)=>setIssuingDict({...IssuingDict,'تاريخ  انقضاء':e.target.value})}></input>
                            </label>

                            <label>
                                <p>ضریب رشد سالانه حق بیمه</p>
                                <input value={IssuingDict['ضریب رشد سالانه حق بیمه']} onChange={(e)=>setIssuingDict({...IssuingDict,'ضریب رشد سالانه حق بیمه':e.target.value})}></input>
                            </label>
                            <label>
                                <p>تعداد اقساط در سال</p>
                                <input value={IssuingDict['تعداد اقساط در سال']} onChange={(e)=>setIssuingDict({...IssuingDict,'تعداد اقساط در سال':e.target.value})}></input>
                            </label>
                            <label>
                                <p>حق بیمه هر قسط</p>
                                <input value={IssuingDict['حق بیمه هر قسط \n(جمع عمر و پوششها)']} onChange={(e)=>setIssuingDict({...IssuingDict,'حق بیمه هر قسط \n(جمع عمر و پوششها)':e.target.value})}></input>
                            </label>
                            </>
                        }
                   </div>
                   <div className="BtnBx">
                        <button className="AplBtn" onClick={AddLifeAdden}>ثبت</button>
                        <button className="AplBtn" onClick={getInsurenByNum}>دریافت</button>
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

export default AddenLife