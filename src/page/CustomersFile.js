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

const CustomersFile = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [Comp , setComp] = useState('')
    const [insurer , setInsurer] = useState(null)
    const [File , setFile] = useState(null)
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [Df, setDf]= useState(null)
    const [AddElement, setAddElement] = useState(false)
    const [dataDel ,setDataDel] = useState(false)

    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    if(Df!=null){
        var table = new Tabulator("#data-table", {
            data:Df,
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
                {title:"بیمه گر", field:"comp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"تعداد", field:"count", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setDataDel({data:data.comp,msg:'ایا از حذف "'+data.comp+'" مطمعن هستید؟'})

                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">حذف</div>'}
                },
            ]
        })
    }


    const uploadFile = () =>{
        const formData = new FormData();
        formData.append('File',File)
        formData.append('cookie',LginKy)
        formData.append('comp',Comp)
        axios({
            method:'POST',
            url:OnRun+'/customers/uploadfile',
            data:formData,
            config: {headers:{'content-type': 'multipart/form-data'}},
        }).then(response=>{
            setAddElement(false)
            if(response.data.replay){
                getCustomerGroup()
            }else{
                setMsg(response.data.msg)
            }
        })
    }


    const getCustomerGroup = () =>{
        axios({method:'POST',url:OnRun+'/customers/customergroup', data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setDf(response.data.df)
            }else{
                setMsg(response.data.msg)
            }
        })
    }


    const DelFnc = (comp) =>{
        axios({method:'POST',url:OnRun+'/customers/delcustomergroup', data:{cookie:LginKy, comp:comp}
        }).then(response=>{
            if(response.data.replay){
                setMsg('حذف شد')
                getCustomerGroup()
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
                setComp(response.data.insurer[0])
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
    useEffect(getCustomerGroup,[])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Del dataDel={dataDel} setDataDel={setDataDel} fnc={DelFnc}/>

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
                            <input type='file' onChange={e=>setFile(e.target.files[0])}/>
                        </label>
                        <label>
                            <p>نمونه فایل</p>
                            <button><a href='/sample/customers.xlsx' download="customers.xlsx">نمونه فایل</a></button>
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
                            <div className="BtnTools" onClick={getCustomerGroup}>
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


export default CustomersFile