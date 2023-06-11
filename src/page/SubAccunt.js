import { useState, useEffect } from "react"
import { OnRun ,consultantDisable} from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../componet/exportPdf"
import {IoRefreshSharp,IoAddCircleOutline,IoInformationCircleOutline,IoRemoveCircleOutline} from "react-icons/io5";
import { BsFileEarmarkSpreadsheetFill,BsFillFilePdfFill} from "react-icons/bs"

const SubAccunt = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [sub, setSub] = useState({phone:'',name:'',level:'شخص مشاور'})
    const [code, setCode] = useState('')
    const [codeinp, setCodeinp] = useState('')
    const [subDf, setSubDf] = useState(null)
    const [AddElement, setAddElement] = useState(false)
    const [lincenslist, setLincenslist] = useState(null)


    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');


    if(subDf!=null){
        var columnsTables = [
            {title:"کاربر اصلی",visible:false, field:"username", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:8,headerFilter:"input"},
            {title:"کاربر فرعی", field:"subPhone", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:8,headerFilter:"input"},
            {title:"نام", field:"name", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:8,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
            {title:"سطح دسترسی", field:"level", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:8,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
            {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                cellClick:function(e, cell){
                    let row = cell.getRow();
                    let data = row.getData();
                    delSub(data.subPhone)
                },
                formatter:function(cell, formatterParams, onRendered){
                    return "حذف"
                }
            },
            {title:"ویرایش", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                cellClick:function(e, cell){
                    let row = cell.getRow();
                    let data = row.getData();
                    data['phone'] = data['subPhone']
                    setSub(data)
                    setAddElement(true)
                },
                formatter:function(e,cell){
                    return '<div className="TblBtnDynEdt">ویرایش</div>'
                }
            },
        ]
        for(var i in lincenslist){
            columnsTables.unshift({title:lincenslist[i], field:lincenslist[i], visible:false, hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},)
        }

        var table = new Tabulator("#data-table", {
            data:subDf,
            columns:columnsTables,
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



    const handleApplyCunsoltant = () =>{

        axios({method:'POST',url:OnRun+'/management/setsub',data:{cookie:LginKy,sub:sub}
        }).then(response=>{
            setCode('')

            if(response.data.replay){
                setMsg('ثبت شد')
                getsub()
                setAddElement(false)
            }else{
                setMsg('قبلا این شماره ثبت شده')
            }
        })

    }

    const delSub = (phone)=>{
        axios({method:"POST",url:OnRun+'/management/delsub',data:{phone:phone,cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setMsg('حذف شد')
                getsub()
            }
        })
    }

    const getsub = () =>{
        axios({method:'POST',url:OnRun+'/authorization/getsub',data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setSubDf(response.data.df)
            }
        })
    }

    const getLincensList = () =>{
        axios({method:'POST',url:OnRun+'/authorization/lincenslist',data:{cookie:LginKy}
        }).then(response=>{
            setLincenslist(response.data.lincenslist)
        })
    }

    const ObjectGenerateLincensList = () =>{
        var obj = {}
        if(lincenslist!=null){
            lincenslist.map((key)=>{
                obj[key] = false
            })
            obj['phone'] = ''
            obj['name'] = ''
            obj['level'] = 'شخص مشاور'
            setSub(obj)
        }
    }

    useEffect(verificationCookie,[LginKy])
    useEffect(getsub,[])
    useEffect(getLincensList,[])
    useEffect(ObjectGenerateLincensList,[lincenslist])


    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <div className="FrmTbl">
                {AddElement?
                <div className="FormPlus">

                        <div className="FldPlus">
                            <label>
                                <p>نام</p>
                                <input value={sub.name} onChange={(e)=>setSub({...sub,name:e.target.value})}/>
                            </label>
                            <label>
                                <p>تلفن</p>
                                <input value={sub.phone} onChange={(e)=>setSub({...sub,phone:e.target.value})}/>
                            </label>
                            <label>
                                <p>سطح دسترسی</p>
                                <select value={sub.level} onChange={(e)=>setSub({...sub,level:e.target.value})}>
                                    <option value='همه مشاوران'>همه مشاوران</option>
                                    <option value='شخص مشاور'>شخص مشاور</option>
                                </select>
                            </label>
                            {
                                lincenslist==null?null:
                                lincenslist.map(i=>{
                                    if(!consultantDisable.includes(i) && sub.level=='شخص مشاور'){
                                        return(
                                            <label key={i}>
                                                <p>{i}</p>
                                                <input disabled type='checkbox' defaultChecked={sub[i]}/>
                                            </label>
                                        )

                                    }else{
                                        return(
                                            <label key={i}>
                                                <p>{i}</p>
                                                <input type='checkbox' defaultChecked={sub[i]} onChange={(e)=>setSub({...sub,[i]:!sub[i]})}/>
                                            </label>
                                        )
                                    }
             
                                })
                            }
                        </div>

                        <div className="BtnBx">
                            <button className="AplBtn" onClick={handleApplyCunsoltant}>ثبت</button>
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
                            <div className="BtnTools" onClick={getsub}>
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


export default SubAccunt