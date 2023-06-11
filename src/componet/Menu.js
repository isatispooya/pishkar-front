import { useState ,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { setCookie , getCookie} from "../componet/cookie"
import { OnRun } from "../config/config"
import axios from "axios"
import Consultant from '../page/Consultant';
import Insurer from '../page/insurer';
import FeesReports from '../page/FeesReports';
import Assing from '../page/assign';
import ConsultantsFees from '../page/consultansFees';
import SalaryYear from '../page/SalaryYear';
import Act from '../page/Act';
import MonthlySalaryReportSummary from '../page/MonthlySalaryReportSummary';
import Taxe from '../page/Taxe';
import SubAccunt from '../page/SubAccunt';
import Perforator from '../page/perforator';
import Branches from '../page/branches';
import ManegBranches from '../page/manageBranche';
import MinSalary from '../page//MinSalary';
import Benefit from '../page/benefit';
import Issuing from '../page/Issuing';
import StandardFee from '../page/StandardFees';
import MonthlySalaryReportFull from '../page/MonthlySalaryReportFull';
import AssingInssuing from '../page/assingInssuing';
import Comparison from '../page/Comparison';
import IssuinManual from '../page/IssuinManual';
import NoAccess from './NoAccess'
import ForcastFees from '../page/ForcastFees'
import Integration from '../page/Integration'
import Dashboard from '../page/Dashboard'
import SalesReport from '../page/SalesReport'
import CustomerRatingsFee from '../page/Report/CustomerRatingsFee'
import CustomersFile from '../page/CustomersFile'
import CustomersManual from '../page/CustomersManual'
import RevivalReport from '../page/Report/RevivalRiport'
import LifeIssuing from '../page/Life/LifeIssuing'
import IssuinLifeManual from '../page/Life/LifeIssuingManual'
import WorkingHours from '../page/paybasic/WorkingHours'
import ReportRevivalAll from '../page/Report/reportRevivalAll'
import CustomerRatingsIssuing from '../page/Report/CustomerRatingsIssuing'
import ForcastFeesLife from '../page/Report/ForcastFeesLife'
import LifeRevival from '../page/Life/LifeRevival'
import AssingInssuingLife from '../page/Life/assingInssuingLife'
import AddenLife from '../page/Life/addenLife'
import BalanceCustomer from '../page/Customer/balanceCustomer'
import LifeRevivalYear from '../page/Life/LifeRevivalYear'
import NoFee from '../page/Report/NoFee'
import DashboardCunsoltant from '../page/Report/DashboardCunsoltant'
import SendSmsRevival from '../page/Customer/SendSmsRevival'
import SettingSms from '../page/setting/settingSms'
const Menu = (props) =>{

    const [Authorization, setAuthorization] = useState(null)
    const [Searche, setSearche] = useState('')
    const LginKy = getCookie('LginKy')
    const native = useNavigate()

    const verificationCookie = () =>{
        axios({method:'POST',url:OnRun+'/sing/cookie',data:{cookie:LginKy}
        }).then(response=>{
        if(!response.data.replay){
            setCookie('LginKy','',0)
            native('/')
        }else{
            setAuthorization(response.data.Authorization)
        }
        })}

    const TabsListBase=[
            {id:1000,title:'داشبورد',icon:'',visible:false,
                sub:[
                    {id:1010,cls:'full',title:'گزیده',icon:'',element:<Dashboard datePeriod={props.datePeriod}/>,key:''},
                    {id:1020,cls:'full',title:'مشاور',icon:'',element:<DashboardCunsoltant datePeriod={props.datePeriod}/>,key:''},
                ]
            },
            {id:2000,title:'اطلاعات پایه',icon:'',visible:false,
                sub:[
                    {id:2010,cls:'full',title:'کاربران',icon:'',element:<SubAccunt /> ,key:''},
                    {id:2020,cls:'full',title:'مشاوران',icon:'',element:<Consultant /> ,key:''},
                    {id:2040,cls:'full',title:'تلفیق مشاوران',icon:'',element:<Integration /> ,key:''},
                    {id:2050,cls:'full',title:'مدیریت شعب',icon:'',element:<Branches /> ,key:''},
                    {id:2060,cls:'full',title:'بیمه گر',icon:'',element:<Insurer /> ,key:''},
                    {id:2070,cls:'full',title:'تنظیمات پیامک',icon:'',element:<SettingSms /> ,key:''},
                    {id:2080,cls:'full',title:'کارمزد استاندارد (آیین نامه)',icon:'',element:<StandardFee/> ,key:''},
                ]
            },
            {id:3000,title:'مشتریان',icon:'',visible:false,
                sub:[
                    {id:3010,cls:'full',title:'مدیریت مشتریان گروهی',icon:'',element:<CustomersFile /> ,key:''},
                    {id:3020,cls:'full',title:'مدیریت مشتریان دستی',icon:'',element:<CustomersManual /> ,key:''},
                    {id:3030,cls:'full',title:'گزارش پیامک تمدید',icon:'',element:<SendSmsRevival /> ,key:''},
                ]
            },
            {id:4000,title:'اطلاعات حقوق و دستمزد',icon:'',visible:false,
                sub:[
                    {id:4010,cls:'full',title:'ساعات کارکرد قانونی',icon:'',element:<WorkingHours/> ,key:''},
                    {id:4020,cls:'full',title:'گروه های حقوق و دستمزد',icon:'',element:<SalaryYear/> ,key:''},
                    {id:4030,cls:'full',title:'حداقل حقوق',icon:'',element:<MinSalary/>},
                    {id:4040,cls:'full',title:'کارمزد مشاوران',icon:'',element:<ConsultantsFees/> ,key:''},
                    {id:4050,cls:'full',title:'جدول مالیات',icon:'',element:<Taxe /> ,key:''},
                ]
            },
            {id:5000,title:'مدیریت صدور غیرزندگی',icon:'',visible:false,
                sub:[
                    {id:5010,cls:'full',title:'افزودن فایل صدور',icon:'',element:<Issuing/>,key:''},
                    {id:5020,cls:'full',title:'افزودن دستی صدور',icon:'',element:<IssuinManual /> ,key:''},
                    {id:5030,cls:'full',title:'تخصیص مشاور صدور',icon:'',element:<AssingInssuing/>,key:''},
                ]
            },
            {id:6000,title:'مدیریت صدور زندگی',icon:'',visible:false,
                sub:[
                    {id:6010,cls:'full',title:'افزودن فایل صدور',icon:'',element:<LifeIssuing/>,key:''},
                    {id:6020,cls:'full',title:'افزودن دستی صدور',icon:'',element:<IssuinLifeManual/> ,key:''},
                    {id:6030,cls:'full',title:'تخصیص مشاور صدور',icon:'',element:<AssingInssuingLife/> ,key:''},
                    {id:6040,cls:'full',title:'الحاقیه زندگی',icon:'',element:<AddenLife/> ,key:''},
                ]
        },
            {id:7000,title:'مدیریت کارمزد',icon:'',visible:false,
                sub:[
                    {id:7010,cls:'full',title:'افزودن کارمزدها',icon:'',element:<FeesReports/> ,key:''},
                    {id:7020,cls:'full',title:'تخصیص مشاوران',icon:'',element:<Assing /> ,key:''},
                    {id:7030,cls:'full',title:'بدون کارمزد',icon:'',element:<NoFee /> ,key:''},
                ]
            },
            {id:8000,title:'مدیریت حقوق و دستمزد',icon:'',visible:false,
                sub:[
                    {id:8010,cls:'full',title:'عملکرد ماهانه شعب',icon:'',element:<ManegBranches/> ,key:''},
                    {id:8020,cls:'full',title:'کارکرد پرسنل',icon:'',element:<Act/> ,key:''},
                    {id:8030,cls:'full',title:'سایر مزایا (غیرنقدی)',icon:'',element:<Benefit/> ,key:''},
                ]
            },
            {id:9000,title:'گزارش حقوق و دستمزد',icon:'',visible:false,
                sub:[
                    {id:9010,cls:'full',title:'ماهانه خلاصه',icon:'',icon:'',element:<MonthlySalaryReportSummary /> ,key:''},
                    {id:9030,cls:'full',title:'ماهانه کلی',icon:'',icon:'',element:<MonthlySalaryReportFull /> ,key:''},
                ]
            },
            {id:1100,title:'گزارشات مشاوران',icon:'',visible:false,
                sub:[
                    {id:1110,cls:'full',title:'پرفراژ',icon:'',element:<Perforator datePeriod={props.datePeriod}/> ,key:''},
                    {id:1120,cls:'full',title:'پیشبینی کارمزد های آتی غیرزندگی',icon:'',element:<ForcastFees datePeriod={props.datePeriod}/> ,key:''},
                    {id:1130,cls:'full',title:'پیشبینی کارمزد های آتی زندگی',icon:'',element:<ForcastFeesLife datePeriod={props.datePeriod}/> ,key:''},
                    ]
            },
            {id:1200,title:'گزارشات مشتریان',icon:'',visible:false,
                sub:[
                    {id:1210,cls:'full',title:'مانده حساب مشتریان',icon:'',element:<BalanceCustomer /> ,key:''},
                    ]
            },
            {id:1300,title:'گزارشات مدیریتی',icon:'',visible:false,
                sub:[
                    {id:1320,cls:'full',title:'مقایسه کارمزد (غیرزندگی)',icon:'',element:<Comparison datePeriod={props.datePeriod}/> ,key:''},
                    {id:1330,cls:'full',title:'گزارش فروش',icon:'',element:<SalesReport />,key:''},
                    {id:1340,cls:'full',title:'رتبه بندی مشتریان کارمزد',icon:'',element:<CustomerRatingsFee />,key:''},
                    {id:1350,cls:'full',title:'رتبه بندی مشتریان صدور',icon:'',element:<CustomerRatingsIssuing />,key:''},
                    {id:1360,cls:'full',title:'سررسیدنامه تمدید غیرزندگی',icon:'',element:<RevivalReport type={'همه'}/>,key:''},
                    {id:1370,cls:'full',title:'سررسیدنامه تمدید زندگی',icon:'',element:<LifeRevival type={'همه'}/>,key:''},
                    {id:1380,cls:'full',title:'سررسیدنامه سالانه زندگی',icon:'',element:<LifeRevivalYear type={'همه'}/>,key:''},
                    ]
            },
        ]


    const [TabsList, setTabsList] = useState(TabsListBase)


    const handleSearche = () =>{
        if(Searche.length!=0){
            var newList = []
            for(var i in TabsListBase){
                var Main = TabsListBase[i]
                for(var j in Main['sub']){
                    var Sub = Main['sub'][j]
                    var newSub = []
                    if(Sub['title'].includes(Searche)){newSub.push(Sub)}
                }
                if(newSub.length>0){
                    Main['sub'] = newSub
                    Main['visible'] = true
                    newList.push(Main)
                }
            }
            setTabsList(newList)
        }else{
            setTabsList(TabsListBase)
        }
    }

    const Allow = ()=>{
        if(Authorization!=null){
            if(Authorization.all){
            }else{
                for(var i in Authorization){
                    var mainMneu = i.split(' - ')[0]
                    var subMneu = i.split(' - ')[1]
                    var allw = Authorization[i]
                    if(allw==false){
                        for(var j in TabsList){
                            if(TabsList[j]['title']==mainMneu){
                                TabsList[j]['sub'] = TabsList[j]['sub'].map(k=>{
                                        if(k['title']==subMneu){
                                            k.element = <NoAccess />
                                            k.cls = 'limit'
                                        }
                                        return k
                                    
                                        })
                            }
                        }
                    }

                }
            }
        }
    }
    
    const visibleSub = (id) =>{
        var newvalue = TabsList.map(q =>{
            if(q.id==id){
                return{...q,visible:!q.visible}
            }else{
                return q
            }
        })
        setTabsList(newvalue)
    }


    if (props.ActiveTab.length==0){
        var BaseTabs = TabsListBase[0].sub[0]
        BaseTabs.key = BaseTabs.id
    }

    const AddTab = (row) =>{
        var LoopObject = row
        LoopObject.key = row.id
        if(!props.ActiveTab.map(i=>i.key).includes(LoopObject.key)){
            if(props.ActiveTab.length>7){
                props.setActiveTab(props.ActiveTab.shift())
            }
            props.setActiveTab([...props.ActiveTab,LoopObject])
            props.setCurrentTab(props.ActiveTab.length)
        }
    }

    useEffect(verificationCookie,[LginKy])
    useEffect(Allow,[Authorization])
    useEffect(handleSearche,[Searche])

    return(
        <div className="Menu">
                <div className='MnTtl'>
                    <p className='cnt'>منو</p>
                    <input placeholder='جستجو' value={Searche} onChange={(e)=>setSearche(e.target.value)}/>
                </div>
                <div className='MnOpn'>
                {TabsList.map(i=>{
                    return(
                        <div key={i.id} >
                            <div className='MainBtn' onClick={()=>visibleSub(i.id)}>
                                <img src={i.visible?'/icon/OpenedMenu.png':'/icon/ClosedMenu.png'}/>
                                <button >{i.title}</button>
                            </div>
                            {!i.visible?null:
                                <div className='SubBtns'>
                                    {i.sub.map(j=>{
                                        return(
                                            <div key={j.id} className={j.cls}>
                                                <button onClick={()=>AddTab(j)}>{j.title}</button>
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Menu