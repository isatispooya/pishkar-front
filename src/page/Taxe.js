import { useState, useEffect } from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import Del from "../componet/del"
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../componet/exportPdf"
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {IoRefreshSharp,IoAddCircleOutline,IoInformationCircleOutline} from "react-icons/io5";
import { BsFileEarmarkSpreadsheetFill,BsFillFilePdfFill} from "react-icons/bs"


const Taxe = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [msg, setMsg] = useState('')
    const [levelList, setlevelList] = useState(null)
    const [level, setLevel] = useState({year:'',
        incomeLevel1:'',
        incomeLevel2:'',
        incomeLevel3:'',
        incomeLevel4:'',
        incomeLevel5:'',
        incomeLevel6:'',
        incomeLevel7:'',
        taxeLevel1:'',
        taxeLevel2:'',
        taxeLevel3:'',
        taxeLevel4:'',
        taxeLevel5:'',
        taxeLevel6:'',
        taxeLevel7:'',})
    const [AddElement, setAddElement] = useState(false)
    const [dataDel ,setDataDel] = useState(false)

    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    if(levelList!=null){
        var table = new Tabulator("#data-table", {
            data:levelList,
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
            tooltips:true,
            columns:[
                {title:"سال", field:"year", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",tooltip:true},
                {title:"درآمد 1", field:"incomeLevel1", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"نرخ 1", field:"taxeLevel1", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"درآمد 2", field:"incomeLevel2", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"نرخ 2", field:"taxeLevel2", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"درآمد 3", field:"incomeLevel3", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"نرخ 3", field:"taxeLevel3", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"درآمد 4", field:"incomeLevel4", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"نرخ 4", field:"taxeLevel4", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"درآمد 5", field:"incomeLevel5", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"نرخ 5", field:"taxeLevel5", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"درآمد 6", field:"incomeLevel6", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"نرخ 6", field:"taxeLevel6", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"نرخ 7", field:"incomeLevel7", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()}},
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setDataDel({data:data.year,msg:'ایا از حذف "'+data.year+'" مطمعن هستید؟'})

                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">حذف</div>'}
                },
                {title:"ویرایش", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setLevel(data)
                        setAddElement(true)
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

    const setTaxe = () =>{
        if(level.year>1450){setMsg('لطفا سال را تصحیح کنید')
        }else if(level.year<1350){setMsg('لطفا سال را تصحیح کنید')
        }else{
            axios({method:'POST',url:OnRun+'/management/settax',data:{cookie:LginKy,level:level}
            }).then(response=>{
                if(response.data.replay){
                    setMsg('انجام شد')
                }
            })
        }
    }

    const getTaxe = () =>{
        axios({method:'POST',url:OnRun+'/management/gettax',data:{cookie:LginKy}
        }).then(response=>{
            setlevelList(response.data.df)
        })
    }

    const deltaxe = (year) =>{
        axios({method:'POST',url:OnRun+'/management/deltax',data:{cookie:LginKy,year:year}
        }).then(response=>{
            if(response.data.replay){
                setMsg('حذف شد')
            }else{
                setMsg('خطا در حذف')
            }
        })
    }

    useEffect(verificationCookie,[LginKy])
    useEffect(getTaxe,[msg])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Del dataDel={dataDel} setDataDel={setDataDel} fnc={deltaxe}/>

            <div className="FrmTbl">
            {AddElement?
                <div className="FormPlus">
                    <div className="FldPlus">
                        <label>
                            <p>سال</p>
                            <input value={level.year} onChange={(e)=>{setLevel({...level,year:e.target.value})}}/>
                        </label>
                        <label>
                            <p>سطح 1</p>
                            <div className="subLbl">
                                <span>ريال</span>
                                <input value={level.incomeLevel1} onChange={(e)=>{setLevel({...level,incomeLevel1:e.target.value})}}/>
                            </div>
                            <div className="subLbl">
                                <span>%</span>
                                <input value={level.taxeLevel1} onChange={(e)=>{setLevel({...level,taxeLevel1:e.target.value})}}/>
                            </div>
                        </label>
                        <label>
                            <p>سطح 2</p>
                            <div className="subLbl">
                                <span>ريال</span>
                                <input value={level.incomeLevel2} onChange={(e)=>{setLevel({...level,incomeLevel2:e.target.value})}}/>
                            </div>
                            <div className="subLbl">
                                <span>%</span>
                                <input value={level.taxeLevel2} onChange={(e)=>{setLevel({...level,taxeLevel2:e.target.value})}}/>
                            </div>
                        </label>
                        <label>
                            <p>سطح 3</p>
                            <div className="subLbl">
                                <span>ريال</span>
                                <input value={level.incomeLevel3} onChange={(e)=>{setLevel({...level,incomeLevel3:e.target.value})}}/>
                            </div>
                            <div className="subLbl">
                                <span>%</span>
                                <input value={level.taxeLevel3} onChange={(e)=>{setLevel({...level,taxeLevel3:e.target.value})}}/>
                            </div>
                        </label>
                        <label>
                            <p>سطح 4</p>
                            <div className="subLbl">
                                <span>ريال</span>
                                <input value={level.incomeLevel4} onChange={(e)=>{setLevel({...level,incomeLevel4:e.target.value})}}/>
                            </div>
                            <div className="subLbl">
                                <span>%</span>
                                <input value={level.taxeLevel4} onChange={(e)=>{setLevel({...level,taxeLevel4:e.target.value})}}/>
                            </div>
                        </label>
                        <label>
                            <p>سطح 5</p>
                            <div className="subLbl">
                                <span>ريال</span>
                                <input value={level.incomeLevel5} onChange={(e)=>{setLevel({...level,incomeLevel5:e.target.value})}}/>
                            </div>
                            <div className="subLbl">
                                <span>%</span>
                                <input value={level.taxeLevel5} onChange={(e)=>{setLevel({...level,taxeLevel5:e.target.value})}}/>
                            </div>
                        </label>
                        <label>
                            <p>سطح 6</p>
                            <div className="subLbl">
                                <span>ريال</span>
                                <input value={level.incomeLevel6} onChange={(e)=>{setLevel({...level,incomeLevel6:e.target.value})}}/>
                            </div>
                            <div className="subLbl">
                                <span>%</span>
                            <   input value={level.taxeLevel6} onChange={(e)=>{setLevel({...level,taxeLevel6:e.target.value})}}/>
                            </div>
                        </label>
                        <label>
                            <p>سطح 7</p>
                            <div className="subLbl">
                                <span>ريال</span>
                                <input value={level.incomeLevel7} onChange={(e)=>{setLevel({...level,incomeLevel7:e.target.value})}}/>
                            </div>
                            <div className="subLbl">
                                <span>%</span>
                                <input value={level.taxeLevel7} onChange={(e)=>{setLevel({...level,taxeLevel7:e.target.value})}}/>
                            </div>
                        </label>
                    </div>
                    <div className="BtnBx">
                        <button className="AplBtn" onClick={setTaxe}>تایید</button>
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
                            <div className="BtnTools" onClick={getTaxe}>
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


export default Taxe