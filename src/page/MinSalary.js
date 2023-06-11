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
import Del from "../componet/del"

const MinSalary = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [msg, setMsg] = useState('')
    const [minimum, setMinimum] = useState({year:'',value:''})
    const [minimumList, setMinimumList] = useState(null)
    const [AddElement, setAddElement] = useState(false)
    const [dataDel ,setDataDel] = useState(false)

    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    if(minimumList!=null){
        var table = new Tabulator("#data-table", {
            data:minimumList,
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
                {title:"سال", field:"year", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"حداقل دستمزد روزانه", field:"value", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setDataDel({data:data.year,msg:'ایا از حذف "'+data.year +'" مطمعن هستید؟'})

                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">حذف</div>'}
                },
                {title:"ویرایش", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setAddElement(true)
                        setMinimum(data)
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
        }).catch(error=>{setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
    })        }

    const AddMinimum = () =>{
        if(minimum.year==''){setMsg("لطفا سال را کامل کنید")
        }else if(minimum.year<1350){setMsg("لطفا سال صحیح وارد کنید")
        }else if(minimum.year>1450){setMsg("لطفا سال صحیح وارد کنید")
        }else if(minimum.value==''){setMsg("لطفا مزد روزانه را صحیح وارد کنید")
        }else{
            axios({method:'POST',url:OnRun+'/management/addminsalary',data:{cookie:LginKy,minimum:minimum}
            }).then(response=>{
                if(response.data.replay){
                    setMsg('ثبت شد')
                }
            })
        }
    }
    
    const getminimum = () =>{
        axios({method:'POST',url:OnRun+'/management/getminsalary',data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setMinimumList(response.data.df)
            }else{
                setMinimumList(null)
            }
        })
    }

    const delminimum = (y) =>{
        axios({method:'POST',url:OnRun+'/management/delminsalary',data:{cookie:LginKy,year:y}
        }).then(response=>{
            if(response.data.replay){
                setMsg('حذف شد')
            }
        })
    }

    useEffect(verificationCookie,[LginKy])
    useEffect(getminimum,[msg])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Del dataDel={dataDel} setDataDel={setDataDel} fnc={delminimum}/>

            <div className="FrmTbl">
            {AddElement?
                <div className="FormPlus">
                    <div className="FldPlus">
                        <label>
                            <p>سال</p>
                            <input value={minimum.year} onChange={(e)=>setMinimum({...minimum,year:e.target.value})}/>
                        </label>
                        <label>
                            <p>حداقل دستمزد روزانه</p>
                            <input value={minimum.value} onChange={(e)=>setMinimum({...minimum,value:e.target.value})}/>
                        </label>
                    </div>
                    <div className="BtnBx">
                        <button className="AplBtn" onClick={AddMinimum}>تایید</button>
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
                            <div className="BtnTools" onClick={getminimum}>
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

export default MinSalary