import Container from "@/components/Container";
import Image from "@/components/Image";
import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import Modal from "@/components/Modal";
import { useAuth } from "@/context/authContext";
import { ArrowRightIcon, ArrowLeftIcon } from "@/icons/svg";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { Link } from "react-router-dom";

interface CustomerData {
        DOB: null;
        LGA_of_Home_Address: null;
        Nationality: null;
        registeredAt: string;
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
        userId: string;
      }

const Customers = () => {

    const [customers, setCustomers] = useState<CustomerData[] | []>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { token } = useAuth();
    
      const fetchAllCustomers = async(token:string) => {
        try {
          setLoading(true);
          const res = await fetch("https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/customer-mgt/all-users", {
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

        //   const profiles: CustomerData[] = data.map( d =>{
        //         userId: d.userId,
        //         fullname: d.fullName,
        //         email: d.email,
        //         orders: d.orders,
        //         registeredAT: d.RegisteredAt,
        //         mobile: d.mobile,
        //         isLoggedIn: d,.isLoggedIn,
        //   });

        const profiles: CustomerData[] = data[0].map((d: any) => ({
            userId: d.userID,
            fullname: d.fullname,
            email: d.email,
            orders: d.orders,
            registeredAt: d.RegisteredAt,
            mobile: d.mobile,
            isLoggedIn: d.isLoggedIn,
            DOB: d.DOB,
            LGA_of_Home_Address: d.LGA_of_Home_Address,
            Nationality: d.Nationality,
            UpdatedAt: d.UpdatedAt,
            age: d.age,
            cityOfResidence: d.cityOfResidence,
            favourites: d.favourites,
            gender: d.gender,
            home_address: d.home_address,
            id: d.id,
            isRegistered: d.isRegistered,
            isVerified: d.isVerified,
            password: d.password,
            password_reset_link: d.password_reset_link,
            profile_picture: d.profile_picture,
            reset_link_exptime: d.reset_link_exptime,
            role: d.role,
            totalRevenue: d.totalRevenue,
          }));

          setCustomers(profiles);
        }
        catch(e: any){
          console.log(e.message);
        }
        finally{
            setLoading(false)
        }
    
      }
    
      useEffect(() => {
        if(token !== ""){fetchAllCustomers(token);}
      }, [token]);
    

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
                        <th scope="col" className="px-4 py-2">View Profile</th>
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
                                    <td className="whitespace-nowrap px-4 py-2 font-medium">{customer.registeredAt.split("T")[0]}</td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        {customer.orders.length > 0 ? customer.orders.length : "0"}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 flex justify-center">
                                        <button className="p-2 rounded-full bg-green-500 hover:bg-green-700 text-white" onClick={() => setIsModalOpen(prevState => !prevState)}>
                                            <Eye />
                                        </button>
                                    </td>
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
                    error && <div className="w-full h-full">
                        <p>{error}</p>
                        <Link to = "/admin/" 
                            className="w-[20rem] py-4 cursor-pointer text-sm font-medium text-white bg-black text-center "
                        >
                            Refresh page
                        </Link>
                    </div>
                }
            </div>
            <div className="mt-8 w-full flex justify-end">
                    <div className="w-fit flex gap-x-5 h-10">
                        <Button size="small" className="text-white text-sm lg:text-base font-medium flex justify-center gap-2">
                            <ArrowLeftIcon stroke="#fff" />
                            Previous
                        </Button>
                        <Button size="small" className="text-white text-sm lg:text-base font-medium flex justify-center gap-2 px-6">
                            Next
                            <ArrowRightIcon stroke="#fff" />
                        </Button>
                    </div>
                </div>
                   {/* Editing existing product category */}
            <Modal title = "Customer details" isOpen={isModalOpen} handleModalOpen={() => setIsModalOpen(prevState => !prevState)}>
            </Modal>
        </Container>
    </div>
  )
}

export default Customers