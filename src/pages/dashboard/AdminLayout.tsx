import SideNavBar from "@/components/SideNavBar";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { CircleUserRound, Layers3, CircleAlert, BadgeCheck, Home, LogOutIcon, Package, ImageUp, Search, Settings, ShoppingCartIcon, UserRoundCogIcon, LibraryBig } from "lucide-react";
import Logo from "@/components/Logo";
import Image from "@/components/Image";
import { useState, useCallback } from "react";
import { useAuth } from "@/context/authContext";
import { imageValidate } from "@/utils/imageValidate";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import Cookies from "js-cookie";

const AdminLayout = () => {

  const { adminProfile, setToken, setIsLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const paths:string[] = location.pathname.split("/").filter(Boolean);

  console.log(adminProfile)

  const { token } = useAuth();
  const [response, setResponse] = useState("");
  const [resError, setResError] = useState("");
  const [isOpen,setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImgUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    console.log(formData);
  
    try {
      setLoading(true);
      const res = await fetch("https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/admin-profile-mgt/upload-profile-pics", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (res.ok) {
        setLoading(false);
        setResponse('Profile image uploaded successfully');
        setIsOpen(prevState => !prevState);
        // Optionally refresh or re-fetch user data here
      } else {
        const errorData = await res.json();
        console.error('Failed to upload profile image:', errorData.message);
        setResError('Failed to upload profile image: ' + errorData.message);
        setIsOpen(prevState => !prevState);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', (error as Error).message);
      setResError('Failed to upload profile image');
      setIsOpen(prevState => !prevState);
    } finally {
      setLoading(false);
    }
  }, [token]);
  
const handleLogout = () => {
  Cookies.remove("auth");
  setToken('');
  setIsLogin(false);
  // setAdminProfile(null);
  navigate("/login", { replace: true });
  window.location.reload();
};


  return (
    <>
      <main className="max-container min-h-screen grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] bg-gray font-roboto">
        <header className="py-4 px-6 col-start-2 col-span-2 w-full min-h-[--header-height] bg-white flex justify-between">
            <form className="w-fit">
              <div className = "w-full flex items-center p-1 border border-black focus-within:border-blue focus-within:border-2 rounded-md">
                <div className="p-2 cursor-pointer">
                  <Search color="#c0c0c0"/>
                </div>
                <input type="text" 
                  placeholder="Search items, categories"
                  className="w-[25em] h-10 border-none outline-none text-text-black bg-transparent pl-2"
                />
              </div>
            </form>
            <div className="flex w-fit h-[3rem] items-center gap-x-3">
                {/* <img src={userData.profilePic} alt="admin image" className="w-10 h-10 object-container"/> */}
              <>
              <div id="edit_user_div" className="w-[3rem] h-[3rem] rounded-full relative">
                {loading ? <div className = "w-full h-full rounded-full flex items-center justify-center"><Spinner /></div>
                  : adminProfile?.profile_picture ? (
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
                <h4 className="font-medium text-size-500 text-text-black capitalize">{adminProfile?.fullname}</h4>
                <p className="text-xs text-text-black font-normal capitalize">{adminProfile?.admintype}</p>
              </div>
              </>
                <div 
                  className = "border-2 p-2 cursor-pointer" 
                  onClick = {handleLogout}
                >
                  <LogOutIcon color="#121212"/>
                </div>
              </div>
        </header>
        <SideNavBar className="row-start-1 row-span-2 col-start-1 w-[15rem] shadow-lg bg-white">
            <div className="h-full flex flex-col justify-between">
              <nav className="flex flex-col gap-y-10">
                <Logo />
                <ul className="flex flex-col gap-y-4">
                  <Link to ="dashboard">
                    <li className={`p-2 flex gap-3 ${paths?.includes("dashboard") ? "text-white bg-black" : "text-text-black"} items-center`}>
                      <Home size = {20} color={`${paths.includes("dashboard") ? "#fff" : "#121212"}`}/>
                      <p className="text-size-400 font-normal capitalize">dashboard</p>
                    </li>
                  </Link>
                  <Link to ="view-orders">
                    <li className={`p-2 flex gap-3 ${paths?.includes("view-orders") ? "text-white bg-black" : "text-text-black"} items-center`}>
                      <ShoppingCartIcon size = {20} color={`${paths.includes("view-orders") ? "#fff" : "#121212"}`}/>
                      <p className="text-size-400 font-normal capitalize">orders</p>
                    </li>
                  </Link>
                  <Link to ="category">
                    <li className={`p-2 flex gap-3 ${paths?.includes("category") ? "text-white bg-black" : "text-text-black"} items-center`}>
                      <LibraryBig size = {20} color={`${paths.includes("category") ? "#fff" : "#121212"}`}/>
                      <p className="text-size-400 font-normal capitalize">category</p>
                    </li>
                  </Link>
                  <Link to ="inventory">
                    <li className={`p-2 flex gap-3 ${paths?.includes("inventory") ? "text-white bg-black" : "text-text-black"} items-center`}>
                      <Layers3 size = {20} color={`${paths.includes("inventory") ? "#fff" : "#121212"}`}/>
                      <p className="text-size-400 font-normal capitalize">inventory</p>
                    </li>
                  </Link>
                  <Link to ="products">
                    <li className={`p-2 flex gap-3 ${paths?.includes("products") ? "text-white bg-black" : "text-text-black"} items-center`}>
                      <Package size = {20} color={`${paths.includes("products") ? "#fff" : "#121212"}`}/>
                      <p className="text-size-400 font-normal capitalize">products</p>
                    </li>
                  </Link>
                  <Link to ="view-customers">
                    <li className={`p-2 flex gap-3 ${paths?.includes("view-customers") ? "text-white bg-black" : "text-text-black"} items-center`}>
                      <CircleUserRound size = {20} color={`${paths.includes("view-customers") ? "#fff" : "#121212"}`}/>
                      <p className="text-size-400 font-normal capitalize">customers</p>
                    </li>
                  </Link>
                  <Link to ="accounts">
                    <li className={`p-2 flex gap-3 ${paths?.includes("accounts") ? "text-white bg-black" : "text-text-black"} items-center`}>
                      <UserRoundCogIcon size = {20} color={`${paths.includes("accounts") ? "#fff" : "#121212"}`}/>
                      <p className="text-size-400 font-normal capitalize">administrators</p>
                    </li>
                  </Link>
                  <Link to ="account-setting">
                    <li className={`p-2 flex gap-3 ${paths?.includes("account-setting") ? "text-white bg-black" : "text-text-black"} items-center`}>
                      <Settings size = {20} color={`${paths.includes("account-setting") ? "#fff" : "#121212"}`}/>
                      <p className="text-size-400 font-normal capitalize">settings</p>
                    </li>
                  </Link>
                </ul>
              </nav>
            </div>
        </SideNavBar>
        <div id="main-content" className="w-full col-start-2 col-span-2 row-start-2 row-span-2 min-h-full p-5">
            <Outlet />
        </div>
    </main>

    {/* For showing success message or error message */}
    <Modal isOpen={isOpen} handleModalOpen={() => setIsOpen(prevState => !prevState)}>
        <div className="flex flex-col w-full">
            <div className="flex items-center gap-3">
                {/* <MessageSquareWarning size = {35} color = "rgb(239 68 68)"/> */}
                {resError !== "" ? <CircleAlert size = {35} color = "rgb(255 201 92)" /> : 
                    response !== "" && <BadgeCheck size = {35} color = "rgb(34 197 94)"/>
                }

                {response !== "" ?<p>
                    {response}
                </p> 
                : resError !== "" && <p>
                    {response}
                </p>
                }
            </div>
            <div className="flex gap-5 mt-5 border-t border-[#f0f0f0] pt-3">
                {response !== "" ?<Button  
                    size="medium"
                    handleClick={() => {
                    navigate("/admin/dashboard", {replace: true});
                      // window.location.reload();
                      setResponse("");
                      setIsOpen(prevState => !prevState);
                    }}
                    className="text-sm uppercase flex-1"
                >
                    Back to profile
                </Button>
                    : resError !== "" && <Button  
                    size="medium"
                    handleClick={() => {
                    navigate("/admin", {replace: true});
                        // window.location.reload();
                    }}
                    className="text-sm uppercase flex-1"
                >
                    retry again
                </Button>    
            }
            </div>
        </div>
    </Modal>
    </>
  )
}

export default AdminLayout;