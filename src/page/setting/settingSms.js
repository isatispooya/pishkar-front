import { useState, useEffect ,useContext} from "react"
import { OnRun } from "../../config/config"
import axios from "axios"
import Alarm from "../../componet/Alarm"
import { setCookie , getCookie} from "../../componet/cookie"
import { useNavigate } from 'react-router-dom'
import DateP from "../../componet/context"
import { ToastContainer, toast } from 'react-toastify';
import { TiDelete } from "react-icons/ti";

const SettingSms = () =>{

    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState({address:"",company:"",email:"",limAccunt:"",limitDate:"",management:true,name:"",phone:"",phonework:"",registerdate:""})
    const [listSend , setListSend] = useState([])


    const addTren = () =>{
        setListSend(prevList => [...prevList, {'name':listSend.length+1,'prevDay':10,'time':18}])
    }

    const del = (tern) =>{
        const updatedArray = listSend.filter(item => item.name !== tern);
        setListSend(updatedArray);
    }

    const updatePrevDay = (name, value) => {
        if (value>0) {
            setListSend(prevList =>
              prevList.map(member => {
                if (member.name === name) {
                  return { ...member, prevDay: value };
                }
                return member;
              })
            );
        }
      };

      const updateTime = (name, value) => {
        if (value>0 && value<=24) {
            setListSend(prevList =>
              prevList.map(member => {
                if (member.name === name) {
                  return { ...member, time: value };
                }
                return member;
              })
            );
        }
      };

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


  

    const apply = () =>{
        axios.post(OnRun+'/management/setsettingsms',{cookie:LginKy,listSend:listSend})
            .then(response=>{
                if(response.data.replay){
                    toast.success('تنظیمات پیامک بروز شد',{position: toast.POSITION.BOTTOM_LEFT,className: 'postive-toast'});
                    
                }
            })
    }

    const getSettingSms = () =>{
        axios.post(OnRun+'/management/getsettingsms',{cookie:LginKy})
            .then(response=>{
                console.log(response.data)
                if (response.data.replay) {
                    setListSend(response.data.df)
                }
            })
    }





    useEffect(verificationCookie,[LginKy])
    useEffect(getSettingSms,[LginKy])

    return(
        <div className="PgLine">
            <ToastContainer autoClose={3000} />
            <div className="OnlyForm">
                <div className="Feild rowly">
                    <label className="ttl">
                        <p>نوبت</p>
                        <p>تعداد روز قبل از پایان</p>
                        <p>ساعت ارسال</p>
                    </label>
                    {
                        listSend.map(i=>{
                            return(
                                <label>
                                    <p>{i.name}</p>
                                    <div className="inpMrg">
                                        <input type='number' value={i.prevDay} onChange={e=>updatePrevDay(i.name,e.target.value)}/>
                                    </div>
                                    <div className="inpMrg">
                                        <input type='number' value={i.time} onChange={e=>updateTime(i.name,e.target.value)}/>
                                    </div>
                                    <div className="inpMrg">
                                        <p className="del" onClick={()=>del(i.name)}><TiDelete/></p>
                                    </div>
                                </label>
                            )
                        })
                    }
                </div>
                <button onClick={addTren}>افزودن</button>
                <button onClick={apply} >ثبت</button>
            </div>
        </div>
    )
}

export default SettingSms