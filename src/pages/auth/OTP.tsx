import React,{ useState, useRef, useEffect } from "react";
import FormContainer from "@/components/FormContainer";
import { useLocation, useNavigate } from "react-router-dom";
import { MailOpen } from "lucide-react";

const OTP = () => {
  const location = useLocation();
  const clientEmail = location.state?.email || "";
  const link = location.state?.link || "";
  console.log(link);
  const navigate = useNavigate();

    let currentOTPIndex = 0;

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [activeOTPIndex, setActiveOTPIndex] = useState(0);
    const [error, setError] = useState(false);
  
    const inputRef = useRef<HTMLInputElement>(null);
  
    const handleOnChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = target;
      const newOTP: string[] = [...otp];
      newOTP[currentOTPIndex] = value.substring(value.length - 1);
  
      if (!value) setActiveOTPIndex(currentOTPIndex - 1);
      else setActiveOTPIndex(currentOTPIndex + 1);
  
      setOtp(newOTP);
    };
  
    const handleOnKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      index: number
    ) => {
      currentOTPIndex = index;
      if (e.key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
    };
  
    useEffect(() => {
      inputRef.current?.focus();
    }, [activeOTPIndex]);

    console.log(activeOTPIndex, otp);

    const handleFormSubmit = (e:React.FormEvent<HTMLFormElement>) =>{
      e.preventDefault();

      const otpString = otp.map(otp => otp.toString()).join("");

      if(otpString === "" || otpString.length !== 6){
        setError(prevError => !prevError);
        return
      }

      console.log(link);

      navigate(link, { replace: true });

    }

  return (
    <div className="w-full">
        <FormContainer position="right">
            <form className="bg-white rounded-md shadow-2xl p-5 mt-6" onSubmit={handleFormSubmit}>
                <div className="flex flex-col gap-y-4 items-center justify-center mb-8">
                    <div className="w-[96px] grid place-items-center bg-[#d6d5d5] aspect-square rounded-full shadow-sm">
                        <MailOpen size={60} strokeWidth={1}/>
                    </div>
                    <p className="font-semibold text-size-400 text-blue w-[80%] text-center">
                        Please verify your account by entering the 6 digit code sent to
                        <br />
                        <span className="text-black text-size-500 capitalize">
                          {clientEmail}
                        </span>
                    </p>
                </div>
                <div className="flex flex-col gap-y-2 mb-8">
                  <div className="flex gap-1 md:gap-3 xl:gap-5 justify-center py-2">
                      {otp.map((_, index) => {
                      return (
                      <React.Fragment key={index}>
                          <input
                            ref={activeOTPIndex === index ? inputRef : null}
                            type="number"
                            className={
                                `w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl spin-button-none ${error ? "border-red-500" : "border-[#d0d0d0]"} focus-within:border-blue text-gray-400 transition`
                            }
                            onChange={handleOnChange}
                            onKeyDown={(e) => handleOnKeyDown(e, index)}
                            value={otp[index]}
                          />
                      </React.Fragment>
                      );
                  })}
                  </div>
                  {error && (
                    <p className="text-red-500 text-size-400 font-normal m-2 text-center">Please enter the valid OTP sent to your mail</p>
                  )}
                </div>
                <div className="w-full">
                    <button type = "submit" className="px-10 py-4 w-full rounded-md font-roboto text-size-500 uppercase font-semibold bg-black text-white">
                        Verify account
                    </button>
                </div>
            </form>
        </FormContainer>
    </div>
  )
}

export default OTP
