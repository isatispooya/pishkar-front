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

const Branches = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [loaderAct, setLoaderAct] = useState(true)
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [AddElement, setAddElement] = useState(false)
    const [consultantList, setConsultantList] = useState(null)
    const [consultant, setConsultant] = useState(null)
    const [SubConsultantList, setSubConsultantList] = useState([])
    const [BranchesName, setBranchesName] = useState('')
    const [BranchesList, setBranchesList] = useState(null)
    const [dataDel ,setDataDel] = useState(false)

    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    if(BranchesList!=null){
        var table = new Tabulator("#data-table", {
            data:BranchesList,
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
                {title:"نام شعبه", field:"BranchesName", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"مدیر شعبه", field:"managementBranche", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"مشاوران", field:"SubConsultantList", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"input"},
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setDataDel({data:data.BranchesName,msg:'ایا از حذف "'+data.BranchesName+'" مطمعن هستید؟'})

                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">حذف</div>'}
                },
                {title:"ویرایش", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setBranchesName(data.BranchesName)
                        setConsultant(data.SubConsultantList)
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


    const addSubConsultant = () =>{
        setSubConsultantList(SubConsultantList.concat({id:SubConsultantList.length,subconsultant:consultant}))
    }

    const updateSubConsultant = (v,i) =>{
        var newAct = SubConsultantList.map(j=>{
            if(j.id == i){
                return {...j,subconsultant:v}
            }
            return j
        })
        setSubConsultantList(newAct)
    }


    const GetConsultantAll = () =>{
        axios({method:'POST',url:OnRun+'/management/getcunsoltant',data:{cookie:LginKy}
        }).then(response=>{
            setConsultantList(response.data.df)
            setConsultant(response.data.df[0].nationalCode)
        })
    }

    const AddBranches = () =>{
        if(BranchesName==''){setMsg('لطفا نام شعبه را کامل کنید')
        }else if(consultant==null){setMsg('لطفا  مدیر شعبه را انتخاب کنید')
        }else{
            axios({method:'POST',url:OnRun+'/management/addbranche',data:{cookie:LginKy,BranchesName:BranchesName,managementBranche:consultant,SubConsultantList:SubConsultantList}
            }).then(response=>{
                if(response.data.replay){
                    setMsg('ثبت شد')
                }else{
                    setMsg(response.data.msg)
                }
            })
        }
    }

    const getBranche = () =>{
        axios({method:'POST',url:OnRun+'/management/getbranche',data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setBranchesList(response.data.df)
            }else{
                setMsg(response.data.msg)
            }
        })
    }

    const delBranche = (name) =>{
        axios({method:'POST',url:OnRun+'/management/delbranche',data:{cookie:LginKy,name:name}
        }).then(response=>{
            if(response.data.replay){
                setMsg('ثبت شده')
            }else{
                setMsg(response.data.msg)
            }
        })
    }

    useEffect(GetConsultantAll,[])
    useEffect(verificationCookie,[LginKy])
    useEffect(getBranche,[msg])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Del dataDel={dataDel} setDataDel={setDataDel} fnc={delBranche}/>

            <div className="FrmTbl">
                {AddElement?
                    <div className="FormPlus">
                    <div className="FldPlus">
                        <label>
                            <p>نام شعبه</p>
                            <input value={BranchesName} onChange={(e)=>setBranchesName(e.target.value)}/>
                        </label>
                        <label>
                            <p>مدیر شعبه</p>
                            {consultantList==null?null:
                                <select value={consultant} onChange={(e)=>setConsultant(e.target.value)}>
                                    {consultantList.map(i=>{
                                        return(
                                            <option key={i.nationalCode} value={i.nationalCode}>{i.gender + ' '+i.fristName+ ' '+i.lastName}</option>
                                        )
                                    })}
                                </select>
                            }
                        </label>
                        {SubConsultantList==null?null:
                            consultantList==null?null:
                                SubConsultantList.map(j=>{
                                    return(
                                        <label key={j.id} >
                                            <p>مشاوران شعبه</p>
                                            <select  value={j.subconsultant} onChange={(e)=>updateSubConsultant(e.target.value,j.id)}>
                                                {consultantList.map(i=>{
                                                    return(
                                                        <option key={i.nationalCode} value={i.nationalCode}>{i.gender + ' '+i.fristName+ ' '+i.lastName}</option>
                                                    )
                                                })}
                                            </select>
                                        </label>
                                )
                            })
                        }
                    </div>
                    <div className="BtnBx">
                        <button className="AplBtn" onClick={addSubConsultant}>افزودن</button>
                        <button className="AplBtn" onClick={AddBranches}>ثبت</button>
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
                            <div className="BtnTools" onClick={getBranche}>
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

export default Branches