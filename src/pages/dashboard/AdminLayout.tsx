import SideNavBar from "@/components/SideNavBar";
import { Link, Outlet, useLocation } from "react-router-dom";
// import Button from "@/components/Button";
import { CircleUserRound, Layers3, Home, LogOutIcon, Package, Search, Settings, ShoppingCartIcon, UserRoundCogIcon, LibraryBig } from "lucide-react";
import Logo from "@/components/Logo";
import Image from "@/components/Image";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";

interface UserData{
  fullname: string;
  adminType: string;
  profilePic: string;
}

const AdminLayout = () => {

  const [token, setToken] = useState<string>("");
  const [userData, setUserData] = useState<UserData>({
    fullname: "",
    adminType: "",
    profilePic: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const location = useLocation();
  const paths:string[] = location.pathname.split("/").filter(Boolean);


  console.log(error);

  useEffect(() => {
    const sessionStoragelabel: string | null =
      window.sessionStorage.getItem("auth-token");
    let sessionStorageData: { token: string } | undefined;

    // Check to ensure that the sessionStorage is not empty
    if (sessionStoragelabel !== null) {
      try {
        sessionStorageData = JSON.parse(sessionStoragelabel) as {
          token: string;
        };
      } catch (error) {
        console.error("Failed to parse session storage label:", error);
        sessionStorageData = undefined;
      }
    }
    if (sessionStorageData?.token) {
      const token = sessionStorageData.token;
      setToken(token);
    }
  }, []);

  console.log(token);

  const getUserData = async(token:string) => {
    try {
      setLoading(true);
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
      const user:UserData = {
        fullname: data.fullname,
        adminType: data.admintype,
        profilePic: data.profile_picture,
      }
      setUserData(user)
    }
    catch(e: any){
      console.log(e.message);
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    if(token !== ""){getUserData(token);}
  }, [token]);


  console.log(userData.adminType);
  // const currentPath = paths.at(-1)

  return (
    <main className="max-container min-h-screen grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] bg-gray font-roboto">
        <header className="py-4 px-6 col-start-2 col-span-2 w-full min-h-[--header-height] bg-white flex justify-between">
            <form className="w-fit">
              <div className = "w-full flex items-center p-1 border border-black focus-within:border-blue focus-within:border-2 rounded-md">
                <div className="p-2 cursor-pointer"><Search color="#c0c0c0"/></div>
                <input type="text" 
                  placeholder="Search items, categories"
                  className="w-[25em] h-10 border-none outline-none text-text-black bg-transparent pl-2"
                />
              </div>
            </form>
            <div className="flex w-fit h-[3rem] items-center gap-x-3">
                {/* <img src={userData.profilePic} alt="admin image" className="w-10 h-10 object-container"/> */}
                {
                  loading ? <div className="w-full flex items-center">
                    <Spinner />
                  </div> : <>
                    <div className="w-[3rem] h-[3rem]">
                      {userData.profilePic ? <Image 
                            src = {userData.profilePic} 
                            alt="admin image"
                          className="rounded-full"  
                        />
                        :<p className="text-size-600 uppercase text-white bg-black text-center flex items-center justify-center w-full h-full rounded-full">{userData.fullname.split(" ")[0].substring(0,1)}</p>
                      }
                    </div>
                    <div className="flex-1 px-2">
                      <h4 className="font-medium text-size-500 text-text-black capitalize">{userData.fullname}</h4>
                      <p className="text-xs text-text-black font-normal capitalize">{userData.adminType}</p>
                    </div>
                  </>
                }
                <LogOutIcon color="#121212"/>
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
                    <li className={`p-2 flex gap-3 ${paths?.includes("accounts") ? "text-white bg-black" : "text-text-black"} items-center`}>
                      <Layers3 size = {20} color={`${paths.includes("accounts") ? "#fff" : "#121212"}`}/>
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
  )
}

export default AdminLayout;