// import Notification from "@/components/Notification";
// import Select from "@/components/Select";
import Container from "@/components/Container";
import { Link } from "react-router-dom";
import { CirclePlusIcon, GripHorizontal, Edit, Trash, CircleAlert, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "@/components/Image";
import Button from "@/components/Button";
import { AdminDataType } from "@/types";
import Spinner from "@/components/Spinner";
import Popup from "@/components/Popup";
import Modal from "@/components/Modal";
import { EasyHTTP } from "@/utils/httpRequest";
import { ArrowLeftIcon, ArrowRightIcon } from "@/icons/svg";

const easyHttp = new EasyHTTP();

const Adminstrators = () => {

    const [token, setToken] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [admins, setAdmins] = useState<AdminDataType [] | []>([]);
    // const [response, setResponse] = useState<string | null | []>(null)
    const [currentId, setCurrentId] = useState("");
    const [activePopupId, setActivePopupId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false);


    useEffect(() =>{
        if (!token) return;

    const getAllAdmins = async (token:string) => {
      try {
        setLoading(true);
        const res = await fetch("https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/admins-mgt/all-other-admins", {
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

        const mapResponseToAdminData = (response: any): AdminDataType => {
            return {
              id: response.id,
              adminID: response.adminID,
              email: response.email,
              role: response.role,
              adminType: response.admintype,
              adminAccessLevel: response.adminaccessLevel,
              password: response.password,
              mobile: response.mobile,
              fullname: response.fullname,
              updatedAt: response.UpdatedAt,
              registeredAt: response.RegisteredAt,
              profilePicture: response.profile_picture,
              gender: response.gender,
              nationality: response.Nationality,
              isLoggedIn: response.isLoggedIn,
              isRegistered: response.isRegistered,
              isActivated: response.isActivated,
              isDeactivated: response.isDeactivated,
              isVerified: response.isVerified,
              resetLinkExpTime: response.reset_link_exptime,
              passwordResetLink: response.password_reset_link,
            };
          };

        const mapResponsesToAdminDataArray = (responses: any[]): AdminDataType[] => {
            return responses.map((response) => mapResponseToAdminData(response));
          };
          const adminData: AdminDataType[] = mapResponsesToAdminDataArray(data[0]);
          console.log(adminData)
          setAdmins(adminData);
      } catch (e : any) {
        console.log(e.message);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    getAllAdmins(token);
    }, [token]);

    

    const handlePopupToggle = (id:number) => {
        setActivePopupId(prevId => (prevId === id ? null : id));
    };

    // handling editing of a category
    const handleIsEditing = (id:number)  =>{
        setIsEditing(prevState => !prevState)

        setCurrentId(String(id))
    }

    // Stuff for deleting a category
    const handleIsDeleting = (id:number) =>{
        setIsDeleting(prevState => !prevState);

        setCurrentId(String(id))
    }

    const handleDeleteAccount = async() =>{
        // const id = string(currentId);
        const url = `admins-mgt/delete-other-admin/${currentId}`;
        const headers = {
            'Authorization': `Bearer ${token}`,
        }

        try{
            setLoading(true)
            const res = await easyHttp.delete(url, headers);
        }
        catch(e: any){
            console.log(e.message)
            setError(e.message);
        }
        finally{
            setLoading(false)
        }

        if(error !== null){
            return;
        }

        setIsDeleting(prevState => !prevState);

        window.location.reload();

    }

    console.log(admins)
    
  return (
    <Container className="mt-4 min-h-screen">
            <div className="flex justify-between items-center w-full mb-4">
                <h3 className="font-semibold text-size-500 text-text-bold">
                    Administrators
                </h3>
                <Link to = "create-admin" className="text-size-xs px-6 py-2 flex gap-2 bg-black rounded-md text-white items-center justify-center font-normal">
                    <CirclePlusIcon color="#fff"/>
                    Create Admin
                </Link>
            </div>
            <div className="h-full w-full">
                <table className="min-w-full text-center text-sm font-light">
                    <thead className="font-medium border-b bg-black text-white">
                        <tr className = "text-center">
                            <th scope="col" className="px-6 py-4">Admin name</th>
                            <th scope="col" className="px-6 py-4">Email</th>
                            <th scope="col" className="px-6 py-4">Mobile</th>
                            <th scope="col" className="px-6 py-4">Access Level</th>
                            <th scope="col" className="px-6 py-4">Nationality</th>
                            <th scope="col" className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            

                            admins.map((admin: AdminDataType, index) =>(
                                <tr key = {index} className="border border-gray hover:bg-gray cursor-pointer capitalize items-center">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-sm flex gap-4 items-center">
                                        <div className="w-[3rem] h-[3rem] rounded-full">
                                        {admin.profilePicture ? <Image 
                                            src = {admin.profilePicture && admin.profilePicture} 
                                            alt="profile image"
                                            className="w-[3rem] h-[3rem] rounded-full"  
                                        />
                                            :<p className="text-size-600 uppercase text-white bg-black text-center flex items-center justify-center w-full h-full rounded-full border">{admin.fullname.split(" ")[0].substring(0,1)}</p>
                                        }
                                        </div>
                                        <div className="flex gap-y-2 flex-col">
                                            <p className="text-size-500 text-text-black font-semibold">
                                                {admin.fullname}
                                            </p>
                                            <p className="text-sm text-text-black font-normal">
                                                {admin.registeredAt.split("T")[0]}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{admin.email}</td>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{admin.mobile}</td>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{admin.adminAccessLevel}</td>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{admin.nationality ? admin.nationality : "was not set"}</td>
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-sm relative">
                                    <Button 
                                        size="small" 
                                        type="white"
                                        handleClick={() => handlePopupToggle(admin.id)}
                                        className={`border-none z-10`}
                                    >
                                        <GripHorizontal />
                                    </Button>
                                    {activePopupId === admin.id && (
                                                <Popup className="top-16">
                                                    <div className="w-full border-b border-[#f0f0f0] flex">
                                                        <Button 
                                                            size="small" 
                                                            type="white" 
                                                            handleClick = {() => handleIsEditing(admin.id)}
                                                            className="capitalize bg-transparent border-none flex gap-x-5 text-sm items-center"
                                                        >
                                                            <Edit />
                                                            update
                                                        </Button>
                                                    </div>
                                                    <div className="flex w-full justify-center">
                                                        <Button 
                                                            size="small" 
                                                            type="white" 
                                                            className="capitalize border-none bg-transparent flex gap-5 text-sm items-center"
                                                            handleClick = {() => handleIsDeleting(admin.id)}
                                                        >
                                                            <Trash />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                    <div className="flex w-full justify-center">
                                                        <Button 
                                                            size="small" 
                                                            type="white" 
                                                            className="capitalize border-none bg-transparent flex gap-5 text-sm items-center"
                                                            handleClick = {() => handleIsDeleting(admin.id)}
                                                        >
                                                            <Shield />
                                                            Change Access level
                                                        </Button>
                                                    </div>
                                                </Popup>
                                            )}
                                    </td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>

                {
                            loading && (
                                <div className="w-full h-full grid place-items-center">
                                    <Spinner />
                                </div>)
                        }

                        {
                            error ? (
                                <div className="w-full h-full  grid place-content-center gap-4">
                                    <h1>An error occurred while fetching</h1>
                                    <Link to = "/admin/" 
                                        className="mt-5 w-[20rem] py-3 cursor-pointer text-center text-size-500 font-medium text-white bg-black text-center"
                                    >
                                        Refresh page
                                    </Link>
                                </div>
                            )
                            : (admins.length === 0) && (<div className="w-full h-full grid place-content-center gap-4">
                                <h1 className="text-center">No sub admins</h1>
                                <Link to = "/admin/" 
                                    className="w-[20rem] py-4 cursor-pointer text-sm font-medium text-white bg-black text-center "
                                >
                                    Refresh page
                                </Link>
                            </div>)
                    }


            </div>
            <div className="mt-6 w-full flex justify-end">
                <div className="w-48 h-10 border-2 border-black flex gap-8">
                    <Button size = "small" className="w-[12rem] justify-center flex">
                        <ArrowLeftIcon />
                    </Button>
                </div>
            </div>

               {/* Editing existing product category */}
        <Modal title = "Edit existing product" isOpen={isEditing} handleModalOpen={() => setIsEditing(prevState => !prevState)}>
            <form id ="edit-category-form" className="w-full">
                {/* {error.status && <Notification message = {error.msg} type = "danger" className="text-white mb-4"/>} */}
                    <div className="w-full">
                        <label htmlFor="category-name" className="text-size-400 text-text-black font-medium mb-3">
                            Category Name
                        </label>
                        <input 
                            type="text" 
                            placeholder="Name a category" 
                            id="category-name" 
                            name="name"
                            
                            className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="category-desc" className="text-size-400 text-text-black font-medium mb-3">
                            Category Description
                        </label>
                        <textarea 
                            name="description" 
                            id="category-desc" 
                            rows={3} 
                            placeholder="Write category descriptions"
                           
                            className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        > 
                        </textarea>
                    </div>
                    <div className="w-full">
                        <label htmlFor="category-banner" className="text-size-400 text-text-black font-medium mb-3">
                            Category Banner
                        </label>
                        <input 
                            type="file"  
                            id="category-banner" 
                            name="banne"
                            
                            className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                    </div>
                    <Button size = "large" className="w-full mt-4 uppercase">{loading ? "Loading..." : "Create catergory"}</Button>
                </form>
        </Modal>

        {/* Deleting existing product category */}
        <Modal title = "Delete existing product" isOpen={isDeleting} handleModalOpen={() => setIsDeleting(prevState => !prevState)}>
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-3">
                    {/* <MessageSquareWarning size = {35} color = "rgb(239 68 68)"/> */}
                    <CircleAlert size = {35} color = "rgb(239 68 68)" />
                    <p>
                        Are you sure u want to delete this Account ?
                    </p>
                </div>
                <div className="flex gap-5 mt-5 border-t border-[#f0f0f0] pt-3">
                    <Button 
                        type="white" 
                        size="medium" 
                        className="text-sm uppercase flex-1"
                        handleClick = {() => setIsDeleting(prevState => !prevState)}
                    >
                        no, cancel
                    </Button>
                    <Button 
                        type="danger" 
                        size="medium"
                         handleClick={() => handleDeleteAccount()}
                        className="text-sm uppercase flex-1"
                    >
                        {loading ? "loading" : "yes, delete"}
                    </Button>
                </div>
            </div>
        </Modal>


        </Container>
  )
}

export default Adminstrators