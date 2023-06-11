
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { useEffect, useState } from "react"

const FromToDate = (props) =>{
    var dateNow = new Date()


    const [from, setFrom] = useState(new Date(dateNow.getFullYear(), dateNow.getMonth() - 1, dateNow.getDate()).getTime())
    const [to, setTo] = useState(new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()).getTime())

    console.log(dateNow.getDate())

    useEffect(()=>props.setDate({from:from, to:to}),[from, to])

    return(
        <div className="Fld-FT">
            <label>
                <p>از تاریخ</p>
                <DatePicker inputClass="InpBsc" calendar={persian} locale={persian_fa} value={from} onChange={setFrom} />
            </label>
            <label>
                <p>تا تاریخ</p>
                <DatePicker inputClass="InpBsc" calendar={persian} locale={persian_fa} value={to} onChange={setTo} />
            </label>
        </div>
    )
}

export default FromToDate