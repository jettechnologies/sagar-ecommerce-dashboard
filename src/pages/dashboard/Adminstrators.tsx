import Container from "@/components/Container";
import { Link, useNavigate } from "react-router-dom";
import { CirclePlusIcon, GripHorizontal, Trash, CircleAlert, Shield, User2, Search } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "@/components/Image";
import Button from "@/components/Button";
import { AdminDataType } from "@/types";
import Spinner from "@/components/Spinner";
import Popup from "@/components/Popup";
import Modal from "@/components/Modal";
import { EasyHTTP } from "@/utils/httpRequest";
import { ArrowLeftIcon, ArrowRightIcon } from "@/icons/svg";
import { useAuth } from "@/context/authContext";
import Select from "@/components/Select";
import Notification from "@/components/Notification";
import ErrorModal from "@/components/ErrorModal";


const adminTypes:{key:string; value:string}[] = [
    { "key": "otherAdmin", "value": "Other Admin" },
    { "key": "SuperAdmin", "value": "super admin" }
  ]
  
  const accessLevels:{key:string; value:string}[] = [
    { "key": "level1", "value": "Level one" },
    { "key": "level2", "value": "level two" },
    { "key": "level3", "value": "level three" }
  ]

//   type SearchAdminResponse = {
//     message: string;
//     searchedRider: [AdminType[], number];
//   }

const easyHttp = new EasyHTTP();

const Adminstrators = () => {

    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    // const [response, setResponse] = useState<[AdminType[], number] | null>(null)
    const [admins, setAdmins] = useState<AdminDataType [] | []>([]);
    const [currentId, setCurrentId] = useState("");
    const [activePopupId, setActivePopupId] = useState<number | null>(null);
    const [changeType, setChangeType] = useState(false);
    const [changeLevel, setChangeLevel] = useState(false);
    const [adminChange, setAdminChange] = useState({
        adminType: "",
        accesslevel: "",
    });
    const [adminSearch, setAdminSearch] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const { token } = useAuth();

    const searchRef = useRef<HTMLInputElement>(null);

    console.log(token, loading);

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

    const mapResponsesToAdminDataArray = useCallback((responses: any[]): AdminDataType[] => {
        return responses.map((response) => mapResponseToAdminData(response));
      }, [])

      const getAllAdmins = useCallback(async (token:string) => {
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
  
            const adminData: AdminDataType[] = mapResponsesToAdminDataArray(data[0]);
            console.log(adminData)
            setAdmins(adminData);
        } catch (e : any) {
          console.log(e.message);
          setError(e.message);
        } finally {
          setLoading(false);
        }
    }, [mapResponsesToAdminDataArray]);
  

