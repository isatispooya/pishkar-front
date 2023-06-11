import { useState, useEffect } from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../componet/exportPdf"
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { minMaxFilterEditor, minMaxFilterFunction } from "../componet/headerFilter"
import {IoRefreshSharp,IoAddCircleOutline,IoInformationCircleOutline} from "react-icons/io5";
import { BsFileEarmarkSpreadsheetFill,BsFillFilePdfFill} from "react-icons/bs"
import Del from "../componet/del"

const SalaryYear = () => {
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [msg, setMsg] = useState('')
    const [salary, setSalary] = useState({year:'',gruop:'',daily:'',sanavat:'',subsidy:'',homing:'',childern:''})
    const [listSalary, setListSalary] = useState(null)
    const [AddElement, setAddElement] = useState(false)
    const [dataDel ,setDataDel] = useState(false)

    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    if(listSalary!=null){
        var table = new Tabulator("#data-table", {
            data:listSalary,
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
                {title:"گروه", field:"gruop", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"دستمزد(روزانه)", field:"daily", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false,formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"سنوات(روزانه)", field:"sanavat", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false,formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"بن خواروبار", field:"subsidy", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false,formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"حق مسکن", field:"homing", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false,formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"حق اولاد", field:"childern", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false,formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},

                {title:"ویرایش", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        editeSalary(data)
                        setAddElement(true)
                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">ویرایش</div>'}
                },
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setDataDel({data:data.year,msg:'ایا از حذف "'+data.year+ ' ' +data.gruop+'"مطمعن هستید؟'})

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


    const handleSetsalary = () =>{
        if(salary.year<1350 || salary.year>1450){setMsg('لطفا سال را تصحیح کنید')
        }else if(salary.daily==0){setMsg('لطفا دستمزد را پرکنید')
        }else if(salary.sanavat==''){setMsg('لطفا سنوات را پرکنید')
        }else if(salary.subsidy==0){setMsg('لطفا بن مسکن و خواروبار را پرکنید')
        }else if(salary.freeTax==0){setMsg('لطفا سقف معافیت مالیاتی را پرکنید')
        }else if(salary.homing==0){setMsg('لطفا حق مسکن را پرکنید')
        }else if(salary.childern==0){setMsg('لطفا حق اولاد را پرکنید')
        }else{
            axios({method:'POST',url:OnRun+'/management/salary',data:{cookie:LginKy,salary:salary}
            }).then(response=>{
                setMsg(response.data.msg)
                handleGetSalary()
            })
        }

    }

    const handleGetSalary = () =>{
        axios({method:'POST',url:OnRun+'/management/getsalary',data:{cookie:LginKy}
        }).then(response=>{
            setListSalary(response.data.df)
        })
    }

    const delSalary = (year) =>{
        axios({method:'POST', url:OnRun+'/management/delsalary',data:{cookie:LginKy,year:year}
        }).then(response=>{
            handleGetSalary()
        })
    }

    const editeSalary = (data) =>{
        setSalary(data)
    }

    useEffect(verificationCookie,[LginKy])
    useEffect(handleGetSalary,[])


    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Del dataDel={dataDel} setDataDel={setDataDel} fnc={delSalary}/>

            <div className="TtlHeader">
                <h1>گروه های حقوق و دستمزد</h1>
            </div>
            <div className="FrmTbl">
                {AddElement?
                <div className="FormPlus">
                    <div className="FldPlus">
                        <label>
                            <p>سال</p>
                            <input value={salary.year} onChange={(e)=>{setSalary({...salary,year:e.target.value})}}/>
                        </label>
                        <label>
                            <p>گروه</p>
                            <input value={salary.gruop} onChange={(e)=>{setSalary({...salary,gruop:e.target.value})}}/>
                        </label>
                        <label>
                            <p>دستمزد (روزانه)</p>
                            <input value={salary.daily} onChange={(e)=>{setSalary({...salary,daily:e.target.value})}}/>
                        </label>
                        <label>
                            <p>سنوات (روزانه)</p>
                            <input value={salary.sanavat} onChange={(e)=>{setSalary({...salary,sanavat:e.target.value})}}/>
                        </label>
                        <label>
                            <p>بن مسکن و خواروبار (ماهانه)</p>
                            <input value={salary.subsidy} onChange={(e)=>{setSalary({...salary,subsidy:e.target.value})}}/>
                        </label>
                        <label>
                            <p>حق مسکن (ماهانه)</p>
                            <input value={salary.homing} onChange={(e)=>{setSalary({...salary,homing:e.target.value})}}/>
                        </label>
                        <label>
                            <p>حق اولاد (ماهانه)</p>
                            <input value={salary.childern} onChange={(e)=>{setSalary({...salary,childern:e.target.value})}}/>
                        </label>
                    </div>
                    <div className="BtnBx">
                        <button className="AplBtn" onClick={handleSetsalary}>تایید</button>
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
                            <div className="BtnTools" onClick={handleGetSalary}>
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


export default SalaryYear