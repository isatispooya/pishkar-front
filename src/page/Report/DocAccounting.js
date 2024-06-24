import { BsFileEarmarkSpreadsheetFill, BsFillFilePdfFill } from "react-icons/bs"
import { IoInformationCircleOutline, IoRefreshSharp } from "react-icons/io5"
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../../componet/exportPdf"
import { useState } from "react";
import axios from "axios";
import { OnRun } from "../../config/config";
import { getCookie } from "../../componet/cookie";

import "react-multi-date-picker/styles/layouts/mobile.css"

import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import Alarm from "../../componet/Alarm";



const DocAccounting = () => {
    const [date, setDate] = useState(null)
    const [df, setDf] = useState(null)
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')

    window.XLSX = XLSX;

    const GetDf = () => {
        axios.post(OnRun + '/report/docaccounting', { cookie: LginKy, date:date})
            .then(response => {
                if (response.data.reply) {
                    setDf(response.data.df)
                } else {
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
            columns: [
                { title: "کد", field: "code", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 40, headerFilter: "input" },
                { title: "شرح", field: "discription", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 100, headerFilter: "input", },
                { title: "بدهکار", field: "bede", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 40, headerFilter: "input", formatter: function (cell) { return Number(cell.getValue()).toLocaleString() } },
                { title: "بستانکار", field: "bestan", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 40, headerFilter: "input", formatter: function (cell) { return Number(cell.getValue()).toLocaleString() } },
                { title: "5", field: "1", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 1,},
                { title: "6", field: "2", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 1,},
                { title: "7", field: "3", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 1,},
                { title: "8", field: "4", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 1,},
                { title: "9", field: "4", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 1,},
                { title: "10", field: "9", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 1,},
                { title: "11", field: "9", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 1,},
                { title: "12", field: "9", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 1,},
                { title: "13", field: "9", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 1,},
                { title: "14", field: "9", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 1,},
                { title: "15", field: "9", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 1,},
                { title: "شرح لاتین", field: "latin", hozAlign: 'center', headerHozAlign: 'center', resizable: true, widthGrow: 40, headerFilter: "input"},
            ],
        })
    }



    return (
        <div className="PgLine">
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
                            <div className="Btndate">
                                <DatePicker
                                  headerOrder={["MONTH_YEAR", "LEFT_BUTTON", "RIGHT_BUTTON"]} 
                                  monthYearSeparator="|"
                                  className="rmdp-mobile"

                                    calendar={persian}
                                    locale={persian_fa}
                                    value={date}
                                    onChange={(dt) => setDate(dt)}
                                />
                            </div>
                        </div>
                    </div>
                    <div id="data-table"></div>
                </div>
            </div>
        </div>
    )

}



export default DocAccounting