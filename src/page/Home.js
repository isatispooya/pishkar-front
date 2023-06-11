import { useState, useEffect } from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Alarm from "../componet/Alarm"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'

const Home = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [Phone, setPhone] = useState('')
    const [code, setCode] = useState(null)
    const [inpCode, setInpCode] = useState(null)
    const [ImgCaptcha, setImgCaptcha] = useState(null)
    const [img, setImg] = useState(null)
    const [CaptchaInp, setCaptchaInp] = useState('')
    const [reSendTimer, setReSendTimer] = useState(0)

    const Entery = () =>{
        if(Phone.length!=11){setMsg('لطفا شماره همراه را به صورت صحیح وارد کنید')
        }else if(Phone[0]!='0'){setMsg('لطفا شماره همراه را به صورت صحیح وارد کنید')
        }else if(Phone[1]!='9'){setMsg('لطفا شماره همراه را به صورت صحیح وارد کنید')
        }else if(ImgCaptcha!=CaptchaInp){setMsg('لطفا کپتچا را به صورت صحیح وارد کنید')
        }else{
            setReSendTimer(90)
            axios({method:'POST',url:OnRun+'/sing/verificationphone',
                data:{phone:Phone}
            }).then(response=>{
                if(response.data.replay){
                    setCode(response.data.code)
                }
            }).catch(error=>{
                setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
            })
        }
    }

    const reSend = () =>{
        if(Phone.length!=11){setMsg('لطفا شماره همراه را به صورت صحیح وارد کنید')
        }else if(Phone[0]!='0'){setMsg('لطفا شماره همراه را به صورت صحیح وارد کنید')
        }else if(Phone[1]!='9'){setMsg('لطفا شماره همراه را به صورت صحیح وارد کنید')
        }else{
            setReSendTimer(90)
            axios({method:'POST',url:OnRun+'/sing/verificationphone',
                data:{phone:Phone}
            }).then(response=>{
                if(response.data.replay){
                    setCode(response.data.code)
                }
            }).catch(error=>{
                setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
            })
        }
    }

    const verificationCode = (e) =>{
        setInpCode(e.target.value)
        if(e.target.value == code){
            axios({method:'POST',url:OnRun+'/sing/login',data:{phone:Phone}
            }).then(response=>{
                setCookie('LginKy',response.data.Cookie,14)
                setCode(0)
            }).catch(error=>{
                setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
            })
        }
    }

    const verificationCookie = () =>{
        if(LginKy.length>1){
            axios({method:'POST',url:OnRun+'/sing/cookie',data:{cookie:LginKy}
            }).then(response=>{
                console.log(response.data)
                if(response.data.replay){
                    native('/desk')
                }else{
                    setCookie('LginKy','',0)
                }
            }).catch(error=>{
                setMsg('اشکال در ارتباط با سرور لطفا مجددا تلاش کنید')
            })
        }
    }

    const getCaptcha = () =>{
        axios({method:'POST',url:OnRun+'/sing/captcha',data:{get:true}
        }).then(response=>{
            setImg(response.data.img)
            setImgCaptcha(response.data.cptcha)
        })
    }

    useEffect(verificationCookie,[code])
    useEffect(getCaptcha,[])

    useEffect(() => {
        reSendTimer > 0 && setTimeout(() => setReSendTimer(reSendTimer - 1), 1000);
      }, [reSendTimer]);

    return(
        <div className="HomePage">
            <img src="./img/backgrandhome.png"></img>
            <div className="brd">
                <div className="logo">
                    <img src="./img/fidiplogo.png"/>
                    <img className="prt1 prt" src="./img/logopart1.png"/>
                    <img className="prt2 prt" src="./img/logopart2.png"/>
                    <img className="prt3 prt" src="./img/logopart3.png"/>
                    <img className="prt4 prt" src="./img/logopart4.png"/>
                </div>
                <img src="./img/fidiptype.png"/>
                <h1>سیستم‌های یکپارچه مالی-مدیریتی کارگـــزاران و نمایندگان صنعت بیــــــمه</h1>
                <a href="https://fidip.ir">www.fidip.ir</a>
            </div>

            <Alarm msg={msg} smsg={setMsg}/>
            <div className="FrmLgin">
                {code==null?
                    <div className="inpnmb">
                        <h1>ورود به سامانه</h1>
                        <div>
                            <input placeholder="شماره همراه" type="number" pattern="[0-9]{10}" required value={Phone} onChange={(e)=>setPhone(e.target.value)}/>
                            <div className="captcha">
                                {img==null?null:<img src={`data:image/png;base64,${img}`}></img>}
                                <button onClick={getCaptcha}>جدید</button>
                            </div>
                            <input value={CaptchaInp} onChange={(e)=>setCaptchaInp(e.target.value)}/>
                            <button onClick={Entery}>ورود</button>
                        </div>
                        <p>کلیه حقوق  مربوط به شرکت توسعه اطلاعات مالی</p>
                        <p>ایساتیس پویا بوده و هرگونه نسخه‌برداری پیگرد</p>
                        <p>قانونی دارد</p>
                    </div>
                    :
                    <div className="inpnmb">
                        <h1>پیشـــــــــکار</h1>
                        <div>
                            <p>سامانه جامع کارگزاران و شعب بیمه</p>
                            <input key='code' placeholder="کد تایید" value={inpCode} type='number' onChange={(e)=>verificationCode(e)}/>
                            <div className="inpcd">
                                {reSendTimer>1?
                                    <div>
                                        <p>ثانیه</p>
                                        <p>{reSendTimer}</p>
                                    </div>:
                                    <p onClick={reSend}>ارسال مجدد</p>
                                }
                                <p onClick={()=>setCode(null)}>ویرایش شماره همراه</p>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Home