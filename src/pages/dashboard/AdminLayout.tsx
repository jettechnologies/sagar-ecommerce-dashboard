import SideNavBar from "@/components/SideNavBar";
import { Outlet, useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { CircleAlert, BadgeCheck, LogOutIcon, ImageUp, Search, BellDot } from "lucide-react";
import Image from "@/components/Image";
import { useState, useCallback } from "react";
import { useAuth } from "@/context/authContext";
import { imageValidate } from "@/utils/imageValidate";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import Cookies from "js-cookie";
import { EasyHTTP } from "@/utils/httpRequest";
// import useGetRequest from "../hooks/useGetRequest";
import { useAdminProfile } from "@/context/adminProfileContext";
import AdminNotification from "@/sections/AdminNotification";


const easyHttp = new EasyHTTP();

interface Coupon{
  code: string;
  durationInDays: number,
  durationInWeeks: number,
  percentOff: number,
}

const AdminLayout = () => {
  // const {  } = useAuth();
  const { admin: adminProfile, isLoading: dataLoading } = useAdminProfile();
  const navigate = useNavigate(); 

  const { token, setToken } = useAuth();
  const [response, setResponse] = useState("");
  const [resError, setResError] = useState("");
  const [couponActions, setCouponActions] = useState({
    isEditing: false,
    isDeleting: false,
  });
  const [currentId, setCurrentId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const[isEditing, setIsEditing] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon>({
    code: "",
    durationInDays: 0,
    durationInWeeks: 0,
    percentOff: 0,
  });
  const [isShowing, setIsShowing] = useState(false);


  const handleImgUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      const formData = new FormData();
      const { files } = target;

      if (!files || files.length === 0) {
        return;
      }

      const imgArr = Array.from(files);
      const validate = imageValidate(imgArr);

      if (!validate) {
        console.log("The validation failed");
        return;
      }

      const profilePic = imgArr[0];
      console.log(profilePic);

      formData.append("profilePics", profilePic);

      try {
        setLoading(true);
        const res = await fetch(
          "https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/admin-profile-mgt/upload-profile-pics",
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (res.ok) {
          setLoading(false);
          setResponse("Profile image uploaded successfully");
          setIsOpen((prevState) => !prevState);
          // Optionally refresh or re-fetch user data here
        } else {
          const errorData = await res.json();
          console.error("Failed to upload profile image:", errorData.message);
          setResError("Failed to upload profile image: " + errorData.message);
          setIsOpen((prevState) => !prevState);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", (error as Error).message);
        setResError("Failed to upload profile image");
        setIsOpen((prevState) => !prevState);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const handleCouponInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
  
    if (name === "code") {
      setCurrentCoupon({ ...currentCoupon, [name]: value.trim() });
      return;
    }
  
    // For numeric fields, ensure valid number input
    if (name === "percentOff" || name === "durationInDays" || name === "durationInWeeks") {
      const parsedValue = value.trim() === '' ? 0 : parseInt(value.trim());
      setCurrentCoupon({ ...currentCoupon, [name]: isNaN(parsedValue) ? 0 : parsedValue });
      return;
    }
  
    setCurrentCoupon({ ...currentCoupon, [name]: value.trim() });
  };

  const handleLogout = () => {
    Cookies.remove("auth_token");
    setToken("");
    navigate("/login", { replace: true });
    // window.location.reload();
  };

  // function to edit coupon
  const editCoupon = useCallback(async(e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();

    const url = `order-mgt/update-discount-Coupon/${currentId}`;

    const headers:HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }

    const data = {
      discountCode: currentCoupon.code,
      DiscountDuration_days: currentCoupon.durationInDays,
      DiscountDuration_weeks: currentCoupon.durationInWeeks,
      percentageOff: currentCoupon.percentOff,
    }

    try{
      setIsEditing(true);
      const response = await easyHttp.patch(url, headers, data);
      console.log(response);

      setCouponActions((prevState) => ({
        ...prevState,
        isDeleting: false 
      }));
      window.location.reload();
      // navigate("/admin", {replace:true});
    }
    catch(err){
      console.log((err as Error).message);
      setResError((err as Error).message);
    }
    finally{
      setIsEditing(false);
    }

  }, [currentId, token, setCouponActions, currentCoupon]);

  // // function to delete coupon
  const deleteCoupon = useCallback(async() =>{
    const url = `order-mgt/delete-discount-Coupon/${currentId}`;

    const headers:HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }

    try{
      setIsDeleting(true);
      const response = await easyHttp.delete(url, headers);
      console.log(response);
      setCouponActions((prevState) => ({
        ...prevState,
        isDeleting: false 
      }));
      window.location.reload();
      // navigate("/admin", {replace:true});
    }
    catch(err){
      console.log((err as Error).message);
      setResError((err as Error).message);
    }
    finally{
      setIsDeleting(false);
    }

  }, [currentId, token, setCouponActions]);

  return (
    <>
      <main className="max-container min-h-screen flex bg-gray font-roboto">
        <SideNavBar 
          className="w-[17rem] overflow-y-scroll shadow-lg bg-white fixed top-0 left-0 h-screen z-10" 
          setCouponActions = {setCouponActions} 
          setCurrentId={setCurrentId}
          setCurrentCoupon = {setCurrentCoupon}
        />
        <div className="w-full pl-[17rem]">
          <header className="py-4 px-6 w-full min-h-[--header-height] bg-white flex justify-between">
            <form className="w-fit">
              <div className="w-full flex items-center p-1 border border-black focus-within:border-blue focus-within:border-2 rounded-md">
                <div className="p-2 cursor-pointer">
                  <Search color="#c0c0c0" />
                </div>
                <input
                  type="text"
                  placeholder="Search items, categories"
                  className="w-[25em] h-10 border-none outline-none text-text-black bg-transparent pl-2"
                />
              </div>
            </form>
            <div className="w-fit flex gap-x-8 items-center">
              <div 
                className="w-10 h-10 flex items-center justify-center rounded-full text-blue cursor-pointer relative"
                onClick={() => setIsShowing(prevState => !prevState)}
              >
                <BellDot size={27}/>
                {/* <span className="text-white font-normal text-sm absolute top-0 right-0 w-4 h-4 text-center rounded-full bg-blue">3</span> */}
                {isShowing && <AdminNotification />}
              </div>
              {!dataLoading && (
                <div className="flex w-fit h-[3rem] items-center gap-x-3">
                  {/* <img src={userData.profilePic} alt="admin image" className="w-10 h-10 object-container"/> */}
                  <>
                    <div id="edit_user_div" className="w-[3rem] h-[3rem] rounded-full relative">
                      {loading ? (
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                          <Spinner />
                        </div>
                      ) : adminProfile?.profile_picture ? (
                        <Image
                          src={adminProfile?.profile_picture}
                          alt="profile image"
                          className="w-[3rem] h-[3rem] rounded-full"
                        />
                      ) : (
                        <p className="text-size-600 uppercase text-white bg-black text-center flex items-center justify-center w-full h-full rounded-full border">
                          {adminProfile?.fullname.split(" ")[0].substring(0, 1)}
                        </p>
                      )}
                      <label
                        htmlFor="edit_user_img"
                        id="edit_user_img"
                        className="hidden bg-black z-80 absolute top-[0.25rem] left-[0.25rem] items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full cursor-pointer"
                      >
                        <ImageUp size={20} color="#fff" />
                        <input
                          type="file"
                          id="edit_user_img"
                          onChange={handleImgUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </label>
                    </div>
                    <div className="flex-1 px-2">
                      <h4 className="font-medium text-size-500 text-text-black capitalize">
                        {adminProfile?.fullname}
                      </h4>
                      <p className="text-xs text-text-black font-normal capitalize">
                        {adminProfile?.admintype}
                      </p>
                    </div>
                  </>
                  <div className="p-2 cursor-pointer" onClick={handleLogout}>
                    <LogOutIcon color="#121212" />
                  </div>
                </div>
              )}
            </div>
          </header>
          <div id="main-content" className="w-full min-h-full p-5">
            <Outlet />
          </div>
        </div>
      </main>

      {/* For showing success message or error message */}
      <Modal
        isOpen={isOpen}
        handleModalOpen={() => setIsOpen((prevState) => !prevState)}
      >
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-3">
            {/* <MessageSquareWarning size = {35} color = "rgb(239 68 68)"/> */}
            {resError !== "" ? (
              <CircleAlert size={35} color="rgb(255 201 92)" />
            ) : (
              response !== "" && <BadgeCheck size={35} color="rgb(34 197 94)" />
            )}

            {response !== "" ? (
              <p>{response}</p>
            ) : (
              resError !== "" && <p>{response}</p>
            )}
          </div>
          <div className="flex gap-5 mt-5 border-t border-[#f0f0f0] pt-3">
            {response !== "" ? (
              <Button
                size="medium"
                handleClick={() => {
                  // navigate("/admin/dashboard", {replace: true});
                  window.location.reload();
                  // setResponse("");
                  // setIsOpen(prevState => !prevState);
                }}
                className="text-sm uppercase flex-1"
              >
                Back to profile
              </Button>
            ) : (
              resError !== "" && (
                <Button
                  size="medium"
                  handleClick={() => {
                    navigate("/admin", { replace: true });
                    // window.location.reload();
                  }}
                  className="text-sm uppercase flex-1"
                >
                  retry again
                </Button>
              )
            )}
          </div>
        </div>
      </Modal>

      {/* for changing the admin level */}
      <Modal title = "edit coupon" isOpen={couponActions.isEditing} handleModalOpen={() => setCouponActions({...couponActions, isEditing: false})}>
          <form id ="edit-coupon" onSubmit={editCoupon} className="w-full">
            {/* {error.status && <Notification message = {error.msg} type = "danger" className="text-white mb-4"/>} */}
            <div className="w-full">
              <label htmlFor="coupon-code" className="text-size-400 text-text-black font-medium mb-3">
                Coupon code
              </label>
              <input 
                type="text" 
                id="coupon-code" 
                name="code"
                value = {currentCoupon.code}
                onChange={handleCouponInput}
                className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
              />
            </div>
            {currentCoupon.durationInDays !== 0 && <div className="w-full">
              <label htmlFor="duration_in_days" className="text-size-400 text-text-black font-medium mb-3">
                Duration in days
              </label>
              <input 
                type="number" 
                id="duration_in_days" 
                name="durationInDays"
                value = {currentCoupon.durationInDays}
                onChange={handleCouponInput}
                className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
              />
            </div>}
            {currentCoupon.durationInWeeks !== 0 && <div className="w-full">
              <label htmlFor="duration_in_weeks" className="text-size-400 text-text-black font-medium mb-3">
                Duration in weeks
              </label>
              <input 
                type="text" 
                id="duration_in_weeks" 
                name="durationInWeeks"
                value = {currentCoupon.durationInWeeks}
                onChange={handleCouponInput}
                className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
              />
            </div>}
            <div className="w-full">
              <label htmlFor="coupon_percentOff" className="text-size-400 text-text-black font-medium mb-3">
                Percentage off
              </label>
              <input 
                type="text" 
                id="coupon_percentOff" 
                name="percentOff"
                value = {currentCoupon.percentOff}
                onChange={handleCouponInput}
                className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
              />
            </div>
              <Button size = "large" className="w-full mt-4 uppercase">{isEditing ? "Loading..." : "Update coupon"}</Button>
            </form>
      </Modal>

      {/* Deleting existing product category */}
      <Modal title = "Delete coupon" isOpen={couponActions.isDeleting} handleModalOpen={() => setCouponActions({...couponActions, isDeleting: false})}>
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-3">
                    {/* <MessageSquareWarning size = {35} color = "rgb(239 68 68)"/> */}
                    <CircleAlert size = {35} color = "rgb(239 68 68)" />
                    <p>
                        Are you sure u want to delete this coupon ?
                    </p>
                </div>
                <div className="flex gap-5 mt-5 border-t border-[#f0f0f0] pt-3">
                    <Button 
                        type="white" 
                        size="medium" 
                        className="text-sm uppercase flex-1"
                        handleClick = {() => setCouponActions({...couponActions, isDeleting: false})}
                    >
                        no, cancel
                    </Button>
                    <Button 
                        type="danger" 
                        size="medium"
                         handleClick={() => deleteCoupon()}
                        className="text-sm uppercase flex-1"
                    >
                        {isDeleting ? "loading" : "yes, delete"}
                    </Button>
                </div>
            </div>
        </Modal>
    </>
  );
};

export default AdminLayout;
