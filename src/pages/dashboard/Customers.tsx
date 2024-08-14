import Container from "@/components/Container";
import Image from "@/components/Image";
import { useState, useEffect } from "react";
import { IndianRupee } from "lucide-react";
import { useAuth } from "@/context/authContext";
import Spinner from "@/components/Spinner";
import { Link } from "react-router-dom";
// import CustomerModal from "@/sections/CustomerModal";
import Pagination from "@/components/Pagination";
import Toast from "@/components/Toast";

// const easyHttp = new EasyHTTP();

export interface CustomerData {
        DOB: null;
        LGA_of_Home_Address: null;
        Nationality: null;
        RegisteredAt: string;
        UpdatedAt: null;
        age: null;
        cityOfResidence: null;
        email: string;
        favourites: any[];
        fullname: string;
        gender: null;
        home_address: null;
        id: number;
        isLoggedIn: boolean;
        isRegistered: boolean;
        isVerified: boolean;
        mobile: string;
        orders: any[];
        password: string;
        password_reset_link: null;
        profile_picture: null;
        reset_link_exptime: null;
        role: string;
        totalRevenue: string;
        userID: string;
      }

const Customers = () => {
    
    const [customers, setCustomers] = useState<CustomerData[] | []>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const { token } = useAuth();

      const fetchAllCustomers = async (token: string) => {
        const url = "customer-mgt/all-users";
    
        try {
          setLoading(true);
          const res = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}${url}`, {
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
          console.log(data[0]);
          setCustomers(data[0]);
        }
        catch (e) {
          console.log((e as Error).message);
        }
        finally {
          setLoading(false);
        }
      };

      console.log(customers)
    
      useEffect(() => {
        if (token !== "") {
          fetchAllCustomers(token);
        }
      }, [token]);
    

    // if(error){
    //     return <div className="w-full h-full">
    //         <p></p>
    //     </div>
    // }
    // function to handle api call for displaying a single customers detail
    // const displaySingleCustomer = async(id:number) =>{
    //     const url = `customer-mgt/one-user/${id}`;
    //     const headers:HeadersInit = {
    //         'Content-type': 'application/json',
    //         "Accept": "application/json",
    //         'Authorization': `Bearer ${token}`,
    //     };

    //     try{
    //         const response = await easyHttp.get(url, headers);
    //         console.log(response);
    //         setCustomer(response)
    //         setIsModalOpen(true);
    //     }
    //     catch(err){
    //         console.log((err as Error).message);
    //         setError((err as Error).message)
    //     }
    // }
    

  return (
    <div className="w-full h-full">
        <Container className="mt-4 min-h-screen">
            <div className="flex justify-between items-center w-full mb-4">
                <h3 className="font-semibold text-size-500 text-text-bold">
                    Customers
                </h3>
                <p className="text-[#c0c0c0] hover:text-blue text-size-400 font-medium p-2 cursor-pointer">
                    See all
                </p>
            </div>
            <div className="h-full">
            <table className="w-full text-center text-sm font-light">
                <thead className="font-medium border-b bg-black text-white">
                    <tr>
                        <th scope="col" className="px-4 py-2">S/N</th>
                        <th scope="col" className="px-4 py-2">Customer Name</th>
                        <th scope="col" className="px-4 py-2">Email</th>
                        <th scope="col" className="px-4 py-2">Contact</th>
                        <th scope="col" className="px-4 py-2">Date Created</th>
                        <th scope="col" className="px-4 py-2">Total Orders</th>
                        <th scope="col" className="px-4 py-2">Revenue generated</th>
                    </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 && customers
                            .sort((a, b) => a.id - b.id)
                            .map(customer => (
                                <tr key={customer.id} className="border border-gray hover:bg-gray-100 cursor-pointer">
                                    <td className="whitespace-nowrap px-4 py-2 font-medium">{customer.id}</td>
                                    <td className="whitespace-nowrap px-4 py-2 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full">
                                            {customer.profile_picture ? (
                                                <Image
                                                    src={customer.profile_picture}
                                                    alt="profile image"
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full bg-black text-white rounded-full">
                                                    <span className="text-xl">
                                                        {customer.fullname.split(" ")[0].substring(0, 1)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-black font-semibold">{customer.fullname}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium">{customer.email}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium">{customer.mobile}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium">{customer.RegisteredAt.split("T")[0]}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        {customer.orders.length > 0 ? customer.orders.length : "0"}
                                    </td>
                                    {/* <td className="whitespace-nowrap px-4 py-2 flex justify-center">
                                        <button className="p-2 rounded-full bg-green-500 hover:bg-green-700 text-white" onClick={() => displaySingleCustomer(customer.id)}>
                                            <Eye />
                                        </button>
                                    </td> */}
                                    <td className="whitespace-nowrap px-4 py-2 font-medium flex gap-2"><IndianRupee size = {20}/>{customer.totalRevenue}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {
                    loading && <div className="w-full h-full">
                        <Spinner />
                    </div>
                }

                {
                    error !== "" && <div className="w-full min-h-screen flex flex-col gap-y-6 justify-center items-center">
                        <p className="text-text-black text-lg first-letter:uppercase">{error}</p>
                        <Link to = "/admin/view-customers" 
                            className="w-[20rem] py-4 cursor-pointer text-sm font-medium text-white bg-black text-center "
                        >
                            Refresh page
                        </Link>
                    </div>
                }
            </div>
            <Pagination url="customer-mgt/all-users" setData={setCustomers} dataLength = {customers.length}/>

                {/* component to show single user */}
                {/* <CustomerModal isOpen = {isModalOpen} handleModalOpen={() =>setIsModalOpen(prevState => !prevState)} customer = {customer}/> */}

                {/* error modal */}
                {/* <ErrorModal error={error} setError={() => setError("")} redirect="/admin/view-customers" /> */}
                {error && <Toast message={error} type="error"/>}
        </Container>
    </div>
  )
}

export default Customers