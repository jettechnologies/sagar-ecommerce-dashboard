import Container from "@/components/Container"
import { useState, useEffect } from "react";
import Select from "@/components/Select";
// import { LockKeyhole } from "lucide-react";
import { Nationalities } from "@/data";
import Button from "@/components/Button";
import { Headers } from "@/utils/httpRequest";


interface Coupon{
  code: string;
  durationInDays: string,
  durationInWeeks: string,
  percentOff: string,
}

interface EditUser{
  fullname: string;
  email: string;
  nationality: string;
  address: string;
  mobile: string;
  gender: string;
}

const currency = [
  {key:"gpb", value : "Pound"},
  {key: "usd", value:"Dollar"},
  {key: "eur", value :"Euro"},
  {key: "rup", value : "Rupee"},
  {key: "yuan", value :"Chinese yuan " }
]

type CouponKeys = 'weeks' | 'days';

// Define the state type
type CouponState = {
  [key in CouponKeys]: boolean;
};



const Settings = () => {

  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentEmail,setCurrentEmail] = useState("");
  console.log(error)

  const [coupon, setCoupon] = useState<Coupon>({
    code : "",
    durationInDays: "",
    durationInWeeks: "",
    percentOff: "",
  });
  const [isCouponActive, setIsCouponActive] = useState<CouponState>({
    days: false,
    weeks: false,
  });
  const [shipping, setShipping] = useState<{flatRate: string; currency: string;}>({
    flatRate: "",
    currency: "",
  })

  const [passwordChange, setPasswordChange] = useState<{old: string; new:string; confirm: string}>({
    old: "",
    new:"",
    confirm: "",
  })

  const [editUser, setEditUser] = useState<EditUser>({
    fullname: "",
    email: "",
    nationality: "",
    address: "",
    mobile: "",
    gender: "",
  });

  // setting the auth token in state
  useEffect(() => {
    const sessionStorageValue: string | null = window.sessionStorage.getItem("auth-token");
    let sessionStorageData: { token: string } | undefined;

    // Check to ensure that the sessionStorage is not empty
    if (sessionStorageValue !== null) {
        try {
            sessionStorageData = JSON.parse(sessionStorageValue) as { token: string };
        } catch (error) {
            console.error("Failed to parse session storage value:", error);
            sessionStorageData = undefined;
        }
    }
    if (sessionStorageData?.token) {
        const token = sessionStorageData.token;
        setToken(token);
    }
}, []);

