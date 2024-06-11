import SideNavBar from "@/components/SideNavBar";
import { Link, Outlet, useLocation } from "react-router-dom";
import Button from "@/components/Button";
import { CircleUserRound, Home, LogOutIcon, Package, Search, Settings, ShoppingCartIcon, UserRoundCogIcon } from "lucide-react";
import Logo from "@/components/Logo";
import earpodImg from "@/assets/images/earpods.webp";

const AdminLayout = () => {

  const location = useLocation();
  const paths:string[] = location.pathname.split("/").filter(Boolean);
  // const currentPath = paths.at(-1)

  return (
    <main className="max-container min-h-screen grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] bg-gray font-roboto">
        <header className="py-4 col-start-2 col-span-2 w-full min-h-[--header-height] bg-white flex justify-center">
            <form className="w-fit">
              <div className = "w-full flex p-1 border border-black focus-within:border-blue focus-within:border-2 rounded-md">
                <input type="text" 
                  placeholder="Search items, categories"
                  className="w-[16rem] h-10 border-none outline-none text-text-black bg-transparent pl-2"
                />
                <Button size = "small" className="text-size-400 flex gap-2 h-[3rem] text-white items-center justify-center font-normal">
                    <Search color="#fff"/>
                    Search
                </Button>
              </div>
            </form>
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
              <div className="flex w-full h-fit items-center">
                <img src={earpodImg} alt="admin image" className="w-10 h-10 object-container"/>
                <div className="flex-1 px-2">
                  <h4 className="font-medium text-size-500 text-text-black capitalize">john doe</h4>
                  <p className="text-xs text-text-black font-normal capitalize">admin</p>
                </div>
                <LogOutIcon color="#121212"/>
              </div>
            </div>
        </SideNavBar>
        <div id="main-content" className="w-full col-start-2 col-span-2 row-start-2 row-span-2 h-fit p-5">
            <Outlet />
        </div>
    </main>
  )
}

export default AdminLayout;