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

const Issuing = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [insurer , setInsurer] = useState(null)
    const [Comp , setComp] = useState('')
    const [feesFile , setFeesFile] = useState(null)
    const [Dfissuing , setDfissuing] = useState(null)
    const [additional, setadditional] = useState(null)
    const [AddElement, setAddElement] = useState(false)
    const [loaderAct, setLoaderAct] = useState(false)
    const [dataDel ,setDataDel] = useState(false)

    const delIssuing = (data) =>{
        axios({method:'POST',url:OnRun+'/issuing/delfile',data:{cookie:LginKy,data:data}
        }).then(response=>{
            if(response.data.replay){
                setMsg('حذف شد')
            }else{
                setMsg(response.data.msg)
            }
        })
    }

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
                {title:"بیمه گذار", field:"comp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"دوره عملیات", field:"دوره عملیات", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"از تاریخ", field:"از تاریخ", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"تا تاریخ", field:"تا تاریخ", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"تعداد بیمه نامه", field:"count", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"تعداد ردیف", field:"تعداد", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"مبلغ کل حق بیمه", field:"مبلغ کل حق بیمه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setDataDel({data:data,msg:'ایا از حذف "'+data.comp+' در ' +data['دوره عملیات']+'" مطمعن هستید؟'})

                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">حذف</div>'}
                },                
            ],
        })
    }



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

    const uploadFile = () =>{
        if(feesFile==null){setMsg('لطفا فایل را بارگذاری کنید')
        }else if(Comp==''){setMsg('لطفا شرکت بیمه را انتخاب کنتید')
        }else{
            const formData = new FormData();
            formData.append('feesFile',feesFile)
            formData.append('cookie',LginKy)
            formData.append('comp',Comp)
            if(additional==null){
                formData.append('additional',additional)
            }else{
                formData.append('additional',additional.map(i=>{return(JSON.stringify(i))}))
            }
            axios({
                method:'POST',
                url:OnRun+'/issuing/cheackadditional',
                data:formData,
                config: {headers:{'content-type': 'multipart/form-data'}}
            }).then(response=>{
                
                if(response.data.replay){
                    if(response.data.additional==false){
                        setMsg(response.data.msg)
                        setadditional(null)
                        setAddElement(false)
                        setFeesFile(null)
                    }else{
                        setadditional(response.data.additional)
                    }

                }else{
                    setMsg(response.data.msg)
                }
                setAddElement(false)
            })
        }
    }

    const GetDfIssuing = () =>{
        setLoaderAct(true)

        axios({method:'POST',url:OnRun+'/issuing/getdf',data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setDfissuing(response.data.df)
            }else{
                setDfissuing(null)
            }
            setLoaderAct(false)

        })
    }


    const handleChangeadditional=(ec,i)=>{
        var newvalue = additional.map(j=>{
            if(i==j){
                var newobject = j
                newobject['additional'] = ec
                return newobject
            }else{
                return j
            }
        })
        setadditional(newvalue)

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
    useEffect(getInsurer , [])
    useEffect(GetDfIssuing , [msg])

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
                                <select value={Comp} onChange={(e)=>setComp(e.target.value)}>
                                    {insurer.map(i=>{
                                        return(
                                            <option key={i}>{i}</option>
                                        )
                                    })}
                                </select>
                            </label>
                        }
                        <label>
                            <p>فایل</p>
                            <input type='file' onChange={e=>setFeesFile(e.target.files[0])}/>
                        </label>
                        <label>
                            <p>نمونه فایل</p>
                            <button><a href='/sample/issuing.xlsx' download="issuing.xlsx">نمونه فایل</a></button>
                        </label>
                   </div>
                   <div className="BtnBx">
                        <button className="AplBtn" onClick={uploadFile}>تایید</button>
                        <button className="CnlBtn" onClick={()=>setAddElement(false)}>لغو</button>
                    </div>
                </div>:null}
                {additional==null?null:
                    <div className="FormPlus">
                        <div className="FldPlus">
                            {
                                additional.map(i=>{
                                    return(
                                        <label key={Math.random()}>
                                            <p>بیمه گر: {i['comp']}</p>
                                            <p>کد رایانه صدور بیمه نامه: {i['کد رایانه صدور بیمه نامه']}</p>
                                            <p>شماره الحاقیه: {i['شماره الحاقیه']}</p>
                                            <p>نوع الحاقیه</p>
                                            <select value={i['additional']} onChange={(e)=>handleChangeadditional(e.target.value,i)}>
                                                <option>اضافی</option>
                                                <option>برگشتی</option>
                                            </select>
                                        </label>
                                    )
                                })
                            }

                        </div>
                        <div className="BtnBx">
                            <button className="AplBtn" onClick={uploadFile}>تایید</button>
                            <button className="CnlBtn" onClick={()=>{
                                setAddElement(false)
                                setadditional(null)}
                                }>لغو</button>
                        </div>
                    </div>
                }
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
                            <div className="BtnTools" onClick={GetDfIssuing}>
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

export default Issuing