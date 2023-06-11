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

const Insurer = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [insurerList, setInsurerList] = useState(null)
    const [AddElement, setAddElement] = useState(false)
    const [loaderAct, setLoaderAct] = useState(false)
    const [dataDel ,setDataDel] = useState(false)

    const [columns, setColumns] = useState({
        'بیمه گر':'',
        'نام':'',
        'بيمه گذار':'بيمه گذار',
        'تاریخ صدور بیمه نامه':'تاریخ صدور بیمه نامه',
        ' كارمزد تعديلي پرداخت شده در محاسبه هاي قبل':' كارمزد تعديلي پرداخت شده در محاسبه هاي قبل',
        'رشته':'رشته',
        'شرح':'شرح',
        'شماره بيمه نامه':'شماره بيمه نامه',
        'عوارض ارزش افزوده':'عوارض ارزش افزوده',
        'كارمزد تعديلي قابل پرداخت':'كارمزد تعديلي قابل پرداخت',
        'كارمزد قابل پرداخت':'كارمزد قابل پرداخت',
        'كارمزد پرداخت شده در محاسبه هاي قبل':'كارمزد پرداخت شده در محاسبه هاي قبل',
        'ماليات':'ماليات',
        'ماليات ارزش افزوده':'ماليات ارزش افزوده',
        'مبلغ تسويه شده':'مبلغ تسويه شده ',
        'مبلغ كل':'مبلغ كل',
        'مورد بیمه':'مورد بیمه',
        'هزينه صدور قابل پرداخت':'هزينه صدور قابل پرداخت',
        'هزينه صدور پرداخت شده در محاسبه هاي قبل':'هزينه صدور پرداخت شده در محاسبه هاي قبل',
        'هزینه صدور تعدیلی پرداخت شده در محاسبه های قبل':'هزینه صدور تعدیلی پرداخت شده در محاسبه های قبل',
        'هزینه صدورتعدیلی پرداخت شده':'هزینه صدورتعدیلی پرداخت شده',
        'واحد صدور':'واحد صدور',
        'کارمزد تشویقی قابل پرداخت':'کارمزد تشویقی قابل پرداخت',
        'کارمزد تشویقی پرداخت شده در محاسبه های قبل':'کارمزد تشویقی پرداخت شده در محاسبه های قبل',
        'کل مبلغ وصول شده':'کل مبلغ وصول شده',
        'کل هزینه صدور تعدیلی محاسبه شده':'کل هزینه صدور تعدیلی محاسبه شده',
        'کل هزینه صدور محاسبه شده':'کل هزینه صدور محاسبه شده',
        'کل کارمزد تشویقی محاسبه شده':'کل کارمزد تشویقی محاسبه شده',
        'کل کارمزد تعدیلی محاسبه شده':'کل کارمزد تعدیلی محاسبه شده',
        'کل کارمزد محاسبه شده':'کل کارمزد محاسبه شده',
    })
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})

    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    if(insurerList!=null){
        var table = new Tabulator("#data-table", {
            data:insurerList,
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
                {title:"بیمه گر", field:"بیمه گر", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"نام", field:"نام", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"حذف", field:"", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:1,
                    cellClick:function(e, cell){
                        let row = cell.getRow()
                        let data = row.getData()
                        setDataDel({data:data['نام'],msg:'ایا از حذف "'+data['نام']+'" مطمعن هستید؟'})

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
        setLoaderAct(true)
        axios({method:'POST',url:OnRun+'/management/getinsurer', data:{cookie:LginKy}
        }).then(response=>{
            setLoaderAct(false)
            setInsurerList(response.data.list)
        })
    }
    const delInsurer = (name) =>{
        axios({method:'POST',url:OnRun+'/management/delinsurer',data:{cookie:LginKy,name:name}
        }).then(response=>{
            if(response.data.replay){
                getInsurer()
                setMsg('انجام شده')
            }
        })
    }

    const handleAddInsurer = () =>{
        var emptyFild = null
        for(var x in columns){
            if(columns[x]==''){
                emptyFild = x
            }
        }
        if (emptyFild!=null){
            setMsg('لطفا '+emptyFild+' را تکمیل کنید')
        }else{
            axios({method:'POST',url:OnRun+'/management/addinsurer',data:{cookie:LginKy,insurer:columns}
            }).then(response=>{
                setMsg(response.data.msg)
                getInsurer()
            })
        }

    }

    useEffect(verificationCookie,[LginKy])
    useEffect(getInsurer,[])

    return(
        <div className="PgLine">
            <Alarm msg={msg} smsg={setMsg}/>
            <Loader enable={loaderAct}/>
            <Del dataDel={dataDel} setDataDel={setDataDel} fnc={delInsurer}/>

            <div className="FrmTbl">
                {AddElement?
                <div className="FormPlus">
                    <div className="FldPlus">
                        <label>
                            <p>بیمه گر</p>
                            <input value={columns['بیمه گر']} onChange={e=>{setColumns({...columns,'بیمه گر':e.target.value})}}/>
                        </label>
                       <label>
                            <p>نام</p>
                            <input value={columns['نام']} onChange={e=>{setColumns({...columns,'نام':e.target.value})}}/>
                        </label>
                        <label>
                            <p>بيمه گذار</p>
                            <input value={columns['بيمه گذار']} onChange={e=>{setColumns({...columns,'بيمه گذار':e.target.value})}}/>
                        </label>
                        <label>
                            <p>تاریخ صدور بیمه نامه</p>
                            <input value={columns['تاریخ صدور بیمه نامه']} onChange={e=>{setColumns({...columns,'تاریخ صدور بیمه نامه':e.target.value})}}/>
                        </label>
                        <label>
                            <p>رشته</p>
                            <input value={columns['رشته']} onChange={e=>{setColumns({...columns,'رشته':e.target.value})}}/>
                        </label>
                        <label>
                            <p>شرح</p>
                            <input value={columns['شرح']} onChange={e=>{setColumns({...columns,'شرح':e.target.value})}}/>
                        </label>
                        <label>
                            <p>شماره بيمه نامه</p>
                            <input value={columns['شماره بيمه نامه']} onChange={e=>{setColumns({...columns,'شماره بيمه نامه':e.target.value})}}/>
                        </label>
                        <label>
                            <p>عوارض ارزش افزوده</p>
                            <input value={columns['عوارض ارزش افزوده']} onChange={e=>{setColumns({...columns,'عوارض ارزش افزوده':e.target.value})}}/>
                        </label>
                        <label>
                            <p>كارمزد تعديلي قابل پرداخت</p>
                            <input value={columns['كارمزد تعديلي قابل پرداخت']} onChange={e=>{setColumns({...columns,'كارمزد تعديلي قابل پرداخت':e.target.value})}}/>
                        </label>
                        <label>
                            <p>كارمزد قابل پرداخت</p>
                            <input value={columns['كارمزد قابل پرداخت']} onChange={e=>{setColumns({...columns,'كارمزد قابل پرداخت':e.target.value})}}/>
                        </label>
                        <label>
                            <p>كارمزد پرداخت شده در محاسبه هاي قبل</p>
                            <input value={columns['كارمزد پرداخت شده در محاسبه هاي قبل']} onChange={e=>{setColumns({...columns,'كارمزد پرداخت شده در محاسبه هاي قبل':e.target.value})}}/>
                        </label>
                        <label>
                            <p>ماليات</p>
                            <input value={columns['ماليات']} onChange={e=>{setColumns({...columns,'ماليات':e.target.value})}}/>
                        </label>
                        <label>
                            <p>ماليات ارزش افزوده</p>
                            <input value={columns['ماليات ارزش افزوده']} onChange={e=>{setColumns({...columns,'ماليات ارزش افزوده':e.target.value})}}/>
                        </label>
                        <label>
                            <p>مبلغ تسويه شده</p>
                            <input value={columns['مبلغ تسويه شده']} onChange={e=>{setColumns({...columns,'مبلغ تسويه شده':e.target.value})}}/>
                        </label>
                        <label>
                            <p>مبلغ كل</p>
                            <input value={columns['مبلغ كل']} onChange={e=>{setColumns({...columns,'مبلغ كل':e.target.value})}}/>
                        </label>
                        <label>
                            <p>مورد بیمه</p>
                            <input value={columns['مورد بیمه']} onChange={e=>{setColumns({...columns,'مورد بیمه':e.target.value})}}/>
                        </label>
                        <label>
                            <p>هزينه صدور قابل پرداخت</p>
                            <input value={columns['هزينه صدور قابل پرداخت']} onChange={e=>{setColumns({...columns,'هزينه صدور قابل پرداخت':e.target.value})}}/>
                        </label>
                        <label>
                            <p>هزينه صدور پرداخت شده در محاسبه هاي قبل</p>
                            <input value={columns['هزينه صدور پرداخت شده در محاسبه هاي قبل']} onChange={e=>{setColumns({...columns,'هزينه صدور پرداخت شده در محاسبه هاي قبل':e.target.value})}}/>
                        </label>
                        <label>
                            <p>هزینه صدور تعدیلی پرداخت شده در محاسبه های قبل</p>
                            <input value={columns['هزینه صدور تعدیلی پرداخت شده در محاسبه های قبل']} onChange={e=>{setColumns({...columns,'هزینه صدور تعدیلی پرداخت شده در محاسبه های قبل':e.target.value})}}/>
                        </label>
                        <label>
                            <p>هزینه صدورتعدیلی پرداخت شده</p>
                            <input value={columns['هزینه صدورتعدیلی پرداخت شده']} onChange={e=>{setColumns({...columns,'هزینه صدورتعدیلی پرداخت شده':e.target.value})}}/>
                        </label>
                        <label>
                            <p>واحد صدور</p>
                            <input value={columns['واحد صدور']} onChange={e=>{setColumns({...columns,'واحد صدور':e.target.value})}}/>
                        </label>
                        <label>
                            <p>کارمزد تشویقی قابل پرداخت</p>
                            <input value={columns['کارمزد تشویقی قابل پرداخت']} onChange={e=>{setColumns({...columns,'کارمزد تشویقی قابل پرداخت':e.target.value})}}/>
                        </label>
                        <label>
                            <p>کارمزد تشویقی پرداخت شده در محاسبه های قبل</p>
                            <input value={columns['کارمزد تشویقی پرداخت شده در محاسبه های قبل']} onChange={e=>{setColumns({...columns,'کارمزد تشویقی پرداخت شده در محاسبه های قبل':e.target.value})}}/>
                        </label>
                        <label>
                            <p>کل مبلغ وصول شده</p>
                            <input value={columns['کل مبلغ وصول شده']} onChange={e=>{setColumns({...columns,'کل مبلغ وصول شده':e.target.value})}}/>
                        </label>
                        <label>
                            <p>کل هزینه صدور تعدیلی محاسبه شده</p>
                            <input value={columns['کل هزینه صدور تعدیلی محاسبه شده']} onChange={e=>{setColumns({...columns,'کل هزینه صدور تعدیلی محاسبه شده':e.target.value})}}/>
                        </label>
                        <label>
                            <p>کل هزینه صدور محاسبه شده</p>
                            <input value={columns['کل هزینه صدور محاسبه شده']} onChange={e=>{setColumns({...columns,'کل هزینه صدور محاسبه شده':e.target.value})}}/>
                        </label>
                        <label>
                            <p>کل کارمزد تشویقی محاسبه شده</p>
                            <input value={columns['کل کارمزد تشویقی محاسبه شده']} onChange={e=>{setColumns({...columns,'کل کارمزد تشویقی محاسبه شده':e.target.value})}}/>
                        </label>
                        <label>
                            <p>کل کارمزد تعدیلی محاسبه شده</p>
                            <input value={columns['کل کارمزد تعدیلی محاسبه شده']} onChange={e=>{setColumns({...columns,'کل کارمزد تعدیلی محاسبه شده':e.target.value})}}/>
                        </label>
                        <label>
                            <p>کل کارمزد محاسبه شده</p>
                            <input value={columns['کل کارمزد محاسبه شده']} onChange={e=>{setColumns({...columns,'کل کارمزد محاسبه شده':e.target.value})}}/>
                        </label>
                    </div>
                    <div className="BtnBx">
                        <button className="AplBtn" onClick={handleAddInsurer}>تایید</button>
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
                            <div className="BtnTools" onClick={getInsurer}>
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

export default Insurer