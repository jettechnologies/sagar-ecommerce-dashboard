import { CircleUserRound, Contact } from "lucide-react";
import Container from "@/components/Container";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { User, Info, Mail, Shield, LockKeyhole, Earth } from "lucide-react";
// import Notification from "@/components/Notification";
import { Headers } from "@/utils/httpRequest";
import { AdminRegistrationResponse } from "@/types";
import Modal from "@/components/Modal";
import CopyToClipboard from "@/components/CopyToClipBoard";
import { Nationalities } from "@/data";
import { useAuth } from "@/context/authContext";
import Toast from "@/components/Toast";

interface StateObj{
    str: string;
    error: boolean;
   }

  interface AdminData {
    email: StateObj;
    fullname: StateObj;
    password: StateObj;
    confirmPassword: StateObj;
    mobile: StateObj;
    adminType: StateObj;
    accesslevel:StateObj;
    nationality: StateObj;
  }

  interface Error{
    status: boolean;
    msg: string;
}

  const adminTypes:{key:string; value:string}[] = [
    { "key": "otherAdmin", "value": "Other Admin" },
    { "key": "SuperAdmin", "value": "super admin" }
  ]
  
  const accessLevels:{key:string; value:string}[] = [
    { "key": "level1", "value": "Level one" },
    { "key": "level2", "value": "level two" },
    { "key": "level3", "value": "level three" }
  ]

  interface Data{
    fullname: string;
    email: string;
    mobile: string;
    accesslevel: string;
    adminType: string;
    password: string;
    confirmPassword: string;
    Nationality: string;
  }

// interface Response{
//     [key:string]: any;
// }

const CreateAdmin = () => {

    // const { response, getUserFormData, resError, loading } = useUserForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resError, setResError] = useState<string | null>(null);
    const [response, setResponse] = useState<AdminRegistrationResponse | null>(null)

    const navigate = useNavigate();
    const [adminData, setAdminData] = useState<AdminData>({
        email: { str: "", error: false},
        fullname: { str: "", error: false},
        password: { str: "", error: false},
        confirmPassword: { str: "", error: false},
        mobile: { str: "", error: false},
        adminType: { str: "", error: false},
        accesslevel: { str: "", error: false},
        nationality: { str: "", error: false },
    });
    const { token } = useAuth();

    const [validateError, setValidateError] = useState<Error>({
        status: false,
        msg : ""
    });

    useEffect(() =>{
        let errorRemoval: ReturnType<typeof setTimeout>;
    
        if(validateError){
           errorRemoval =  setTimeout(() =>{
                setValidateError({status: false, msg: ""});
            }, 2000)
        }
    
        return() => clearTimeout(errorRemoval)
    }, [validateError]);

    const handleInputChange = (
        e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) =>{
        const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const { name, value } = target;

        if(name === "password" || name == "confirmPassword" || name == "adminType"){
            setAdminData({ ...adminData, [name]: {str: value.trim(), error: false} });
            return;
        }

        setAdminData({ ...adminData, [name]: {str: value.toLocaleLowerCase().trim(), error: false} });
          
    }

    const handleFormSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const nameRegex = /^[a-zA-Z\s]*$/;
        // const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i;
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/i;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    

        console.log(setAdminData);

        const {fullname, password, confirmPassword, nationality, email, mobile, adminType, accesslevel} = adminData;
    
        if(fullname.str === "" || email.str === "" || adminType.str === "" || accesslevel.str === "" || password.str === "" || confirmPassword.str === "" ){
            setValidateError({status: true, msg: "All fields are required!"});
            return
        }
    
        if(!nameRegex.test(fullname.str)){
            setAdminData({ ...adminData, fullname: { ...fullname, error: true } });
            return;
        }
        else if(!passwordRegex.test(password.str)){
            setAdminData({ ...adminData, password: { ...password, error: true } });
            return;
        }
        else if(confirmPassword.str !== password.str){
            setValidateError({status: true, msg: "Passwords do not match!"});
            return
        }
        else if(!emailRegex.test(email.str)){
            setAdminData({ ...adminData, email: { ...email, error: true } });
            return;
        }
        
        const data:Data = {
            email:email.str,
            fullname: fullname.str,
            password: password.str,
            confirmPassword:confirmPassword.str,
            mobile: mobile.str,
            adminType: adminType.str,
            accesslevel: accesslevel.str,
            Nationality: nationality.str,
        }

        console.log(data);
    
        // const url = "admins-mgt/register";
        const headers: Headers = {
            'Content-type': 'application/json',
            "Accept": "application/json",
            'Authorization': `Bearer ${token}`,
        }
    
        // try {
        //     await getUserFormData(url, headers, data);
        //     if(resError !== null){
        //         return;
        //     }
        //   } catch (e) {
        //     console.error(e);
        // }

        try {
            setLoading(true);
            const res = await fetch(
                "https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/admins-mgt/register",
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify(data)
                }
            )
    
            if (res.ok) {
                console.log('Product created successfully');
                console.log(res)
                const data = await res.json();
                setResponse(data);

                setIsModalOpen(true);

                // setResponse('Product created successfully');
            } else {
                const errorData = await res.json();
                console.error('Failed to create product:', errorData.message);
                // setResError('Failed to create product: ' + errorData.message);
            }
        } catch (error: any) {
            console.error('Error:', error.message);
            // setResError('Failed to create product');
            setResError(error.message)
        } finally {
            setLoading(false);
        }
    }


    useEffect(() =>{
        if(response !== null){
            console.log(response);
        }
    }, [response])



    console.log(response);
