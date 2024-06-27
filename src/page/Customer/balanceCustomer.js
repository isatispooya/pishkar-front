import { useState } from "react"
import Alarm from "../../componet/Alarm"
import { BsFileEarmarkSpreadsheetFill, BsFillFilePdfFill } from "react-icons/bs"
import { IoInformationCircleOutline, IoRefreshSharp } from "react-icons/io5"
import { getCookie } from "../../componet/cookie"
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../../componet/exportPdf"
import axios from "axios"
import { OnRun } from "../../config/config"
import Loader from "../../componet/Loader"

const BalanceCustomer = () =>{
    const [msg, setMsg] = useState('')
    const [loaderAct, setLoaderAct] = useState(false)
    const [Codemoeen, setCodemoeen] = useState("03")

    const [df, setDf] = useState(null)
    const LginKy = getCookie('LginKy')
    window.XLSX = XLSX;


    const GetDf = () => {
        setLoaderAct(true)
        axios.post(OnRun + '/coustomer/balance', { cookie: LginKy,code:Codemoeen })
            .then(response => {
               
        
                setLoaderAct(false)
                if (response.data.reply) {
                    setDf(response.data.df)
              

                    
                }
                else {
                    setMsg(response.data.msg)
                }
              
        })
    }
 

    if (df != null) {
        var table = new Tabulator("#data-table", {
            data: df,
            layout: "fitColumns",
            responsiveLayout: true,
            columnHeaderSortMulti: true,
            pagination: "local",
            paginationSize: 1000,
            paginationSizeSelector: [5, 10, 25, 50, 100, 200,1000],
            movableColumns: true,
            layoutColumnsOnNewData: false,
            textDirection: "rtl",
            autoResize: false,
            dataTree:true,
            dataTreeStartExpanded:false,
            columns: [
                { title: "کد", field: "Acc_Code", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 15, headerFilter: "input" },
                { title: "نام و نام خانوادگی", field: "Name", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 30, headerFilter: "input" },
                { title: "بدهکار", field: "Bede", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 15, formatter: function (cell) { return Number(cell.getValue()).toLocaleString() } },
                { title: "بستانکار", field: "Best", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 15, formatter: function (cell) { return Number(cell.getValue()).toLocaleString() } },
                { title: " مانده بدهکار", field: "balance_bede", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 15, formatter: function (cell) { return Number(cell.getValue()).toLocaleString() } },
                { title: "مانده بستانکار", field: "balance_best", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 15, formatter: function (cell) { return Number(cell.getValue()).toLocaleString() } },
                { title: "تاریخ", field: "date", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 10 },
                { title: "آتی", field: "LtnComm", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 10, formatter: function (cell) { return Number(cell.getValue()).toLocaleString() } },
                { title: "مانده تعدیلی", field: "balanceAdjust", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 15, formatter: function (cell) { return Number(cell.getValue()).toLocaleString() } },
                { title: "موبایل", field: "Mobile", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 10, headerFilter: "input" },
               
            ],
        })
    }
   
    return(
        <div className="PgLine">
            <Loader enable={loaderAct} />
            <Alarm msg={msg} smsg={setMsg}/>
            <div className="FrmTbl">
                <div className="TblPlus">
                    <div className="TblTools">
                        <div className="LeftTls">
                            <div className="BtnTools TlsDwnld" onClick={() => { table.download("xlsx", "data.xlsx") }}>
                                <span><BsFileEarmarkSpreadsheetFill /></span>
                                <span>خروجی اکسل</span>
                            </div>
                            <div className="BtnTools TlsDwnld" onClick={exportPdf}>
                                <span><BsFillFilePdfFill /></span>
                                <span>خروجی پی دی اف</span>
                            </div>
                        </div>
                        <div className="RightTls">
                            <div className="BtnTools" onClick={GetDf}>
                                <span><IoRefreshSharp /><p>بارگذاری</p></span>
                            </div>
                            <div className="BtnTools">
                                <span><IoInformationCircleOutline /><p>راهنما</p></span>
                            </div>
                            <div className="BtnTools" >
                                <p>کدمعین </p>

                                <select  value={Codemoeen} onChange={(e) => setCodemoeen(e.target.value)}>
                                                
                                                    <option  value="01">01</option>
                                                    <option  value="02">02</option>
                                                    <option  value="03">03</option>
                                                    <option  value="04">04</option>
                                                    <option  value="05">05</option>
                                                    <option  value="06">06</option>
                                                    <option  value="07">07</option>
                                                    <option  value="08">08</option>
                                                    <option  value="09">09</option>
                                                
                                        
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


export default BalanceCustomer