

const Alarm = (props) =>{
    if(props.msg!=''){
        return(
            <div className="Alram">
                <p>{props.msg}</p>
                <button onClick={()=>props.smsg('')}>تایید</button>
            </div>
        )
    }
}

export default Alarm