import { IoWarningOutline } from "react-icons/io5";
const NoAccess = () =>{
    return(
        <div className="NoAccess">
            <span><IoWarningOutline/></span>
            <h1>دسترسی به این بخش امکان پذیر نیست</h1>
        </div>
    )
}

export default NoAccess