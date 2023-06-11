import MiniLoader from "./miniLoader"

const Loader = (props) =>{
    if(props.enable){
        return(
            <div className="LoaderConteiner">
                <MiniLoader />
            </div>
        )
    }

}


export default Loader