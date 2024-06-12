import Logo from "@/components/Logo";
import { Outlet, Link } from "react-router-dom"

const Layout = () => {
  return (
    <main className="max-container min-h-screen bg-gray font-roboto">
        <header className="w-full h-[--header-height] items-center px-8 flex justify-between shadow-md border-2 border-gray">
            <Link to = "/">
                <Logo />
            </Link>
            <div className="w-fit flex gap-x-5">
                <Link 
                    to = "login" 
                    className="px-10 rounded-md py-3 bg-white border border-black text-text-black font-medium text-size-500 capitalize"
                >
                    login
                </Link>
                <Link 
                    to = "signup" 
                    className="px-10 rounded-md py-3 bg-black text-white font-medium text-size-500 capitalize"
                >
                    signup
                </Link>
            </div>
        </header>
        <Outlet />
    </main>
  )
}

export default Layout