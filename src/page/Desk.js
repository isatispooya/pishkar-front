import { useState, useEffect , createContext} from "react"
import { OnRun } from "../config/config"
import axios from "axios"
import Fotter from "../componet/footer"
import { setCookie , getCookie} from "../componet/cookie"
import { useNavigate } from 'react-router-dom'
import Header from "../componet/header"
import Menu from "../componet/Menu"
import NoTabs from "./NoTab"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { IoMdClose } from "react-icons/io";
import 'react-tabs/style/react-tabs.css';

import DateP from "../componet/context"

const Desk = () =>{
    const native = useNavigate()
    const LginKy = getCookie('LginKy')
    const [msg, setMsg] = useState('')
    const [user, setUser] = useState(null)
    const [datePeriod , setDatePeriod] = useState('')
    const [ActiveTab, setActiveTab] = useState([])
    const [CurrentTab, setCurrentTab] = useState(0)

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

    const CloseTab = (key) =>{setActiveTab(ActiveTab.filter((obj) => obj.key != key))}

    useEffect(verificationCookie,[LginKy])

    return(
        <div className="Desk">
            <Header user={user} ActiveTab={ActiveTab} setActiveTab={setActiveTab} datePeriod={datePeriod} setCurrentTab={setCurrentTab}/>
            <div className="DM">
                <Menu ActiveTab={ActiveTab} setActiveTab={setActiveTab} datePeriod={datePeriod} setCurrentTab={setCurrentTab}/>
                <div className="PgTabs">
                {ActiveTab.length==0?<NoTabs />:
                <Tabs selectedIndex={CurrentTab} onSelect={(key) => setCurrentTab(key)} tabIndex={CurrentTab}>
                    <TabList>
                        {ActiveTab.map(i=>{
                            return(
                                <Tab key={i.key}>
                                    <div className="TbsDiv">
                                        <p>{i.title}</p>
                                        <button onClick={()=>CloseTab(i.key)}><p><IoMdClose/></p></button>
                                    </div>
                                </Tab>
                            )
                        })}
                    </TabList>
                    <DateP.Provider value={datePeriod}>
                    {ActiveTab.map(i=>{
                            return(
                                <TabPanel key={i.key}>{i.element}</TabPanel>
                            )
                        })}
                    </DateP.Provider>
                </Tabs >
                }
                </div>
            </div>
            <Fotter datePeriod={datePeriod} setDatePeriod={setDatePeriod}/>
        </div>
    )
}

export default Desk