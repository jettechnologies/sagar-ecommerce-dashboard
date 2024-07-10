import FormContainer from "@/components/FormContainer";
import { useNavigate } from "react-router-dom";
import { User, Mail, Info, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import Notification from "@/components/Notification";
// import Button from "../../components/Button";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, CircleUserRoundIcon } from "lucide-react";
// import Select from "@/components/Select";
import { useUserForm } from "../hooks/useUserForm";
import { Headers } from "@/utils/httpRequest";
import PasswordInput from "@/components/Password"

interface StateObj{
 str: string;
 error: boolean;
}
  
interface User{
 name:StateObj;
 email: StateObj;
 password: StateObj;
 contact: StateObj;
 confirmPassword: {str:string, error: boolean};
}

interface Error{
    status: boolean;
    msg: string;
}

interface Data{
    fullname: string; 
    email: string;
    mobile: string; 
    password: string; 
    confirmPassword: string; 
}

const Signup = () => {

    const navigate = useNavigate();
    const { response, getUserFormData, resError, loading } = useUserForm();

    const [user, setUser] = useState<User>({
        name: {str: "", error: false},
        email: {str: "", error: false},
        contact: {str: "", error: false},
        password: {str: "", error: false},
        confirmPassword: {str: "", error: false}
    });
    const [validateError, setValidateError] = useState<Error>({
        status: false,
        msg : ""
    });

      // setting the values of the input fields
  function handleInputChange(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>){
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value } = target;

    if(name === "password" || name == "confirmPassword"){
        setUser({ ...user, [name]: {str: value, error: false} });
        return;
    }

    setUser({ ...user, [name]: {str: value.toLocaleLowerCase(), error: false} });
}


const formSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nameRegex = /^[a-zA-Z\s]*$/;
    // const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i;
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/i;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const {name, password, confirmPassword, email, contact} = user;

    if(name.str === "" || email.str === "" || password.str === "" || confirmPassword.str === "" ){
        setValidateError({status: true, msg: "All fields are required!"});
        return
    }

    if(!nameRegex.test(name.str)){
        setUser({ ...user, name: { ...name, error: true } });
        return;
    }
    else if(!passwordRegex.test(password.str)){
        setUser({ ...user, password: { ...password, error: true } });
        return;
    }
    else if(confirmPassword.str !== password.str){
        setValidateError({status: true, msg: "Passwords do not match!"});
        return
    }
    else if(!emailRegex.test(email.str)){
        setUser({ ...user, email: { ...email, error: true } });
        return;
    }

  console.log(resError);

    const data:Data = {
        email:email.str,
        fullname: name.str,
        password: password.str,
        confirmPassword:confirmPassword.str,
        mobile: contact.str,
    }

    console.log(data);

    const url = "admin-auth/register";
    const headers: Headers = {
        'Content-type': 'application/json',
        "Accept": "application/json",
    }

    try {
        await getUserFormData(url, headers, data);
        if(resError !== null){
            return;
        }

        navigate("/otp", { replace: true, state: { email: user.email.str } });
      } catch (e) {
        console.error(e);
    }
}

