import { useNavigate } from "react-router-dom";
import FormContainer from "@/components/FormContainer";
import { Mail, Info, CircleUserRoundIcon } from "lucide-react";
import { useState } from "react";
// import Notification from "@/components/Notification";

interface Email{
    str: string;
    error: boolean;
}

const VerifyEmail = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState<Email>({
        str: "",
        error: false,
    });

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const value = target.value;

        setEmail({str: value.toLocaleLowerCase(), error: false});
    }

    const handleFormSubmit = (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(!emailRegex.test(email.str) || email.str === ""){
            setEmail({...email, error: true } );
            return;
        }
        const data = {
            email: email.str,
        }

        console.log(data);

        navigate("/reset-password/otp", { replace: true, state: { email: email.str, link : "/reset-password"} });
    }

    // useEffect(() =>{
    //     let errorRemoval: ReturnType<typeof setTimeout>;
    
    //     if(error){
    //        errorRemoval =  setTimeout(() =>{
    //             setError({status: false, msg: ""});
    //         }, 2000)
    //     }
    
    //     return() => clearTimeout(errorRemoval)
    // }, [error]);

  return (
    <>
        <FormContainer>
            <div className="mx-auto mb-2 w-fit h-fit p-3 rounded-full flex items-center justify-center">
              <CircleUserRoundIcon size = {80} color="#121212"/>
            </div>
            <form className="relative bg-white rounded-md shadow-2xl p-5 pt-10" onSubmit={handleFormSubmit}>
              
                {/* <h1 className="text-gray-800 font-bold text-2xl md:text-3xl mb-3 uppercase">Hello Again!</h1> */}
                <p className="text-md font-normal text-blue mb-8 text-center">Enter email u want the mail link to be sent to</p>
                {/* {error.status && <Notification message = {error.msg} type = "danger" className="text-white mb-4"/>} */}
                <div>
                    <div className={`flex items-center ${email.error ? "border-2 border-red-500": "border-2 border-gray focus-within:border-blue"} mb-3 py-3 px-3 rounded-md`}>
                        <Mail size = {20}/>
                        <input 
                            className="pl-2 w-full outline-none border-none" 
                            type="text" 
                            name="email" 
                            id="email" 
                            placeholder="Enter email" 
                            onChange={handleInputChange}
                        />
                        {email.error && <Info size={20} color=" rgb(239 68 68)" />}
                    </div>
                    {email.error && <p className="text-red-500 text-size-400 font-normal m-2">Enter a correct email format</p>}
                </div>
                <div className="w-full">
                    <button type = "submit" className="px-10 py-4 w-full rounded-md font-roboto text-size-500 uppercase font-semibold bg-black text-white ">
                        verify email
                    </button>
                </div>
            </form>
        </FormContainer>
    </>
  )
}

export default VerifyEmail