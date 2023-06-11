import { useState, useEffect , useContext} from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../componet/exportPdf"
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import DateP from "../componet/context"
import {IoRefreshSharp,IoAddCircleOutline,IoInformationCircleOutline} from "react-icons/io5";
import { BsFileEarmarkSpreadsheetFill,BsFillFilePdfFill} from "react-icons/bs"
import Del from "../componet/del"

const FeesReports = () =>{
    const datePeriod = useContext(DateP)
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [Comp , setComp] = useState('')
    const [insurer , setInsurer] = useState(null)
    const [feesFile , setFeesFile] = useState(null)
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [GettingFees, setGettingFess]= useState(null)
    const [allFees, setAllFees]= useState(null)
    const [AddElement, setAddElement] = useState(false)
    const [dataDel ,setDataDel] = useState(false)

    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    if(GettingFees!=null){
        var table = new Tabulator("#data-table", {
            data:GettingFees,
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
                {title:"دوره", field:"UploadDate", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"بیمه گذار", field:"insurec", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"نام", field:"comp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"کارمزد", field:"كارمزد قابل پرداخت", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setDataDel({data:[data.comp,data.UploadDate],msg:'ایا از حذف "'+data.comp+' , '+data.UploadDate+'" مطمعن هستید؟'})

                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">حذف</div>'}
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
        }).catch(error=>{setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
    })        }


    const getInsurer = () =>{
        axios({method:'POST',url:OnRun+'/feesreports/getinsurer', data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setInsurer(response.data.insurer)
                setComp(response.data.insurer[0])
            }else{
                setMsg(response.data.msg)
            }
        })
    }

    const GetFeesUploads = () =>{
        axios({method:'POST',url:OnRun+'/feesreports/getfeesuploads',data:{cookie:LginKy}
        }).then(response=>{
            setGettingFess(response.data.df)
            getInsurer()
        }).catch(error=>{setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
    })        
    }

    const DelFeesUpload = (data) =>{
        axios({method:'POST',url:OnRun+'/feesreports/delupload',data:{cookie:LginKy, comp:data[0],date:data[1]}
        }).then(response=>{
            if(response.data.replay){
                setMsg('انجام شد')
                GetFeesUploads()
            }
        }).catch(error=>{setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
    })        
    }

    const getAllFeesFile = () =>{
        if(feesFile!=null){
            const formData = new FormData();
            formData.append('feesFile',feesFile)
            formData.append('cookie',LginKy)
            formData.append('comp',Comp)
            axios({
                method:'POST',
                url:OnRun+'/feesreports/getallfeesFile',
                data:formData,
                config: {headers:{'content-type': 'multipart/form-data'}}
            }).then(response=>{
                setAllFees(response.data.Allfees)
            })
        }

    }

    const uploadFile = () =>{
        if(feesFile==null){setMsg('لطفا فایل را بارگذاری کنید')
        }else if(datePeriod==''){setMsg('لطفا دوره را انتخاب کنید')
        }else if(Comp==''){setMsg('لطفا شرکت بیمه را انتخاب کنتید')
        }else{
            const formData = new FormData();
            formData.append('feesFile',feesFile)
            formData.append('date',datePeriod.Show)
            formData.append('cookie',LginKy)
            formData.append('comp',Comp)
            axios({
                method:'POST',
                url:OnRun+'/feesreports/uploadfile',
                data:formData,
                config: {headers:{'content-type': 'multipart/form-data'}}
            }).then(response=>{
                console.log(response.data)
                if(response.data.replay){
                    setMsg('ثبت شد')
                    GetFeesUploads()
                }else{
                    setMsg(response.data.msg)
                }
            })
        }

    }


    useEffect(verificationCookie,[LginKy])
    useEffect(GetFeesUploads,[])
    useEffect(getAllFeesFile,[feesFile])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Del dataDel={dataDel} setDataDel={setDataDel} fnc={DelFeesUpload}/>

            <div className="FrmTbl">
            {AddElement?
                <div className="FormPlus">
                    <div className="FldPlus">
                        <label>
                            <p>تاریخ گزارش</p>
                            <p>{datePeriod.Show}</p>
                        </label>
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
                            <p>جمع کل کارمزد</p>
                            <p>{allFees==null?0:allFees}</p>
                        </label>
                        <label>
                            <p>نمونه فایل</p>
                            <button><a href='/sample/fee.xlsx' download="fee.xlsx">نمونه فایل</a></button>
                        </label>
                    </div>
                    <div className="BtnBx">
                        <button className="AplBtn" onClick={uploadFile}>تایید</button>
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
                            <div className="BtnTools" onClick={GetFeesUploads}>
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



export default FeesReports
