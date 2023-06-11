



const Del = (props) =>{
    const actDel = () =>{
        props.fnc(props.dataDel.data)
        props.setDataDel(false)
    }
    if(props.dataDel){
        return(
            <div className="Alram">
                <p>{props.dataDel.msg}</p>
                <button onClick={actDel}>تایید</button>
                <button className="cancel" onClick={()=>props.setDataDel(false)}>لغو</button>
            </div>
        )
    }

}


export default Del