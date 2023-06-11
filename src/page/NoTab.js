import { AiOutlineShop , AiOutlineCalculator} from "react-icons/ai";
import { BsListCheck } from "react-icons/bs";
import { RiEmotionHappyLine } from "react-icons/ri";
import { FaHandshake } from "react-icons/fa";

const NoTabs = () =>{
    return(
        <div className="PgLine">
            <div className="Berif">
                <div className="BerifUp">
                    <div className="BerifRight">
                        <div className="Context">
                            <h1>حقوق و دستمزد</h1>
                            <p>ثبت و گزارش کارکرد</p>
                            <p>محاسبه حقوق و دستمزد</p>
                            <p>محاسبه کارمزد مشاوران</p>
                        </div>
                        <div className="Icn">
                            <span><AiOutlineCalculator /></span>
                        </div>
                    </div>
                    <div className="BerifLeft">
                        <div className="Context">
                            <h1>مدیریت فروش</h1>
                            <p>مقایسه کارمزد دریافتی شرکت‌ها</p>
                            <p>گزارش روند فروش</p>
                            <p>مقایسه عملکرد مشاوران</p>
                        </div>
                        <div className="Icn">
                            <span><AiOutlineShop /></span>
                        </div>
                    </div>
                </div>
                <div className="BerifDown">
                    <div className="BerifRight">
                        <div className="Context">
                            <h1>کنترلی</h1>
                            <p>هدف گذاری برای مشاوران</p>
                            <p>مغایرت گیری کارمز بیمه گران</p>
                            <p>تفویض اختیارات</p>
                        </div>
                        <div className="Icn">
                            <span><BsListCheck /></span>
                        </div>
                    </div>
                    <div className="BerifLeft">
                        <div className="Context">
                            <h1>انگیزش کارکنان</h1>
                            <p>پیشبین کارمزد مشاوران در آینده</p>
                            <p>گزارش عملکرد مشاوران</p>
                            <p>گزارش  فروش طی دوره</p>
                        </div>
                        <div className="Icn">
                            <span><RiEmotionHappyLine /></span>
                        </div>
                    </div>
                </div>
                <div className="Cntr">
                    <span><FaHandshake /></span>
                    <p>راهکار های جامع</p>
                </div>
            </div>
        </div>
    )
}


export default NoTabs