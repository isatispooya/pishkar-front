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
import { minMaxFilterEditor, minMaxFilterFunction } from "../componet/headerFilter"
import { headerMenu,handleGSC } from "../componet/headermenu"
import Del from "../componet/del"

const Consultant = () =>{

    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [consultantState , setConsultant] = useState({fristName:'',lastName:'',nationalCode:'',gender:'آقا',phone:'',code:'',salary:false,childern:0,freetaxe:0,salaryGroup:'',insureWorker:'',insureEmployer:'',active:true})
    const [code, setCode] = useState('')
    const [ConsultantDf, setConsultantDf] = useState(null)
    const [groupSalary, setGroupSalary] = useState(null)
    const [FilterActive, setFilterActive] = useState('all')
    const [AddElement, setAddElement] = useState(false)
    const [dataDel ,setDataDel] = useState(false)
    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');


    

    if(ConsultantDf!=null){
        var table = new Tabulator("#data-table", {
            data:ConsultantDf,
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
                {title:"نام",visible:handleGSC('نام'), field:"fristName", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"نام خانوادگی",visible:handleGSC('نام خانوادگی'), field:"lastName", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"کدملی",visible:handleGSC('کدملی'), field:"nationalCode", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"تلفن همراه",visible:handleGSC('تلفن همراه'), field:"phone", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"حقوق ثابت", visible:handleGSC('حقوق ثابت'),field:"salary", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:1,headerFilter:"input",headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true},
                    formatter:function(cell){
                        var selected = cell.getValue()?'دارد':'ندارد'
                        return selected}
                },
                {title:"گروه حقوق",visible:handleGSC('گروه حقوق'), field:"salaryGroup", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"فرزند",visible:handleGSC('فرزند'), field:"childern", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:1,headerFilter:"input"},
                {title:"معافیت",visible:handleGSC('معافیت'), field:"freetaxe", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:1,headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false,formatter:function(cell){return '%'+cell.getValue()}},
                {title:"حق بیمه پرسنل",visible:handleGSC('حق بیمه پرسنل'), field:"insureWorker", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:1,headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false,formatter:function(cell){return '%'+cell.getValue()}},
                {title:"حق بیمه کارفرما",visible:handleGSC('حق بیمه کارفرما'), field:"insureEmployer", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:1,headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false,formatter:function(cell){return '%'+cell.getValue()}},
                {title:"فعال",visible:handleGSC('فعال'), field:"active", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true},
                    formatter:function(cell){
                        var selected = cell.getValue()?'دارد':'ندارد'
                        return selected},
                },
                {title:"ویرایش",visible:handleGSC('ویرایش'), field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setConsultant(data)
                        setAddElement(true)
                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">ویرایش</div>'}
                },
                {title:"حذف",visible:handleGSC('حذف'), field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerMenu: headerMenu,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setDataDel({data:data.nationalCode,msg:'ایا از حذف "'+data['fristName'] + ' ' + data['lastName']+'" مطمعن هستید؟'})
                    },
                    formatter:function(e,cell){
                        return '<div className="TblBtnDynEdt">حذف</div>'
                    }
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


    const verificationCode = () =>{
        if(consultantState.phone.length!=11){setMsg('لطفا شماره همراه را به صورت صحیح وارد کنید')
        }else if(consultantState.phone[0]!='0'){setMsg('لطفا شماره همراه را به صورت صحیح وارد کنید')
        }else if(consultantState.phone[1]!='9'){setMsg('لطفا شماره همراه را به صورت صحیح وارد کنید')
        }else if(consultantState.fristName==''){setMsg('لطفا نام را به صورت صحیح وارد کنید')
        }else if(consultantState.lastName==''){setMsg('لطفا نام خانوادگی را به صورت صحیح وارد کنید')
        }else if(consultantState.nationalCode.length>10){setMsg('لطفا کدملی را به صورت صحیح وارد کنید')
        }else if(consultantState.nationalCode.length<10){setMsg('لطفا کدملی را به صورت صحیح وارد کنید')
        }else if(consultantState.employment==''){setMsg('لطفا تاریخ را به صورت صحیح وارد کنید')
        }else{
            handleApplyCunsoltant()
        }
    }


    const handleApplyCunsoltant = () =>{
            axios({method:'POST',url:OnRun+'/management/cunsoltant',data:{cookie:LginKy,cunsoltant:consultantState}
            }).then(response=>{
                if(response.data.replay){
                    setMsg('ثبت شده')
                    setConsultant({fristName:'',lastName:'',nationalCode:'',gender:'آقا',phone:'',code:'',salary:false,childern:0,freetaxe:0,salaryGroup:'',insureWorker:'',insureEmployer:''})
                    setCode('')
                    getCunsoltant()
                }else{
                    setMsg(response.data.msg)
                    setConsultant({fristName:'',lastName:'',nationalCode:'',gender:'آقا',phone:'',code:'',salary:false,childern:0,freetaxe:0,salaryGroup:'',insureWorker:'',insureEmployer:''})
                    setCode('')
                    getCunsoltant()
                }
            }).catch(error=>{
                setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
            })

    }

    const getGroupSalary = () =>{
        axios({method:'POST',url:OnRun+'/management/getgroupsalary',data:{cookie:LginKy}
        }).then(response=>{
            if(response.data.replay){
                setGroupSalary(response.data.df)
                setConsultant({...consultantState,salaryGroup:response.data.df[0]})
            }else{
                setMsg(response.data.msg)
            }
        })
    }

    const getCunsoltant = () =>{
        axios({method:'POST',url:OnRun+'/management/getcunsoltant', data:{cookie:LginKy,FilterActive:FilterActive,integration:false}
        }).then(response=>{
            if(response.data.replay){
                setConsultantDf(response.data.df)
            }else{
                setConsultantDf(null)
            }
        }).catch(error=>{
            setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
        })
    }

    const delCunsoltant = (nationalCode) =>{
        axios({method:'POST',url:OnRun+'/management/delcunsoltant',data:{cookie:LginKy,nationalCode:nationalCode}
        }).then(response=>{
            if(response.data.replay){
                getCunsoltant()
            }else{
                setMsg(response.data.msg)
            }
        }).catch(error=>{
            setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
        })
    }

    useEffect(verificationCookie,[LginKy])
    useEffect(getCunsoltant,[FilterActive])
    useEffect(getGroupSalary,[])


    return(
        <div className="PgLine"> 
            <Alarm msg={msg} smsg={setMsg}/>
            <Del dataDel={dataDel} setDataDel={setDataDel} fnc={delCunsoltant}/>
            <div className="FrmTbl">
                {AddElement?
                <div className="FormPlus">
                    {code==''?
                        <div className="FldPlus">
                            <label>
                                <p>نام</p>
                                <input value={consultantState.fristName} onChange={(e)=>setConsultant({...consultantState,fristName:e.target.value})}/>
                            </label>
                            <label>
                                <p>نام خانوادگی</p>
                                <input value={consultantState.lastName} onChange={(e)=>setConsultant({...consultantState,lastName:e.target.value})}/>
                            </label>
                            <label>
                                <p>کدملی</p>
                                <input value={consultantState.nationalCode} onChange={(e)=>setConsultant({...consultantState,nationalCode:e.target.value})}/>
                            </label>
                            <label>
                                <p>جنسیت</p>
                                <select value={consultantState.gender} onChange={(e)=>setConsultant({...consultantState,gender:e.target.value})}>
                                    <option>آقا</option>
                                    <option>خانم</option>
                                    <option>حقوقی</option>
                                </select>
                            </label>
                            <label>
                                <p>شماره همراه</p>
                                <input value={consultantState.phone} onChange={(e)=>setConsultant({...consultantState,phone:e.target.value})}/>
                            </label>
                            <label>
                                <p>حقوق ثابت</p>
                                <input type='checkbox' value={consultantState.salary} onChange={(e)=>setConsultant({...consultantState,salary:!consultantState.salary})}/>
                            </label>
                            <label>
                                <p>تعداد فرزند</p>
                                <input type='number' value={consultantState.childern} onChange={(e)=>setConsultant({...consultantState,childern:e.target.value})}/>
                            </label>
                            <label>
                                <p>معافیت مالیاتی</p>
                                <div className="subLbl">
                                    <span>%</span>
                                    <input type='number' value={consultantState.freetaxe} onChange={(e)=>setConsultant({...consultantState,freetaxe:e.target.value})}/>
                                </div>
                            </label>
                            <label>
                                <p>گروه حقوق و دستمزد</p>
                                <select value={consultantState.salaryGroup} onChange={(e)=>setConsultant({...consultantState,salaryGroup:e.target.value})}>
                                    {groupSalary==null?null:
                                        groupSalary.map(i=>{
                                            return(
                                                <option key={i}>{i}</option>
                                            )
                                        })
                                    }
                                </select>
                            </label>
                            <label>
                                <p>سهم بیمه پرسنل</p>
                                <div className="subLbl">
                                    <span>%</span>
                                    <input type='number' value={consultantState.insureWorker} onChange={(e)=>setConsultant({...consultantState,insureWorker:e.target.value})}></input>
                                </div>
                            </label>
                            <label>
                                <p>سهم بیمه کارفرما</p>
                                <div className="subLbl">
                                    <span>%</span>
                                    <input type='number' value={consultantState.insureEmployer} onChange={(e)=>setConsultant({...consultantState,insureEmployer:e.target.value})}></input>
                                </div>
                            </label>
                            <label>
                                <p>وضعیت اشتغال</p>
                                <select value={consultantState.active} onChange={(e)=>setConsultant({...consultantState,active:e.target.value})}>
                                    <option value={true}>فعال</option>
                                    <option value={false}>غیرفعال</option>
                                </select>
                            </label>
                        </div>
                    :
                        <div className="FldPlus">
                            <label>
                                <p>کد تایید</p>
                                <input value={consultantState.code} onChange={(e)=>setConsultant({...consultantState,code:e.target.value})}/>
                            </label>
                        </div>
                    }
                    {code==''?
                        <div className="BtnBx">
                            <button className="AplBtn" onClick={verificationCode}>تایید</button>
                            <button className="CnlBtn" onClick={()=>setAddElement(false)}>لغو</button>
                        </div>
                    :
                    <div className="BtnBx">
                        <button className="AplBtn" onClick={handleApplyCunsoltant}>ثبت</button>
                        <button className="CnlBtn" onClick={()=>setAddElement(false)}>لغو</button>
                    </div>
                    }
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
                            <div className="BtnTools" onClick={getCunsoltant}>
                                <span><IoRefreshSharp/><p>بارگذاری</p></span>
                            </div>
                            <div className="BtnTools">
                                <span><IoInformationCircleOutline/><p>راهنما</p></span>
                            </div>
                            <div className="BtnTools" onClick={()=>setAddElement(!AddElement)}>
                                <span><IoAddCircleOutline/><p>افزودن</p></span>
                            </div>
                            <div className="BtnTools">
                                <p>اشتغال</p>
                                <select value={FilterActive} onChange={(e)=>setFilterActive(e.target.value)}>
                                    <option value={true}>دارد</option>
                                    <option value={false}>ندارد</option>
                                    <option value={'all'}>همه</option>
                                </select>                                
                            </div>
                        </div>
                    </div>
                    <div id="data-table"></div>
                </div>
            </div>
        </div>
    )
}


export default Consultant