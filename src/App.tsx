import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./pages/dashboard/AdminLayout";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Products from "./pages/dashboard/Products";
import Customers from "./pages/dashboard/Customers";
import Adminstrators from "./pages/dashboard/Adminstrators";
import Settings from "./pages/dashboard/Settings";
import CreateAdmin from "./pages/dashboard/CreateAdmin";
import AddProduct from "./pages/dashboard/AddProduct";
import ViewOrders from "./pages/dashboard/ViewOrders";
import Layout from "./pages/Layout";
import Index from "./pages/Index"
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import OTP from "./pages/auth/OTP";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetOtp from "./pages/auth/ResetOtp";
import Category from "./pages/dashboard/Category";
import Inventory from "./pages/dashboard/Inventory";
import CustomersReview from "./pages/dashboard/CustomersReview";
// import ProtectedRoutes from "./components/ProtectedRoutes";


function App() {

  return (
    <>
      <Routes >
        <Route path="/" element = {<Layout />}>
          <Route index element = {<Index />} />
          <Route path="login" element = {<Login />} />
          <Route path="signup" element = {<Signup />} />
          <Route path="otp" element = {<OTP />} />
          <Route path="reset-password" >
            <Route index element = {<ResetPassword />} />
            <Route path="otp" element = {<ResetOtp />} />
            <Route path = "verfiy-email" element = {<VerifyEmail />} />
          </Route>

        </Route>
        {/* <Route element = {<ProtectedRoutes />}> */}
          <Route path="/admin" element = {<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element = {<AdminDashboard />} />
            <Route path="view-orders" element = {<ViewOrders />} />
            <Route path = "category" element = {<Category />} />
            <Route path = "inventory" element = {<Inventory />} />
            <Route path="products">
              <Route index = {true} element = {<Products />} />
              <Route path="add-product" element = {<AddProduct />} />
            </Route>
            <Route path="view-customers" element = {<Customers />} />
            <Route path="accounts">
              <Route index = {true} element = {<Adminstrators />} />
              <Route path="create-admin" element = {<CreateAdmin />} />
            </Route>
            <Route path="customers-review" element = {<CustomersReview/>} />
            <Route path="account-setting" element = {<Settings />} />
          </Route>
        {/* </Route> */}
      </Routes>
    </>
  )
}

export default App