const copyResponse = useCallback(() => {
  let userInfo: string | undefined;
  if (response) {
    const resArr = response?.loginCredential?.split("\n");
    const email = resArr?.[0]?.split(":")[1]?.trim();
    const password = resArr?.[1]?.split(":")[1]?.trim();

    if (email && password) {
      userInfo = `${email} ${password}`;
    }
  }

  return userInfo;
}, [response]);

  return (
    <Container className ="mt-4 min-h-screen grid place-items-center relative">
        <div className="min-h-1/2 w-fit border border-[#c0c0c0] rounded-md py-2 flex flex-col gap-y-6 items-center">
            <CircleUserRound size = {80} strokeWidth={1} color="#121212"/>
            {/* {validateError.status && <Notification message = {validateError.msg} type = "danger" className="text-white mb-4"/>} */}
            <form onSubmit={handleFormSubmit} className="w-[30rem] p-4">
                <div id = "create-admin-form"  className="w-full h-fit flex flex-col ">
                <div>
                    <div className={`flex items-center ${adminData.fullname.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                        <User size = {20}/>
                        <input 
                            className="pl-2 w-full outline-none border-none" 
                            type="text" 
                            name="fullname" 
                            id="name" 
                            placeholder="Enter fullname" 
                            onChange={handleInputChange}
                        />
                        {adminData.fullname.error && <Info size={20} color=" rgb(239 68 68)" />}
                    </div>
                    {adminData.fullname.error && <p className="text-red-500 text-size-400 font-normal m-2">Enter a name with only alphabets</p>}
                </div>
                <div>
                    <div className={`flex items-center ${adminData.email.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                        <Mail size = {20}/>
                        <input 
                            className="pl-2 w-full outline-none border-none" 
                            type="text" 
                            name="email" 
                            id="email" 
                            placeholder="Enter email address" 
                            onChange={handleInputChange}
                        />
                        {adminData.email.error && <Info size={20} color=" rgb(239 68 68)" />}
                    </div>
                    {adminData.email.error && <p className="text-red-500 text-size-400 font-normal m-2">Enter a correct email format</p>}
                </div>
                <div>
                    <div className={`flex items-center ${adminData.mobile.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                        <Contact size = {20}/>
                        <input 
                            className="pl-2 w-full outline-none border-none" 
                            type="text" 
                            name="mobile" 
                            id="mobile" 
                            placeholder="Enter phone number" 
                            onChange={handleInputChange}
                        />
                        {adminData.mobile.error && <Info size={20} color=" rgb(239 68 68)" />}
                    </div>
                    {adminData.mobile.error && <p className="text-red-500 text-size-400 font-normal m-2">Enter a correct email format</p>}
                </div>
                <div>
                    <div className={`flex px-3 items-center ${adminData.email.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 rounded-md`}>
                        <Earth size = {20}/>
                        <div className="w-full h-full">
                            <Select
                                id="nationality"
                                name="nationality"
                                className="font-normal text-sm w-full py-3"
                                select={Nationalities}
                                value={adminData?.nationality?.str}
                                defaultText="Select your nationality"
                                handleInputChange={handleInputChange}
                            />
                        </div>
                        {adminData.nationality.error && <Info size={20} color=" rgb(239 68 68)" />}
                    </div>
                    {adminData.nationality.error && <p className="text-red-500 text-size-400 font-normal m-2">Enter a correct email format</p>}
                </div>
                    <div>
                        <div className={`flex items-center ${adminData.password.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                            <LockKeyhole size = {20}/>
                            <input 
                                className="pl-2 w-full outline-none border-none" 
                                type="password" 
                                name="password" 
                                id="password" 
                                placeholder="Password" 
                                onChange={handleInputChange}
                            />
                            {adminData.password.error && <Info size={20} color=" rgb(239 68 68)" />}
                        </div>
                        {adminData.password.error && <p className="text-red-500 text-size-400 font-normal m-2">Password contain aphlabets, digits and special characters and be within 8 to 15 characters</p>}
                </div>
                <div>
                    <div className={`flex items-center ${adminData.confirmPassword.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                        <LockKeyhole size = {20}/>
                        <input 
                            className="pl-2 w-full outline-none border-none" 
                            type="password" 
                            name="confirmPassword" 
                            id="comfirm-password" 
                            placeholder="Confirm Password" 
                            onChange={handleInputChange}
                        />
                        {adminData.confirmPassword.error && <Info size={20} color=" rgb(239 68 68)" />}
                    </div>
                    {adminData.confirmPassword.error && <p className="text-red-500 text-size-400 font-normal m-2">Password contain aphlabets, digits and special characters and be within 8 to 15 characters</p>}
                </div>
                    <div className="flex gap-x-6">
                        <div>
                            <div className={`flex items-center ${adminData.adminType.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                                <User size = {20}/>
                                <Select
                                    id = "admin-type" 
                                    name="adminType" 
                                    select={adminTypes} 
                                    className="font-normal text-[#c0c0c0] w-full p-0 border-none outline-none" 
                                    defaultText="Select admin type"
                                    value={adminData?.adminType.str}
                                    handleInputChange={handleInputChange}
                                />
                                {adminData.adminType.error && <Info size={20} color=" rgb(239 68 68)" />}
                            </div>
                        {adminData.adminType.error && <p className="text-red-500 text-size-400 font-normal m-2">Select a specific admin</p>}
                        </div>
                        <div>
                            <div className={`flex items-center ${adminData.accesslevel.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                                <Shield size = {20}/>
                                <Select 
                                id = "access-level" 
                                name="accesslevel" 
                                select={accessLevels} 
                                className="font-normal text-[#c0c0c0] w-full p-0 border-none outline-none" 
                                defaultText="Select access level"
                                value={adminData?.accesslevel?.str}
                                handleInputChange={handleInputChange}
                                />
                                {adminData.accesslevel.error && <Info size={20} color=" rgb(239 68 68)" />}
                            </div>
                            {adminData.accesslevel.error && <p className="text-red-500 text-size-400 font-normal m-2">Select a specific admin</p>}
                        </div>
                    </div>
                </div>
                <Button btnType = "submit" size = "large" className="w-full mt-4">{loading ? "Loading" : "Create Admin"}</Button>
            </form>
        </div>
        {resError && 
        // <div className="absoulte w-[30rem] top-0 right-0">
        //     <Notification type = "danger" message = {resError} className = "text-white first-letter:uppercase"  />
        // </div>
            <Toast type = "error" message = {resError}  /> 
        }

        {/* modal for copying the response */}
        <Modal title = "New user Created" isOpen={isModalOpen} handleModalOpen={() => setIsModalOpen(prevState => !prevState)}>
            <div className="flex flex-col w-full">
                <div className="flex flex-col items-center gap-3">
                   <p className="text-size-400 text-black">
                        New User created with email and password
                   </p>
                </div>
                <CopyToClipboard text={copyResponse()}>
                    <div className="flex gap-5 mt-5 border-t border-[#f0f0f0] pt-3">
                        <Button  
                            size="small"
                            handleClick={() => {
                                setIsModalOpen(prevState => !prevState)
                                navigate("/admin/accounts", {replace: true})
                            }}
                            className="text-sm uppercase flex-1"
                        >
                            Continue
                        </Button>
                    </div>
                </CopyToClipboard>
            </div>
        </Modal>

        {(validateError.status && validateError?.msg !== "") && <Toast message = {validateError.msg} type = "error" />}
    </Container>
  )
}

export default CreateAdmin