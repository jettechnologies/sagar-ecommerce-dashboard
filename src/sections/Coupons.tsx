import { useState } from "react"
import Button from "@/components/Button";
import { EasyHTTP } from "@/utils/httpRequest";
import { useNavigate } from "react-router-dom";

interface Coupon{
    code: string;
    durationInDays: number,
    durationInWeeks: number,
    percentOff: number,
}
  
type CouponKeys = 'weeks' | 'days';

// Define the state type
type CouponState = {
  [key in CouponKeys]: boolean;
};

type CouponProps = {
    token: string;
}

const easyHttp = new EasyHTTP();

const Coupons = ({token}: CouponProps) => {

  // console.log(token);

    const navigate = useNavigate();
    const [coupon, setCoupon] = useState<Coupon>({
        code : "",
        durationInDays: 0,
        durationInWeeks: 0,
        percentOff: 0,
      });
      const [isCouponActive, setIsCouponActive] = useState<CouponState>({
        days: false,
        weeks: false,
      });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const handleCouponInput =  (
        e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) =>{
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value } = target;

        if(name === "code"){setCoupon({ ...coupon, [name]: value.trim()}); return;}
        
        setCoupon({ ...coupon, [name]: parseInt(value.trim())});
    }

    const handleIsCouponActive = (
        e:React.ChangeEvent<HTMLInputElement>
      ) =>{
        const target = e.target as HTMLInputElement;
        const { name } = target;
    
        setIsCouponActive((prevState) => ({
          ...prevState,
          [name]: !prevState[name as CouponKeys]
        }));
    
      }

      console.log(coupon);
    
      const handleCreateCoupon = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const { code, percentOff, durationInDays, durationInWeeks } = coupon;

    
        if(percentOff > 0 && (durationInDays > 0 || durationInWeeks > 0) && code !== ""){
            const url = "order-mgt/set-discount-Coupon";
            const headers:HeadersInit = {
              "Content-Type": 'application/json',
              "Accept": "application/json",
              Authorization: `Bearer ${token}`,
            }
    
            const data = {
              discountCode: code,
              DiscountDuration_weeks: durationInWeeks === 0 ? null : durationInWeeks,
              DiscountDuration_days: durationInDays === 0 ? null : durationInDays,
              percentageOff: percentOff,
            }
    
            console.log(data)
            
            try{
                setLoading(true);
                const response = await easyHttp.post(url, headers, data);
                console.log(response);
                window.location.reload();
                // navigate("/", {replace: true})
              }
            catch(err){
                console.log((err as Error).message)
                setError((err as Error).message)
            }
            finally{
                setLoading(false)
            }

        //     try{
        //       setLoading(true)
            
        //         const res = await fetch(
        //             "https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/order-mgt/set-discount-Coupon",
        //             {
        //                 method: "POST",
        //                 headers,
        //                 body: JSON.stringify(data)
        //             }
        //         )
          
                // if (!res.ok) {
                //   throw new Error("server response error")
                // }
                // console.log('coupon created successfully');
                // console.log(res)
        //             const response = await res.json();
        //           console.log(response)
        //     }
        //     catch(e){
        //       console.log((e as Error).message)
        //       setError((e as Error).message);
        //   }
        //   finally{
        //       setLoading(false)
        //   }

        }
      }

  return (
              <div className="flex-1">
              <h4 className="text-size-500 text-text-black font-medium">Coupons</h4>
              <form id = "coupon-form" onSubmit={handleCreateCoupon} className="w-full flex flex-col gap-5 border border-gray p-5 mt-5 shadow-md">
                <div className="w-full">
                  <label htmlFor="coupon-code" className="text-size-400 text-text-black font-medium mb-3">
                    Coupon code
                  </label>
                  <input 
                    type="text" 
                    placeholder="Create a coupon code" 
                    id="coupon-code" 
                    name="code"
                    onChange={handleCouponInput}
                    className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                  />
                </div>
                <div>
                  <p className="text-size-400 text-text-black font-medium mb-3">Select coupon durations</p>
                  <div className="flex gap-x-10">
                    <div className="flex gap-2">
                      <input 
                        type="checkbox" 
                        name="weeks" 
                        id="coupon-in-weeks" 
                        className="w-5 h-5 border-gray cursor-pointer"
                        checked = {isCouponActive.weeks || false}
                        onChange = {handleIsCouponActive}
                      />
                      <p className="text-sm font-normal text-text-black">In weeks</p>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="checkbox" 
                        name="days" 
                        id="coupon-in-days" 
                        className="w-5 h-5 border-gray cursor-pointer"
                        checked = {isCouponActive.days || false}
                        onChange = {handleIsCouponActive}
                      />
                      <p className="text-sm font-normal text-text-black">In days</p>
                    </div>
                  </div>
                  </div>

                {isCouponActive.weeks ? <div className="w-full">
                    <label htmlFor="coupon-duration-weeks" className="text-size-400 text-text-black font-medium mb-3">
                      Duration in weeks
                    </label>
                    <input 
                      type="number" 
                      placeholder="Weeks" 
                      id="coupon-duration-weeks" 
                      name="durationInWeeks"
                      onChange={handleCouponInput}
                      className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                  />
                  </div>
                  : isCouponActive.days && <div className="w-full">
                    <label htmlFor="coupon-duration-days" className="text-size-400 text-text-black font-medium mb-3">
                      Duration in days
                    </label>
                    <input 
                      type="number" 
                      placeholder="Days" 
                      id="coupon-duration-days" 
                      name="durationInDays"
                      onChange={handleCouponInput}
                      className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                  />
                  </div>
                }
                <div className="w-full">
                  <label htmlFor="coupon-percent-off" className="text-size-400 text-text-black font-medium mb-3">
                    Percentage off
                  </label>
                  <input 
                    type="number" 
                    placeholder="Percentage off" 
                    id = "coupon-percent-off"
                    name="percentOff"
                    onChange={handleCouponInput}
                    className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                  />
                </div>
                <Button size = "small" btnType="submit">
                  {loading ? "Loading ...": "Create coupon"}
                </Button>
              </form>
              </div>
  )
}

export default Coupons