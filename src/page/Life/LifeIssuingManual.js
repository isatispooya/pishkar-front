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

const IssuinLifeManual = () =>{

    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [insurer , setInsurer] = useState(null)
    const [Dfissuing , setDfissuing] = useState(null)
    const [AddElement, setAddElement] = useState(false)
    const [IssuingDict, setIssuingDict] = useState({'نام بیمه گذار':'','شماره بيمه نامه':'','comp':'','تاريخ شروع':'','تاريخ  پایان':'','مدت':'','حق بیمه هر قسط (جمع عمر و پوششها)':'','تعداد اقساط در سال':'','طرح':''})
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
            columns:[
                {title:"بیمه گذار", field:"نام بیمه گذار", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"شماره بيمه نامه", field:"شماره بيمه نامه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"بیمه گر", field:"comp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"تاريخ شروع", field:"تاريخ شروع", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"تاريخ  پایان", field:"تاريخ  پایان", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"مدت سال", field:"مدت", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"حق بیمه", field:"حق بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"طرح", field:"طرح", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"روش پرداخت", field:"روش پرداخت", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"ضریب رشد سالانه حق بیمه", field:"ضریب رشد سالانه حق بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setDataDel({data:data,msg:'ایا از حذف "'+data['نام بیمه گذار']+ ' , '+data['شماره بيمه نامه']+'" مطمعن هستید؟'})

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
        axios({method:'POST',url:OnRun+'/issuing/addissuinglifemanuallife',data:{cookie:LginKy,dict:data}
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
        axios({method:'POST',url:OnRun+'/issuing/getissuinglifemanual',data:{cookie:LginKy}
        }).then(response=>{
            console.log(response.data)
            if(response.data.replay){
                setDfissuing(response.data.df)
            }
        })
    }

    const AddDfIssuingManual = () =>{
        if(IssuingDict.comp.length==0){setMsg('لطفا شرکت بیمه گر را انتخاب کنید')
        }else if(IssuingDict['نام بیمه گذار'].length==0){setMsg('لطفا نام بیمه گذار را تکمیل کنید')
        }else if(IssuingDict['شماره بيمه نامه'].length==0){setMsg('لطفا شماره بيمه نامه را تکمیل کنید')
        }else if(IssuingDict['تاريخ شروع'].length==0){setMsg('لطفا تاريخ شروع را تکمیل کنید')
        }else if(IssuingDict['تاريخ  پایان'].length==0){setMsg('لطفا تاريخ  پایان را تکمیل کنید')
        }else if(IssuingDict['مدت'].length==0){setMsg('مدت')
        }else if(IssuingDict['حق بیمه'].length==0){setMsg('حق بیمه')
        }else if(IssuingDict['تعداد اقساط در سال'].length==0){setMsg('تعداد اقساط در سال')
        }else if(IssuingDict['طرح'].length==0){setMsg('لطفا طرح را تکمیل کنید')
        }else if(IssuingDict['ضریب رشد سالانه حق بیمه'].length==0){setMsg('لطفا ضریب رشد سالانه حق بیمه را تکمیل کنید')
        }else{
            console.log(IssuingDict)
            axios({method:'POST',url:OnRun+'/issuing/addissuinglifemanual',data:{cookie:LginKy,IssuingDict:IssuingDict}
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
    useEffect(GetDfIssuingManual,[])


    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
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
                            <p>بیمه گذار</p>
                            <input value={IssuingDict['نام بیمه گذار']} onChange={(e)=>setIssuingDict({...IssuingDict,'نام بیمه گذار':e.target.value})}></input>
                        </label>
                        <label>
                            <p>شماره بيمه</p>
                            <input value={IssuingDict['شماره بيمه نامه']} onChange={(e)=>setIssuingDict({...IssuingDict,'شماره بيمه نامه':e.target.value})}></input>
                        </label>
                        <label>
                            <p>تاريخ شروع</p>
                            <input value={IssuingDict['تاريخ شروع']} onChange={(e)=>setIssuingDict({...IssuingDict,'تاريخ شروع':e.target.value})}></input>
                        </label>
                        <label>
                            <p>تاريخ  پایان</p>
                            <input value={IssuingDict['تاريخ  پایان']} onChange={(e)=>setIssuingDict({...IssuingDict,'تاريخ  پایان':e.target.value})}></input>
                        </label>
                        <label>
                            <p>مدت</p>
                            <input value={IssuingDict['مدت']} onChange={(e)=>setIssuingDict({...IssuingDict,'مدت':e.target.value})}></input>
                        </label>
                        <label>
                            <p>حق بیمه</p>
                            <input value={IssuingDict['حق بیمه']} onChange={(e)=>setIssuingDict({...IssuingDict,'حق بیمه':e.target.value})}></input>
                        </label>
                        <label>
                            <p>تعداد اقساط در سال</p>
                            <input value={IssuingDict['تعداد اقساط در سال']} onChange={(e)=>setIssuingDict({...IssuingDict,'تعداد اقساط در سال':e.target.value})}></input>
                        </label>
                        <label>
                            <p>طرح</p>
                            <input value={IssuingDict['طرح']} onChange={(e)=>setIssuingDict({...IssuingDict,'طرح':e.target.value})}></input>
                        </label>
                        <label>
                            <p>ضریب رشد سالانه حق بیمه</p>
                            <input value={IssuingDict['ضریب رشد سالانه حق بیمه']} onChange={(e)=>setIssuingDict({...IssuingDict,'ضریب رشد سالانه حق بیمه':e.target.value})}></input>
                        </label>
                   </div>
                   <div className="BtnBx">
                        <button className="AplBtn" onClick={AddDfIssuingManual}>تایید</button>
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

export default IssuinLifeManual