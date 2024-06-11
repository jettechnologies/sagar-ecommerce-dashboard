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


function App() {

  return (
    <>
      <Routes >
        <Route path="/" element = {<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element = {<AdminDashboard />} />
          <Route path="view-orders" element = {<ViewOrders />} />
          <Route path="products">
            <Route index = {true} element = {<Products />} />
            <Route path="add-product" element = {<AddProduct />} />
          </Route>
          <Route path="view-customers" element = {<Customers />} />
          <Route path="accounts">
            <Route index = {true} element = {<Adminstrators />} />
            <Route path="create-admin" element = {<CreateAdmin />} />
          </Route>
          <Route path="account-setting" element = {<Settings />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
