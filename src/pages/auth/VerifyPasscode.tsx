import React, { useState, useRef, useEffect } from "react";
import FormContainer from "@/components/FormContainer";
import { useNavigate } from "react-router-dom";
import { MailOpen } from "lucide-react";
import { EasyHTTP } from "@/utils/httpRequest";
import { useLocalStorage } from "@/useLocalStorage";

const easyHttp = new EasyHTTP();

const VerifyPasscode = () => {
  const navigate = useNavigate();

  const [passcode, setPasscode] = useState(new Array(8).fill(""));
  const [activePasscodeIndex, setActivePasscodeIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setItem } = useLocalStorage("passcode_id");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const newPasscode: string[] = [...passcode];
    newPasscode[activePasscodeIndex] = value.substring(value.length - 1);

    if (!value) setActivePasscodeIndex(activePasscodeIndex - 1);
    else setActivePasscodeIndex(activePasscodeIndex + 1);

    setPasscode(newPasscode);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      const newPasscode: string[] = [...passcode];
      newPasscode[index] = "";
      setPasscode(newPasscode);
      setActivePasscodeIndex(index > 0 ? index - 1 : 0);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activePasscodeIndex]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passcodeString = passcode.join("");

    if (passcodeString === "" || passcodeString.length !== 8) {
      setError("Passcode characters not complete");
      return;
    }

    const data = {
      passcode: passcodeString,
    };

    const url = "admin-auth/verify-passcode";
    const headers: HeadersInit = {
      'Content-type': 'application/json',
      "Accept": "application/json",
    };

    try {
      setLoading(true);
      const response = await easyHttp.post(url, headers, data);
      console.log(response);
      setItem(response?.passcode?.id);
      navigate("/signup", { replace: true });
    } catch (err) {
      console.log((err as Error).message);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <FormContainer position="right">
        <form className="bg-white rounded-md shadow-2xl p-5 mt-6" onSubmit={handleFormSubmit}>
          <div className="flex flex-col gap-y-4 items-center justify-center mb-8">
            <div className="w-[96px] grid place-items-center bg-[#d6d5d5] aspect-square rounded-full shadow-sm">
              <MailOpen size={60} strokeWidth={1} />
            </div>
            <p className="font-semibold text-size-400 text-blue w-[80%] text-center">
              Please enter the 8-digit passcode before signup
            </p>
            <div></div>
          </div>
          <div className="flex flex-col gap-y-2 mb-8">
            <div className="flex gap-1 md:gap-3 xl:gap-5 justify-center py-2">
              {passcode.map((_, index) => (
                <React.Fragment key={index}>
                  <input
                    ref={activePasscodeIndex === index ? inputRef : null}
                    type="number"
                    className={`w-10 h-10 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl spin-button-none ${error ? "border-red-500" : "border-[#d0d0d0]"} focus-within:border-blue text-gray-400 transition`}
                    onChange={handleOnChange}
                    onKeyDown={(e) => handleOnKeyDown(e, index)}
                    value={passcode[index]}
                  />
                </React.Fragment>
              ))}
            </div>
            {error && (
              <p className="text-red-500 text-size-400 font-normal m-2 text-center">{error}</p>
            )}
          </div>
          <div className="w-full">
            <button disabled={loading} type="submit" className="px-10 py-4 w-full rounded-md font-roboto text-size-500 uppercase font-semibold bg-black text-white">
              {loading ? "Loading..." : "Verify passcode"}
            </button>
          </div>
        </form>
      </FormContainer>
    </div>
  );
};

export default VerifyPasscode;