useEffect(() =>{
    if (!token) return;

    if(adminSearch === ""){
        getAllAdmins(token)
    }
}, [token, getAllAdmins, adminSearch]);


    const handlePopupToggle = (id:number) => {
        setActivePopupId(prevId => (prevId === id ? null : id));
    };

    // handling editing of a category
    const handleChangeType = (id:number)  =>{
        setChangeType(prevState => !prevState)

        setCurrentId(String(id))
    }

    // handng admin chnagee level
    const handleChangeLevel = (id:number)  =>{
        setChangeLevel(prevState => !prevState)

        setCurrentId(String(id))
    }

    // Stuff for deleting a category
    const handleIsDeleting = (id:number) =>{
        setIsDeleting(prevState => !prevState);

        setCurrentId(String(id))
    }

    // function for changing admin type and level

    const handleInputChange = (
        e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) =>{
        const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const { name, value } = target;

        setAdminChange({ ...adminChange, [name]: value.trim() });          
    }

    console.log(adminChange);

    const changeAdminType = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(adminChange.adminType !== ""){
            const url = `admins-mgt/change-other-admin-admintype/${currentId}`;
            const headers = {
                'Authorization': `Bearer ${token}`,
            }

            const data = {
                adminType: adminChange.adminType
            }

            try{
                setLoading(true)
                const res = await easyHttp.patch(url, headers, data);
                console.log(res);
            }
            catch(e){
                console.log((e as Error).message)
                setError((e as Error).message);
            }
            finally{
                setLoading(false)
            }

            if(error !== null){
                return;
            }

            setChangeType(prevState => !prevState);

            // window.location.reload();
            navigate("/admin/accounts", {replace: true});
        }
    }

    console.log(adminChange);

    const changeAdminLevel = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(adminChange.accesslevel !== ""){
            const url = `admins-mgt/change-other-admin-accesslevel/${currentId}`;
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }

            const data = {
                accesslevel: adminChange.accesslevel
            }

            try{
                setLoading(true)
                // const res = await easyHttp.patch(url, headers, data);
                // console.log(res);
                const res  = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}${url}`, {
                    method:"PATCH",
                    headers,
                    body: JSON.stringify(data)
                });

                if (!res.ok) {
                    console.error(`Error fetching cart: ${res.status} - ${res.statusText}`);
                    return;
                }

                const response = await res.json();
                console.log(response);

            }   
            catch(e){
                console.log((e as Error).message)
                setError((e as Error).message);
            }
            finally{
                setLoading(false)
            }

            if(error !== null){
                return;
            }

            setChangeType(prevState => !prevState);

            // window.location.reload();
            navigate("/admin/accounts", {replace: true});
        }
    }

    const handleDeleteAccount = async() =>{
        // const id = string(currentId);
        const url = `admins-mgt/delete-other-admin/${currentId}`;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }

        try{
            setLoading(true)
            const res = await easyHttp.delete(url, headers);
            console.log(res);
            setIsDeleting(prevState => !prevState);
            window.location.reload();
            navigate("/admin/accounts", {replace: true});
        }
        catch(e){
            console.log((e as Error).message)
            const error = JSON.parse((e as Error).message);
            if(error.status === 404){
                setError("Admin not found");
            }
            else{
                setError(error.message);
            }
        }
        finally{
            setLoading(false)
        }

    }

    useEffect(() =>{
        let errorRemoval: ReturnType<typeof setTimeout>;
    
        if(error){
           errorRemoval =  setTimeout(() =>{
                setError(null);
            }, 2000)
        }
    
        return() => clearTimeout(errorRemoval)
    }, [error]);

    console.log(admins);

    const searchAdmin = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        if(!adminSearch) return;

        const url = `admins-mgt/search-other-admin?keyword=${adminSearch}`;
        const headers = {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        try{
            setLoading(true)
            const res = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}${url}`, {
                method: "GET",
                headers
            });

            const response = await res.json();
            if(res.status === 404) throw new Error(response.message)

            console.log(response.data);
            const adminData: AdminDataType[] = mapResponsesToAdminDataArray(response.data);
            console.log(adminData)
            setAdmins(adminData);
        }
        catch(err){
            console.log((err as Error).message);
            setSearchError((err as Error).message)
        }
        finally{
            setLoading(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log("working")
        if ((e.key === 'Backspace' || e.key === 'Delete') && adminSearch === "") {
          // Handle delete key and backspace
        //   s('');
            setAdminSearch("");
            console.log("deleting")
        }
      };


    // useEffect to change the setSearchAdmin state
    useEffect(() => {
        const inputElement = document.getElementsByTagName('input')[0];
    
        const handleKeyPress = (e: KeyboardEvent) => {
          if ((e.key === 'Backspace' || e.key === 'Delete') && adminSearch === "") {
            // Handle delete key and backspace
            setAdminSearch("");
            console.log("deleting")
          }
          
        };
    
        inputElement.addEventListener('keydown', handleKeyPress);
    
        return () => {
          inputElement.removeEventListener('keydown', handleKeyPress);
        };
      }, [adminSearch]);
    
  return (
    <>
        <div className="min-h-16 w-full">
        <Container >
            <div className="flex justify-between">
            <form onSubmit={searchAdmin}  className="w-fit">
                <div className="w-full flex items-center p-1 border border-black focus-within:border-blue focus-within:border-2 rounded-md">
                    <input
                        type="text"
                        ref = {searchRef}
                        placeholder="Search for admins"
                        onChange={(e) => setAdminSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-[25em] h-10 border-none outline-none text-text-black bg-transparent pl-2"
                    />
                    <button type = "submit" className="p-2 cursor-pointer">
                        <Search color="#c0c0c0" />
                    </button>
                </div>
            </form>
            <Link to = "create-admin" className="text-size-xs px-6 py-2 flex gap-2 bg-black rounded-md text-white items-center justify-center font-normal">
                <CirclePlusIcon color="#fff"/>
                Create Admin
            </Link>
            </div>
        </Container>
    </div>
    <Container className="mt-4 min-h-screen">
            <div className="flex justify-between items-center w-full mb-4">
                <h3 className="font-semibold text-size-500 text-text-bold">
                    Administrators
                </h3>
                {/* <Link to = "create-admin" className="text-size-xs px-6 py-2 flex gap-2 bg-black rounded-md text-white items-center justify-center font-normal">
                    <CirclePlusIcon color="#fff"/>
                    Create Admin
                </Link> */}
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
                                                            handleClick = {() => handleChangeType(admin.id)}
                                                            className="capitalize border-none bg-transparent flex gap-x-5 text-sm items-center"
                                                        >
                                                            <User2 />
                                                            Change Admin Type
                                                        </Button>
                                                    </div>
                                                    <div className="flex w-full border-b border-[#f0f0f0]">
                                                        <Button 
                                                            size="small" 
                                                            type="white" 
                                                            className="capitalize border-none bg-transparent flex gap-5 text-sm items-center"
                                                            handleClick = {() => handleChangeLevel(admin.id)}
                                                        >
                                                            <Shield />
                                                            Change Access level
                                                        </Button>
                                                    </div>
                                                    <div className="flex w-full border-b border-[#f0f0f0]">
                                                        <Button 
                                                            size="small" 
                                                            type="white" 
                                                            className="capitalize border-none bg-transparent flex gap-5 text-sm items-center"
                                                            handleClick = {() => handleIsDeleting(admin.id)}
                                                        >
                                                            <Trash />
                                                            Delete Admin
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
                                <div className="w-full h-screen grid place-content-center gap-4">
                                    <h1>{error}</h1>
                                    <Link to = "/admin/dashboard" 
                                        className="mt-5 w-[20rem] py-3 cursor-pointer text-size-500 font-medium text-white bg-black text-center"
                                    >
                                        Refresh page
                                    </Link>
                                </div>
                            )
                            : admins.length === 0 && (<div className="w-full h-full grid place-content-center gap-4">
                                <h1 className="text-center">No sub admins</h1>
                                <Link to = "/admin/" 
                                    className="w-[20rem] py-4 cursor-pointer text-sm font-medium text-white bg-black text-center "
                                >
                                    Refresh page
                                </Link>
                            </div>)
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
        
                <Modal title = "change admin type" isOpen={changeType} handleModalOpen={() => setChangeType(prevState => !prevState)}>
                    <form id ="edit-admin-type" onSubmit={changeAdminType} className="w-full">
                        {error && <Notification message = {error} type = "danger" className="text-white mb-4"/>}
                            <div className="w-full">
                                <label htmlFor="admin-type" className="text-size-500 font-medium text-text-black mb-4">
                                    Select admin type
                                </label>
                                <div className={`flex items-center border-2 border-gray focus-within:border-blue mb-3 py-3 px-3 rounded-md mt-3`}>
                                    <User2 size = {20}/>
                                    <Select
                                        id = "admin-type" 
                                        name="adminType" 
                                        select={adminTypes} 
                                        className="font-normal text-text-black w-full p-0 border-none outline-none" 
                                        defaultText="Select admin type"
                                        handleInputChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <Button size = "large" className="w-full mt-4 uppercase">{loading ? "Loading..." : "Change admin type"}</Button>
                        </form>
                </Modal>

                {/* for changing the admin level */}
                <Modal title = "change admin level" isOpen={changeLevel} handleModalOpen={() => setChangeLevel(prevState => !prevState)}>
                    <form id ="edit-admin-level" onSubmit={changeAdminLevel} className="w-full">
                        {error && <Notification message = {error} type = "danger" className="text-white mb-4"/>}
                            <div className="w-full">
                                <label htmlFor="admin-level" className="text-size-500 font-medium text-text-black mb-4">
                                    Select admin level
                                </label>
                                <div className={`flex items-center border-2 border-gray focus-within:border-blue mb-3 py-3 px-3 rounded-md mt-3`}>
                                    <User2 size = {20}/>
                                    <Select
                                        id = "admin-level" 
                                        name="accesslevel" 
                                        select={accessLevels} 
                                        className="font-normal text-text-black w-full p-0 border-none outline-none" 
                                        defaultText="Select admin level"
                                        handleInputChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <Button size = "large" className="w-full mt-4 uppercase">{loading ? "Loading..." : "Change admin level"}</Button>
                        </form>
                </Modal>


        {/* Deleting existing product category */}
        <Modal title = "Delete other admins" isOpen={isDeleting} handleModalOpen={() => setIsDeleting(prevState => !prevState)}>
            <div className="flex flex-col w-full">
                {error && <Notification message = {error} type = "danger" className="text-white mb-4"/>}
                <div className="flex items-center gap-3">
                    {/* <MessageSquareWarning size = {35} color = "rgb(239 68 68)"/> */}
                    <CircleAlert size = {35} color = "rgb(239 68 68)" />
                    <p>
                        Are you sure you want to delete this Account ?
                    </p>
                </div>
                <div className="flex gap-5 mt-5 border-t border-[#f0f0f0] pt-3">
                    <Button 
                        type="white" 
                        size="medium" 
                        className="text-sm uppercase flex-1"
                        handleClick = {() => {
                            setError(null)
                            setIsDeleting(prevState => !prevState)
                        }}
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

        <ErrorModal title = "Administrator not found" error={searchError} setError={() => setSearchError(null)} redirect="/admin/accounts"/>

        </Container>
    </>
  )
}

export default Adminstrators