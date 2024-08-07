import { useNavigate } from "react-router-dom";
import FormContainer from "@/components/FormContainer";
import { CircleUserRoundIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Notification from "@/components/Notification";
import { EasyHTTP } from "@/utils/httpRequest";
import PasswordInput from "@/components/Password";

interface Reset{
    password: {
      str: string;
      error: boolean},
    confirmPassword: {
      str: string;
      error: boolean},  
}

interface ErrorType{
  status: boolean;
  msg: string;
}

const easyHttp = new EasyHTTP();

const ResetPassword = () => {

    const navigate = useNavigate();

    const [reset, setReset] = useState<Reset>({
        password: {
          str: "",
          error: false,
        },
        confirmPassword: {
          str: "",
          error: false,
        },
    });

    const [error, setError] = useState<ErrorType>({
      status: false,
      msg : ""
    });

    const [resError, setResError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
    //     const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    //     const { name, value } = target;

    //     setReset({ ...reset, [name]: {str: value.trim(), error: false} });
    // }

    const handleFormSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/i;
        const { password, confirmPassword } = reset;

        if(password.str === "" || confirmPassword.str === "" ){
          setError({status: true, msg: "All fields are required!"});
          return
        }

        if(!passwordRegex.test(password.str)){
          setReset({ ...reset, password: { ...password, error: true } });
          return;
        }
        else if(!passwordRegex.test(confirmPassword.str)){
          setReset({ ...reset, confirmPassword: { ...confirmPassword, error: true } });
          return;
        }
        else if(confirmPassword.str !== password.str){
          setError({status: true, msg: "Passwords do not match!"});
          return
      }

      const localStorage = window.localStorage.getItem("admin_id");
      if(!localStorage) return;
      const userId = JSON.parse(localStorage);

      const url = "admin-auth/reset-password";
        const data = {
            password: password.str,
            confirmPassword: confirmPassword.str,
        }
      
        const headers:HeadersInit = {
          "Content-Type": "application/json",
          id: userId,
        }

        // console.log(data);
        try{
          setLoading(true);
          const response = await easyHttp.patch(url, headers, data);
          console.log(response);
          navigate("/login", { replace: true });

        }
        catch(err){
            console.log((err as Error).message);
            setResError((err as Error).message);
        }
        finally{
          setLoading(false)
        }

    }

    useEffect(() =>{
        let errorRemoval: ReturnType<typeof setTimeout>;
    
        if(error){
           errorRemoval =  setTimeout(() =>{
            setError({status: false, msg: ""});
            }, 2000)
        }
    
        return() => clearTimeout(errorRemoval)
    }, [error]);

  return (
    <>
        <FormContainer>
            <div className="mx-auto mb-2 w-fit h-fit p-3 rounded-full flex items-center justify-center">
              <CircleUserRoundIcon size = {80} color="#121212"/>
            </div>
            <form className="relative bg-white rounded-md shadow-2xl p-5 pt-10" onSubmit={handleFormSubmit}>
              
                <h2 className="text-gray-800 font-bold text-sm md:text-xl mb-3 uppercase">Create a new password</h2>
                {/* <p className="text-md font-normal text-blue mb-8 text-center">Enter email u want the mail link to be sent to</p> */}
                {error.status && <Notification message = {error.msg} type = "danger" className="text-white mb-4"/>}
                {resError && <Notification message = {resError} type = "danger" className="text-white mb-4"/>}
                {/* <div>
                    <div className={`flex items-center ${reset.password.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                        <LockKeyhole size = {20}/>
                        <input 
                            className="pl-2 w-full outline-none border-none" 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="Password" 
                            onChange={handleInputChange}
                        />
                        {reset.password.error && <Info size={20} color=" rgb(239 68 68)" />}
                    </div>
                    {reset.password.error && <p className="text-red-500 text-size-400 font-normal m-2">Password contain aphlabets, digits and special characters and be within 8 to 15 characters</p>}
                </div>
                <div>
                    <div className={`flex items-center ${reset.confirmPassword.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                        <LockKeyhole size = {20}/>
                        <input 
                            className="pl-2 w-full outline-none border-none" 
                            type="password" 
                            name="confirmPassword" 
                            id="comfirm-password" 
                            placeholder="Confirm Password" 
                            onChange={handleInputChange}
                        />
                        {reset.confirmPassword.error && <Info size={20} color=" rgb(239 68 68)" />}
                    </div>
                    {reset.confirmPassword.error && <p className="text-red-500 text-size-400 font-normal m-2">Password contain aphlabets, digits and special characters and be within 8 to 15 characters</p>}
                </div> */}
                <PasswordInput name = "password" placeholder = "Password" password = {reset.password} setPassword={(newValue) => setReset({...reset, password: newValue})}/>
                <PasswordInput name = "confirmPassword" placeholder = "Confirm Password" password={reset.confirmPassword} setPassword={(newValue) => setReset({...reset, confirmPassword: newValue})}/>
                <div className="w-full h-fit flex flex-col gap-y-3"></div>
                <div className="w-full">
                    <button type = "submit" className="px-10 py-4 w-full rounded-md font-roboto text-size-500 uppercase font-semibold bg-black text-white ">
                        {loading ? "Loading..." : "verify email"}
                    </button>
                </div>
            </form>
        </FormContainer>
    </>
  )
}

export default ResetPassword