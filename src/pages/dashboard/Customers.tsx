import Container from "@/components/Container";
import Select from "@/components/Select";
import Image from "@/components/Image";
import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import Modal from "@/components/Modal";

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

    const [token, setToken] = useState<string>("");
    const [customers, setCustomers] = useState<CustomerData[] | []>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);

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
          console.log(token)
          setToken(token);
        }
      }, []);

      console.log(token, loading, error);
    
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

          console.log(data[0])

          console.log(profiles)
          setCustomers(profiles);
        }
        catch(e: any){
          console.log(e.message);
        }
    
      }
    
      useEffect(() => {
        if(token !== ""){fetchAllCustomers(token);}
      }, [token]);
    

  return (
    <div className="w-full h-full">
        <div className="min-h-16 w-full">
            <Container >
            <div className="flex gap-x-4">
                        <div className="w-fit h-full">
                          <Select 
                            id="category" 
                            name = "category" 
                             className="border border-[#c0c0c0]" 
                            select={[{key: "electronics", value: "electronics"}, {key: "wearables", value: "wearables"}, {key: "gamings", value: "gamings"}, {key: "cameras", value: "cameras"}]}
                            defaultText="Categories"
                            />
                        </div>
                        <div className="w-fit h-full">
                          <Select 
                                id = "status" 
                                name = "status" 
                                className="border border-[#c0c0c0]" 
                                select={[ {key: "processing", value: "processing"}, {key: "completed", value: "completed"}, {key: "failed", value: "failed"}]}
                                defaultText="status"
                            />
                        </div>
                        <div className="w-fit h-full">
                          <Select 
                            id = "price" 
                            name="price" 
                            className="border border-[#c0c0c0]" 
                            select={[{key: "customer review", value: "customer review"}, {key: "lowest - highest", value: "lowest - highest"}]}
                            defaultText="price"
                            />
                        </div>
                        <div className="w-fit h-full">
                          <Select 
                            id = "date" 
                            name = "date" 
                            className="border border-[#c0c0c0]" 
                            select={[{key: "customer review", value: "customer review"}, {key: "lowest - highest", value: "lowest - highest"}]}
                            defaultText="date"
                            />
                        </div>
                    </div>
            </Container>
        </div>
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
                <table className="min-w-full text-center text-sm font-light">
                    <thead className="font-medium border-b bg-black text-white">
                        <tr>
                            <th scope="col" className="px-6 py-4">S/N</th>
                            <th scope="col" className="px-6 py-4">Customer Name</th>
                            <th scope="col" className="px-6 py-4">Email</th>
                            <th scope="col" className="px-6 py-4">Contacr</th>
                            <th scope="col" className="px-6 py-4">Date Created</th>
                            <th scope="col" className="px-6 py-4">Total Orders</th>
                            <th scope="col" className="px-6 py-4">View Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            customers.length > 0 && customers
                            .sort((a, b) => a.id - b.id)
                            .map(customer =>{
                                
                                return(
                                    <tr key = {customer.id} className="border border-gray hover:bg-gray cursor-pointer">
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{customer.id}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm flex gap-4 items-center">
                                            <div className="w-[3rem] h-[3rem] rounded-full">
                                            {customer.profile_picture ? <Image 
                                                src = {customer.profile_picture && customer.profile_picture} 
                                                alt="profile image"
                                                className="w-[3rem] h-[3rem] rounded-full"  
                                            />
                                                :<p className="text-size-600 uppercase text-white bg-black text-center flex items-center justify-center w-full h-full rounded-full border">{customer.fullname.split(" ")[0].substring(0,1)}</p>
                                            }
                                            </div>
                                            <div className="flex gap-y-2 flex-col">
                                                <p className="text-size-500 text-text-black font-semibold">
                                                    {customer.fullname}
                                                </p>
                                                {/* <p className="text-sm text-text-black font-normal">
                                                    {admin.registeredAt.split("T")[0]}
                                                </p> */}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{customer.email}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{customer.mobile}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{customer.registeredAt.split("T")[0]}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{(customer.orders.length === 0 || customer.orders === null) 
                                            ? "0" 
                                            : 
                                            String(customer.orders.length)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm flex">
                                            <div className="p-2 cursor-pointer rounded-full" onClick={() => setIsModalOpen(prevState => !prevState)}>
                                                <Eye color = "rgb(34 197 94)"/>
                                            </div>
                                        </td>
                                    </tr> 
                                )
                            })
                        }
                        
                    </tbody>
                </table>
            </div>
            <div className="mt-6 w-full flex justify-end">
                <div className="w-48 h-10 border-2 border-black">

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