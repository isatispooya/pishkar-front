import { BsFileEarmarkSpreadsheetFill, BsFillFilePdfFill } from "react-icons/bs"
import { IoInformationCircleOutline, IoRefreshSharp } from "react-icons/io5"
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { exportPdf } from "../../componet/exportPdf"
import { useState } from "react";
import axios from "axios";
import { OnRun } from "../../config/config";
import { getCookie } from "../../componet/cookie";
import { useContext } from "react";
import DateP from "../../componet/context";


const FeePerFild = () =>{
    const datePeriod = useContext(DateP)

    const [df, setDf] = useState(null)
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')



    const GetDf = () =>{
        axios.post(OnRun+'/report/feeperfild',{cookie:LginKy,datePeriod:datePeriod})
        .then(response=>{
            if(response.data.reply){
                setDf(response.data.df)
            }else{
                setMsg(response.data.msg)
            }
        })
    }



    if(df!=null){
        var table = new Tabulator("#data-table", {
            data:df,
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
                {title:"نام", field:"fristName", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"نام خانوادگی", field:"lastName", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"list", headerFilterParams:{valuesLookup:true, clearable:true}},
                {title:"کارمزد کل", field:"sum", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()} },                
                {title:"بیمه حوادث شخصی و درمان", field:"بیمه حوادث شخصی و درمان", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()} },                
                {title:"بیمه زندگی", field:"بیمه زندگی", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()} },
                {title:"بیمه مسئولیت", field:"بیمه مسئولیت", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()} },
                {title:"بیمه وسائط نقلیه موتوری", field:"بیمه وسائط نقلیه موتوری", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()} },
                {title:"دیگر", field:"other", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,headerFilter:"input",formatter:function(cell){return Number(cell.getValue()).toLocaleString()},bottomCalc:'sum',bottomCalcFormatter:function(cell){return Number(cell.getValue()).toLocaleString()} },
            ],
        })
    }



    return(
        <div className="PgLine">
            <div className="FrmTbl">
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
                            <div className="BtnTools" onClick={GetDf}>
                                <span><IoRefreshSharp/><p>بارگذاری</p></span>
                            </div>
                            <div className="BtnTools">
                                <span><IoInformationCircleOutline/><p>راهنما</p></span>
                            </div>
                        </div>
                    </div>
                    <div id="data-table"></div>
                </div>
            </div>       
        </div>
    )
}


export default FeePerFild