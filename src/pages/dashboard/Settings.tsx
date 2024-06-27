import Container from "@/components/Container"
import { useState } from "react";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { useAuth } from "@/context/authContext";
import EditProfile from "@/sections/EditProfile";
import ResetPassword from "@/sections/ResetPassword";
import Coupons from "@/sections/Coupons";
// import { EasyHTTP } from "@/utils/httpRequest";

const currency = [
  {key:"gpb", value : "Pound"},
  {key: "usd", value:"Dollar"},
  {key: "eur", value :"Euro"},
  {key: "rup", value : "Rupee"},
  {key: "yuan", value :"Chinese yuan " }
]

const Settings = () => {

  // const [token, setToken] = useState("");
  // const easyHttp = new EasyHTTP();
  // const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);
  // console.log(error)

  const [shipping, setShipping] = useState<{flatRate: string; currency: string;}>({
    flatRate: "",
    currency: "",
  })

  const { token } = useAuth();

  const handleShippingInput =  (
    e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) =>{
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;

    setShipping({ ...shipping, [name]: value.toLocaleLowerCase().trim()});
  }

  return (
    <div className="w-full h-full">
      <Container className="pt-5">
        <div className="flex flex-col gap-y-24">
          <div className="flex w-full gap-x-5">
            <div className="flex-1 flex flex-col gap-y-5">
            {/* Forget password section */}
            <ResetPassword token={token} />
            {/* Coupon and flatrate section */}
            <div className="w-full flex gap-x-4">
              {/* Coupon section */}
              <Coupons token={token} />
              {/* Flat rate section */}
              <div className="flex-1">
                  <h4 className="text-size-500 text-text-blaxk font-medium">Shipping fees</h4>
                  <form id = "coupon-form" className="w-full flex flex-col gap-5 border border-gray p-5 mt-5 shadow-md">
                    <div className="w-full">
                      <label htmlFor="shipping-fee" className="text-size-400 text-text-black font-medium mb-3">
                        Flat rate
                      </label>
                      <input 
                        type="text" 
                        placeholder="Shipping fee" 
                        id = "shipping-fee"
                        name="flatRate"
                        onChange={handleShippingInput}
                        className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                      />
                    </div>
                  <div className="w-full">
                  <label htmlFor="currency" className="text-size-400 text-text-black font-medium mb-3">
                    Currency
                  </label>
                  <div className="mt-3">
                  <Select
                    id="currncy"
                    name="currency"
                    className="border border-[#c0c0c0] text-medium text-sm w-full"
                    select={currency}
                    defaultText="Shipping Currency"
                    handleInputChange={handleShippingInput}
                  />
                </div>
                </div>
                <Button size = "small" className = "">
                  Save shipping rate
                </Button>
              </form>
              </div>
            </div>
          </div>
            <EditProfile token={token} />
          </div>
          {/* the end of the second section of the editprofile */}
          <div className="w-full flex gap-x-12 shadow-md pt-6 border-t border-[#c0c0c0]">
            <div className="w-fit">
                <h4 className="mb-6">
                  Newletter Subscribers
                </h4>
                <table className="min-w-full text-center text-sm font-light">
                    <thead className="font-medium border-b bg-black text-white">
                        <tr>
                            <th scope="col" className="px-6 py-4">S/N</th>
                            <th scope="col" className="px-6 py-4">Email Address</th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          1
                        </td>
                        <td>
                          John@gmail.com
                        </td>
                      </tr>
                    </tbody>
                </table>
            </div>
            <div className="flex-1">
              <h4 className="mb-6">
                  Customer Feedbacks
                </h4>
                <table className="min-w-full text-center text-sm font-light">
                    <thead className="font-medium border-b bg-black text-white">
                        <tr>
                            <th scope="col" className="px-6 py-4">S/N</th>
                            <th scope="col" className="px-6 py-4">Email Address</th>
                            <th scope="col" className="px-6 py-4">Shopping Experience Rating</th>
                            <th scope="col" className="px-6 py-4">Additional Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          1
                        </td>
                        <td>
                          John@gmail.com
                        </td>
                        <td>
                          The experience was plensant
                        </td>
                        <td>
                          The product was nice
                        </td>
                      </tr>
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Settings