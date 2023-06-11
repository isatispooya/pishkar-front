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
import Loader from "../componet/Loader"
import Del from "../componet/del"


const CustomersManual = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [Comp , setComp] = useState('')
    const [insurer , setInsurer] = useState(null)
    const [doc , setDoc] = useState({'بيمه گذار':'','کد':'','کد ملي بيمه گذار':'','تلفن همراه':'','آدرس':''})
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [Df, setDf]= useState(null)
    const [AddElement, setAddElement] = useState(false)
    const [loaderAct, setLoaderAct] = useState(false)
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
                {title:"بیمه گر", field:"comp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"بيمه گذار", field:"name", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"کد", field:"code", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"کد ملي", field:"کد ملي بيمه گذار", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"تلفن همراه", field:"تلفن همراه", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"آدرس", field:"آدرس", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"ویرایش", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setComp(data.comp)
                        setDoc({'بيمه گذار':data['name'],'کد':data['code'],'کد ملي بيمه گذار':data['کد ملي بيمه گذار'],'تلفن همراه':data['تلفن همراه'],'آدرس':data['آدرس']})
                        setAddElement(true)
                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">ویرایش</div>'}
                },
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                    cellClick:function(e, cell){
                        let row = cell.getRow();
                        let data = row.getData();
                        setDataDel({data:data,msg:'ایا از حذف "'+data['name']+'" مطمعن هستید؟'})

                    },
                    formatter:function(e,cell){return '<div className="TblBtnDynEdt">حذف</div>'}
                },
            ]
        })
    }


    const Edite = () =>{
        if(doc['بيمه گذار'].length<=4){setMsg('لطفا "بيمه گذار" را کامل کنید')
        }else if(doc['کد'].length==0){setMsg('لطفا "کد در شرکت بیمه" را کامل کنید')
        }else if(doc['کد ملي بيمه گذار'].length<10){setMsg('لطفا "کد ملي بيمه گذار" را بصورت صحیح وارد کنید')
        }else if(doc['تلفن همراه'].length!=11){setMsg('لطفا "تلفن همراه" را بصورت صحیح وارد کنید')
        }else if(doc['آدرس'].length==0){setMsg('لطفا "آدرس" را کامل کنید')
        }else{
            axios({method:'POST',url:OnRun+'/customers/edit',data:{cookie:LginKy, Comp:Comp, doc:doc}          
            }).then(response=>{
                setAddElement(false)
                if(response.data.replay){
                    getCustomerManual()
                }else{
                    setMsg(response.data.msg)
                }
            })
        }
    }


    const getCustomerManual = () =>{
        setLoaderAct(true)
        axios({method:'POST',url:OnRun+'/customers/customermanual', data:{cookie:LginKy,}
        }).then(response=>{
            if(response.data.replay){
                setDf(response.data.df)
            }else{
                setMsg(response.data.msg)
            }
            setLoaderAct(false)
        })
    }


    const DelFnc = (dict) =>{
        axios({method:'POST',url:OnRun+'/customers/delcustomermanual', data:{cookie:LginKy, dict:dict}
        }).then(response=>{
            if(response.data.replay){
                setMsg('حذف شد')
                getCustomerManual()
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
    useEffect(getCustomerManual,[])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Loader enable={loaderAct}/>
            <Del dataDel={dataDel} setDataDel={setDataDel} fnc={DelFnc}/>

            <div className="FrmTbl">
            {AddElement?
                <div className="FormPlus">
                    <div className="FldPlus">
                        {
                            insurer==null?null:
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
                            <p>بیمه گذار</p>
                            <input value={doc["بيمه گذار"]} onChange={e=>{setDoc({...doc,'بيمه گذار':e.target.value})}}/>
                        </label>
                        <label>
                            <p>کد در شرکت بیمه</p>
                            <input value={doc["کد"]} onChange={e=>{setDoc({...doc,'کد':e.target.value})}}/>
                        </label>
                        <label>
                            <p>کد ملی</p>
                            <input value={doc["کد ملي بيمه گذار"]} onChange={e=>{setDoc({...doc,'کد ملي بيمه گذار':e.target.value})}}/>
                        </label>
                        <label>
                            <p>آدرس</p>
                            <input value={doc["آدرس"]} onChange={e=>{setDoc({...doc,'آدرس':e.target.value})}}/>
                        </label>
                        <label>
                            <p>تلفن همراه</p>
                            <input value={doc["تلفن همراه"]} onChange={e=>{setDoc({...doc,'تلفن همراه':e.target.value})}}/>
                        </label>
                    </div>
                    <div className="BtnBx">
                        <button className="AplBtn" onClick={Edite}>تایید</button>
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
                            <div className="BtnTools" onClick={getCustomerManual}>
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


export default CustomersManual