import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "@/context/authContext"

const ProtectedRoutes = () => {

    const { token, isLogin } = useAuth();
    console.log(token, isLogin);

  return (
    (token && isLogin) ? <Outlet/> : <Navigate to = "/login"/>
  )
}

export default ProtectedRoutes