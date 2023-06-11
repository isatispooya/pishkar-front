import { DatePickerToInt } from "./Date"
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { useState } from "react"
import { setCookie , getCookie} from "../componet/cookie"
import { useEffect } from "react"

const Fotter = (props) =>{

    const CookieTState = () =>{
        if(props.datePeriod==''){
            var cookie = getCookie('datePeriod')
            if(cookie.length>0){
                props.setDatePeriod(JSON.parse(cookie))
            }
        }
    }

    const handleDate = (date) =>{
        props.setDatePeriod({Show:DatePickerToInt(date),date:date})
        setCookie('datePeriod',JSON.stringify({Show:DatePickerToInt(date),date:date}),10)
    }

    useEffect(CookieTState,[])

    return(
        <div className="Footer">
            <label>
                <p>دوره کار</p>
                {<DatePicker inputClass="InpBsc" onlyMonthPicker calendar={persian} locale={persian_fa} value={props.datePeriod.date} onChange={handleDate} />}
            </label>
        </div>
    )
}

export default Fotter