useEffect(() =>{
    let errorRemoval: ReturnType<typeof setTimeout>;

    if(validateError){
       errorRemoval =  setTimeout(() =>{
            setValidateError({status: false, msg: ""});
        }, 2000)
    }

    return() => clearTimeout(errorRemoval)
}, [validateError]);


  return (
    <>
        <FormContainer className="relative">
          <div className="mx-auto mb-2 w-fit h-fit p-3 rounded-full flex items-center justify-center">
              <CircleUserRoundIcon size = {80} color="#121212"/>
            </div>
            <form className="bg-white rounded-md shadow-2xl p-5" onSubmit={formSubmit}>
                <h1 className="text-gray-800 font-bold text-2xl md:text-3xl mb-3 uppercase">Sign up</h1>
                <p className="text-md font-normal text-blue mb-8">Create a new admin account</p>
                {validateError.status && <Notification message = {validateError.msg} type = "danger" className="text-white mb-4"/>}
                <div>
                    <div className={`flex items-center ${user.name.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                        <User size = {20}/>
                        <input 
                            className="pl-2 w-full outline-none border-none" 
                            type="text" 
                            name="name" 
                            id="name" 
                            placeholder="Fullname" 
                            onChange={handleInputChange}
                        />
                        {user.name.error && <Info size={20} color=" rgb(239 68 68)" />}
                    </div>
                    {user.name.error && <p className="text-red-500 text-size-400 font-normal m-2">Fullname should be alphabets only </p>}
                </div>
                <div>
                    <div className={`flex items-center ${user.email.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                        <Mail size = {20}/>
                        <input 
                            className="pl-2 w-full outline-none border-none" 
                            type="text" 
                            name="email" 
                            id="email" 
                            placeholder="Email" 
                            onChange={handleInputChange}
                        />
                        {user.email.error && <Info size={20} color=" rgb(239 68 68)" />}
                    </div>
                    {user.email.error && <p className="text-red-500 text-size-400 font-normal m-2">Enter a correct email address</p>}
                </div>
                <div>
                    <div className={`flex items-center ${user.email.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                        <Phone size = {20}/>
                        <input 
                            className="pl-2 w-full outline-none border-none" 
                            type="number" 
                            name="contact" 
                            id="contact" 
                            placeholder="contact" 
                            onChange={handleInputChange}
                        />
                        {user.contact.error && <Info size={20} color=" rgb(239 68 68)" />}
                    </div>
                    {user.contact.error && <p className="text-red-500 text-size-400 font-normal m-2">Enter a correct email format</p>}
                </div>
                {/* <div>
                    <div className={`flex items-center ${user.password.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                        <LockKeyhole size = {20}/>
                        <input 
                            className="pl-2 w-full outline-none border-none" 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="Password" 
                            onChange={handleInputChange}
                        />
                        {user.password.error && <Info size={20} color=" rgb(239 68 68)" />}
                    </div>
                    {user.password.error && <p className="text-red-500 text-size-400 font-normal m-2">Password contain aphlabets, digits and special characters and be within 8 to 15 characters</p>}
                </div>
                <div>
                    <div className={`flex items-center ${user.confirmPassword.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                        <LockKeyhole size = {20}/>
                        <input 
                            className="pl-2 w-full outline-none border-none" 
                            type="password" 
                            name="confirmPassword" 
                            id="comfirm-password" 
                            placeholder="Confirm Password" 
                            onChange={handleInputChange}
                        />
                        {user.confirmPassword.error && <Info size={20} color=" rgb(239 68 68)" />}
                    </div>
                    {user.confirmPassword.error && <p className="text-red-500 text-size-400 font-normal m-2">Password contain aphlabets, digits and special characters and be within 8 to 15 characters</p>}
                </div> */}
                <PasswordInput name = "password" placeholder = "Password" password = {user.password} setPassword={(newValue) => setUser({...user, password: newValue})}/>
                <PasswordInput name = "confirmPassword" placeholder = "Confirm Password" password={user.confirmPassword} setPassword={(newValue) => setUser({...user, confirmPassword: newValue})}/>
                <div className="w-full h-fit flex flex-col gap-y-3"></div>
                <div className="w-full h-fit flex flex-col gap-y-3">
                    <button type = "submit" className="px-10 py-4 w-full rounded-md font-roboto text-size-500 uppercase font-semibold bg-black text-white">
                        {loading ? "Loading..." : "Create account"}
                    </button>
                    <Link to = "/" className="p-3 w-full hover:-translate-y-1 duration-500 transition-all text-blue text-size-500 font-medium capitalize flex gap-3 justify-center items-center">
                        <ArrowLeftIcon className="w-5 h-5 text-blue" />
                        back home
                    </Link>
                </div>
            </form>
        </FormContainer>

       {response && <div className="absolute w-fit z-60 top-[6rem] right-[1.5rem]">
            <Notification className="rounded-md w-[15rem] text-sm font-medium text-white" message={response} isCloseIcon = {true} type="success" />
        </div>}
        {resError && <div className="absolute w-fit z-60 top-[6rem] right-[1.5rem]">
            <Notification className="rounded-md w-[15rem] text-sm font-medium text-white" message={resError} isCloseIcon = {true} type="danger" />
        </div>}
    </>
  )
}

export default Signup