// fetching the profile info
  const getAdminInfo = async(token:string) =>{
    try {
      const res = await fetch("https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/admin-auth/profile", {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      const data = await res.json();

      if (!res.ok) {
        console.log(res);
        setError(data.message || 'An error occurred');
        return;
      }

      const user:EditUser = {
        fullname: data?.fullname,
        email: data.email,
        nationality: data?.Nationality ? data?.Nationality : "",
        address : "",
        mobile: data?.mobile,
        gender: data?.gender ? data?.gender : "",
      }
      setCurrentEmail(data.email)
      setEditUser(user)
      console.log(user)
    }
    catch (e : any) {
      console.log(e.message);
      setError(e.message);
    } finally {
      console.log("fetch finally")
    }
  }

    useEffect(() =>{
      if(!token) return;

      getAdminInfo(token);
    }, [token]);

  const handleUserEdit = (
    e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) =>{
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;

    setEditUser({ ...editUser, [name]: value.toLocaleLowerCase()});
  }

  const handleCouponInput =  (
    e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>{
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;

    setCoupon({ ...coupon, [name]: value.toLocaleLowerCase().trim()});
  }

  const handleShippingInput =  (
    e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) =>{
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;

    setShipping({ ...shipping, [name]: value.toLocaleLowerCase().trim()});
  }

  const handlePasswordChange = (
    e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) =>{
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;

    setPasswordChange({ ...passwordChange, [name]: value.trim()});
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

  // Handling the profile submit
  const handleEditProfile = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {fullname, email, nationality, mobile, address, gender} = editUser;

    let data;
    
    if(email.toLocaleLowerCase() === currentEmail.toLocaleLowerCase()){
      data = {
        firstname: fullname,
        mobile: mobile,
        Nationality: nationality,
        home_address: address,
        gender,
      }
    }
    else{
      data = {
        email,
        firstname: fullname,
        mobile: mobile,
        Nationality: nationality,
        home_address: address,
        gender,
      }
    }

    console.log(data)

    const headers: Headers = {
      'Content-type': 'application/json',
      "Accept": "application/json",
      'Authorization': `Bearer ${token}`,
    }

    try {
      setLoading(true);
      const res = await fetch(
          "https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/admin-profile-mgt/edit-admin-profile",
          {
              method: "PATCH",
              headers,
              body: JSON.stringify(data)
          }
      )

      if (res.ok) {
          console.log('Product created successfully');
          console.log(res)
          const data = await res.json();
        console.log(data);

          // setResponse('Product created successfully');
      } else {
          const errorData = await res.json();
          console.error('Failed to create product:', errorData.message);
          setError('Failed to edit profile: ' + errorData.message);
        }
    } catch (error: any) {
        console.error('Error:', error.message);
        setError('Failed to edit profile'+ error.message);
    } finally {
        setLoading(false);
    }
  
    
  }




  console.log(isCouponActive)

  return (
    <div className="w-full h-full">
      <Container className="pt-5">
        <div className="flex flex-col gap-y-24">
          <div className="flex w-full gap-x-5">
            <div className="flex-1 flex flex-col gap-y-5">
            {/* Forget password section */}
            <div className="w-full">
              <h4 className="text-size-500 text-text-black font-medium">Change Password</h4>
              <form id="forget-password" className="w-full flex flex-col gap-5 border border-gray p-5 mt-5 shadow-md">
              <div className="w-full">
                <label htmlFor="old-password" className="text-size-400 text-text-black font-medium mb-3">
                    Old Password
                </label>
                  <input 
                    className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                    type="password" 
                    name="old" 
                    id="old-password" 
                    placeholder="Old Password" 
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="new-password" className="text-size-400 text-text-black font-medium mb-3">
                    New Password
                  </label>
                  <input 
                    className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                    type="password" 
                    name="new" 
                    id="new-password" 
                    placeholder="New Password" 
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="full">
                  <label htmlFor="confirm-new-password" className="text-size-400 text-text-black font-medium mb-3">
                    Confirm New Password
                  </label>
                  <input 
                    className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                    type="password" 
                    name="confirm" 
                    id="confirm-new-password" 
                    placeholder="Confrim New Password" 
                    onChange={handlePasswordChange}
                  />
                </div>
                <Button size = "small" className = "">
                  Save changes
                </Button>
              </form>
            </div>
            {/* Coupon and flatrate section */}
            <div className="w-full flex gap-x-4">
              <div className="flex-1">
              <h4 className="text-size-500 text-text-black font-medium">Coupons</h4>
              <form id = "coupon-form" className="w-full flex flex-col gap-5 border border-gray p-5 mt-5 shadow-md">
                <div className="w-full">
                  <label htmlFor="coupon-code" className="text-size-400 text-text-black font-medium mb-3">
                    Coupon code
                  </label>
                  <input 
                    type="text" 
                    placeholder="create a coupon code" 
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
                      type="text" 
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
                      type="text" 
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
                    type="text" 
                    placeholder="Perentage off" 
                    id = "coupon-percent-off"
                    name="percentOff"
                    onChange={handleCouponInput}
                    className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                  />
                </div>
                <Button size = "small" className = "">
                  Create coupon
                </Button>
              </form>
              </div>
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
          <div className="flex-1">
            {/* edit profile section */}
          <div className="w-full h-full">
              <h4 className="text-size-500 text-text-black font-medium">Edit Profile</h4>
              <form id="edit-profile" onSubmit={handleEditProfile} className="w-full h-[95%] flex flex-col justify-evenly gap-5 border border-gray p-5 mt-5 shadow-md">
                <div className="w-full">
                  <label htmlFor="fullname" className="text-size-400 text-text-black font-medium mb-3">
                      Fullname
                  </label>
                    <input 
                      className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                      type="text" 
                      name="fullname" 
                      id="fullname" 
                      value = {editUser.fullname} 
                      onChange={handleUserEdit}
                    />
                  </div>
                  <div className="w-full">
                  <label htmlFor="email" className="text-size-400 text-text-black font-medium mb-3">
                      Email
                  </label>
                    <input 
                      className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                      type="text" 
                      name="email" 
                      id="email" 
                      value = {editUser.email} 
                      onChange={handleUserEdit}
                    />
                  </div>
                  <div className="w-full">
                  <label htmlFor="nationality" className="text-size-400 text-text-black font-medium mb-3">
                      Nationality
                  </label>
                  <Select
                    id="nationality"
                    name="nationaility"
                    className="font-normal text-sm w-full py-3 border border-[#c0c0c0] mt-3"
                    select={Nationalities}
                    defaultText="Select your nationality"
                    handleInputChange={handleUserEdit}
                    />
                  </div>
                  <div className="w-full">
                  <label htmlFor = "address" className="text-size-400 text-text-black font-medium mb-3">
                    Home Address
                  </label>
                    <input 
                      className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase" 
                      type="text" 
                      name="address" 
                      id="address" 
                      value = {editUser.address} 
                      onChange={handleUserEdit}
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="mobile" className="text-size-400 text-text-black font-medium mb-3">
                      Mobile
                    </label>
                    <input 
                      className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                      type="text" 
                      name="mobile" 
                      id="mobile" 
                      value={editUser.mobile}
                      onChange={handleUserEdit}
                    />
                  </div>
                  <div className="full">
                    <label htmlFor="gender" className="text-size-400 text-text-black font-medium mb-3">
                      Gender
                    </label>
                    <input 
                      className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                      type="text" 
                      name="gender" 
                      id="gender" 
                      value = {editUser.gender}
                      onChange={handleUserEdit}
                    />
                  </div>
                  <Button size = "small" className = "">
                    {loading ? "Loading..." :"Update profile"}
                  </Button>
              </form>
            </div>
          </div>
          </div>
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