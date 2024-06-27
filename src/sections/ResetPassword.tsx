import { useState, useEffect } from "react"
import Button from "@/components/Button";
import Notification from "@/components/Notification";
import { EasyHTTP } from "@/utils/httpRequest";

const easyHttp = new EasyHTTP();

type ResetPasswordProps = {
    token:string;
}

const ResetPassword = ({token}: ResetPasswordProps) => {
    
    const [passwordChange, setPasswordChange] = useState<{oldPassword: string; newPassword:string; confirmPassword: string}>({
        oldPassword: "",
        newPassword:"",
        confirmPassword: "",
    });
    const [validateError, setValidateError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handlePasswordChange = (
        e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      ) =>{
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const { name, value } = target;
    
        setPasswordChange({ ...passwordChange, [name]: value.trim()});
    }

    const handlePasswordReset = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const { oldPassword, newPassword, confirmPassword } = passwordChange;

        if(oldPassword === "" || newPassword === "" || confirmPassword === ""){
            setValidateError(true);
            return
        }

        const url = "admin-profile-mgt/change-admin-password";
        const headers:HeadersInit = {
            "Content-Type": 'application/json',
            "Accept": "application/json",
            Authorization: `Bearer ${token}`,
        }

        const data = {
            oldPassword: String(oldPassword),
            password: String(newPassword),
            confirmPassword: String(confirmPassword),
        }

        try{
            setLoading(true);
            const response = await easyHttp.patch(url, headers, data);
            console.log(response);
        }
        catch(err){
            console.log((err as Error).message)
            setError((err as Error).message);
        }
        finally{
            setLoading(false)
        }

    }

    useEffect(() =>{
        let errorRemoval: ReturnType<typeof setTimeout>;
    
        if(error){
           errorRemoval =  setTimeout(() =>{
                setValidateError(false);
            }, 2000)
        }
    
        return() => clearTimeout(errorRemoval)
    }, [error]);

  return (
    <div className="w-full">
        <h4 className="text-size-500 text-text-black font-medium">Change Password</h4>
        <form 
            id="forget-password" 
            onSubmit={handlePasswordReset}
            className="w-full flex flex-col gap-5 border border-gray p-5 mt-5 shadow-md"
        >   
            {validateError && <Notification message = "All fields are required" type = "danger" className="text-white mb-4"/>}
            <div className="w-full">
            <label htmlFor="old-password" className="text-size-400 text-text-black font-medium mb-3">
                Old Password
            </label>
                <input 
                className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                type="password" 
                name="oldPassword" 
                id="old-password" 
                placeholder="Old Password" 
                onChange={handlePasswordChange}
                />
            </div>
            <div className="w-full">
                <label htmlFor="new-password" className="text-size-400 text-text-black font-medium mb-3">
                New Password
                </label>
                <input 
                className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                type="password" 
                name="newPassword" 
                id="new-password" 
                placeholder="New Password" 
                onChange={handlePasswordChange}
                />
            </div>
            <div className="full">
                <label htmlFor="confirm-new-password" className="text-size-400 text-text-black font-medium mb-3">
                Confirm New Password
                </label>
                <input 
                className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                type="password" 
                name="confirmPassword" 
                id="confirm-new-password" 
                placeholder="Confrim New Password" 
                onChange={handlePasswordChange}
                />
            </div>
            <Button size = "small" className = "">
                {loading ? "loading...": "Reset Password"}
            </Button>
        </form>
    </div>
  )
}

export default ResetPassword