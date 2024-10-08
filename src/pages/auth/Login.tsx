import { Link, useNavigate } from "react-router-dom";
import FormContainer from "@/components/FormContainer";
import { Mail, LockKeyhole, Info, CircleUserRoundIcon, Eye, EyeOff } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Notification from "@/components/Notification";
import { Headers } from "@/utils/httpRequest";
import { EasyHTTP } from "@/utils/httpRequest";
import Cookies from "js-cookie";
import { useAuth } from "@/context/authContext";
import { AdminType } from "@/types";
import { useLocalStorage } from "@/useLocalStorage";
import Button from "@/components/Button";
import { validateObjectWithStr } from "@/utils/inputValidation";

// interface User{
//     email: {
//         str: string,
//         error: boolean
//     },
//     password: {
//         str: string,
//         error: boolean  
//     }
// }

interface Data{
    email: string;
    password: string;
}

interface Response {
    accesstoken:{
        token:string;
    };
    admin: AdminType;
}

const Login = () => {

    const easyHttp  = new EasyHTTP;
    const { setToken, token, isLogin } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [resError, setResError] = useState<string | null>(null);
    const [response, setResponse] = useState<Response | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { setItem } = useLocalStorage("admin_id");

    console.log(token);

    const [user, setUser] = useState({
        email: {
            str: "",
            error: false,
        },
        password: {
            str: "",
            error: false,
        }
    });

    const [error, setError] = useState<{msg:string; status:boolean}>({
        msg: "",
        status: false,
    });

    console.log(token, isLogin)

    // useEffect for auto redirecting.
    useEffect(()=>{
        if(!!token && isLogin){
            navigate("/admin", {replace: true })
        }
    }, [navigate, token, isLogin]);

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value } = target;

        if(name === "password"){
            setUser({ ...user, [name]: {str: value.trim(), error: false} });
            return;
        }

        setUser({ ...user, [name]: {str: value.toLocaleLowerCase(), error: false} });
    }

    const handleFormSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/i;

        const { email, password } = user;

        if(email.str === "" || password.str === "" ){
            setError({status: true, msg: "All fields are required!"});
            return
        }

        if(!emailRegex.test(email.str)){
            setUser({ ...user, email: { ...email, error: true } });
            return;
        }
        else if(!passwordRegex.test(password.str)){
            setUser({ ...user, password: { ...password, error: true } });
            return;
        }

        const data:Data = {
            email: email.str,
            password: password.str,
        }

        const url = "admin-auth/login";
        const headers: Headers = {
            'Content-type': 'application/json',
            "Accept": "application/json",
        }
        try{
            setLoading(true);
            const response = await easyHttp.post(url, headers, data);
            console.log(response);
            setResponse(response)
            setItem(response?.admin?.id);
        }
         catch (e) {
            setResError((e as Error).message);
            console.log((e as Error).message)
        } finally {
            setLoading(false);
        }

        if(resError !== null){
            return;
        }
        
    }

    // useEffeect for setting tokens
    useEffect(() =>{
        if(response && response !== null){
            const { accesstoken } = response;
            const expires = new Date();
            expires.setDate(expires.getDate() + 30);
            
            
            Cookies.set("admin_auth_token", accesstoken?.token, {
                expires: expires
            });

            setToken(accesstoken.token);

            navigate("/admin", {replace: true })
        }
    }, [navigate, response, setToken]);

    useEffect(() =>{
        let errorRemoval: ReturnType<typeof setTimeout>;
    
        if(error){
           errorRemoval =  setTimeout(() =>{
                setError({status: false, msg: ""});
            }, 2000)
        }
    
        return() => clearTimeout(errorRemoval)
    }, [error]);

    // function to check if all the fields are been filled
    const isFilled = useMemo(() => {
        try {
        return validateObjectWithStr(user);
        } catch (err) {
        return false;
        }
    }, [user]);

  return (
    <>
        <FormContainer position="right">
            <div className="mx-auto mb-2 w-fit h-fit p-3 rounded-full flex items-center justify-center">
              <CircleUserRoundIcon size = {80} color="#121212"/>
            </div>
            <form className="relative bg-white rounded-md shadow-2xl p-5 pt-10" onSubmit={handleFormSubmit}>
              
                {/* <h1 className="text-gray-800 font-bold text-2xl md:text-3xl mb-3 uppercase">Hello Again!</h1>
                <p className="text-md font-normal text-blue mb-8">Welcome Back</p> */}
                {error.status && <Notification message = {error.msg} type = "danger" className="text-white mb-4"/>}
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
                    {user.email.error && <p className="text-red-500 text-size-400 font-normal m-2">Enter a correct email format</p>}
                </div>
                <div>
                    <div className={`flex items-center ${user.password.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                        <LockKeyhole size = {20}/>
                        <input 
                            className="pl-2 w-full outline-none border-none" 
                            type={showPassword ? "text" : "password"}  
                            name="password" 
                            id="password" 
                            value = {user.password.str}
                            placeholder="Password" 
                            onChange={handleInputChange}
                        />
                        <button type = "button" onClick={() => setShowPassword(!showPassword)} className="w-4 h-4 rounded-full flex justify-center items-center">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        {user.password.error && <Info size={20} color=" rgb(239 68 68)" />}
                    </div>
                    {user.password.error && <p className="text-red-500 text-size-400 font-normal m-2">Password contain aphlabets, digits and special characters and be within 8 to 15 characters</p>}
                </div>
                <div className="flex w-full h-fit p-2 mb-3 justify-between">
                    <div className="flex gap-2">
                        <input type="checkbox" name="remember" id="remember" className="w-5 h-5 border-gray"/>
                        <p className="text-sm font-normal text-text-black">Remember me</p>
                    </div>
                    <Link to = "/reset-password/verfiy-email" className="w-fit text-sm text-blue cursor-pointer hover:-translate-y-1 duration-500 transition-all">Forgot Password ?</Link>
                </div>
                <div className="w-full">
                    {/* <button type = "submit" className="px-10 py-4 w-full rounded-md font-roboto text-size-500 uppercase font-semibold bg-black text-white ">
                    {loading ? "Loading..." : "login"}
                    </button> */}
                    <Button 
                        btnType = "submit" 
                        className="px-10 py-4 w-full rounded-md font-roboto text-size-500 uppercase font-semibold bg-black text-white"
                        disabled = {loading || !isFilled}
                    >
                        {loading ? "Loading..." : "Create account"}
                    </Button>
                </div>
                <div className="flex w-full justify-center gap-3 accent-blue mt-4">
                    <Link to = "/signup" className="text-sm ml-2 text-blue cursor-pointer hover:-translate-y-1 duration-500 transition-all">Don't have an account yet? Signup</Link>
                </div>
                
            </form>
        </FormContainer>

        {resError && <div className="absolute w-fit z-60 top-[6rem] left-[1.5rem]">
            <Notification className="rounded-md w-[18rem] text-sm font-medium text-white" message={resError} isCloseIcon = {true} type="danger" />
        </div>}
    </>
  )
}

export default Login