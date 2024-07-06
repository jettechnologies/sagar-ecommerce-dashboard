import Container from "@/components/Container";
// import Button from "@/components/Button";
// import { CirclePlusIcon } from "lucide-react";
import React,{ ChangeEvent, useCallback, useState, useEffect, useRef } from "react";
// import ConfigForm from "@/sections/ConfigForm";
import cashfree_icon from "@/assets/icons/cashfree-icon.svg";
import razorpay_icon from "@/assets/icons/razorpay-icon.svg";
import payumoney_icon from "@/assets/icons/payumoney-icon.png";
import { useLocalStorage } from "@/useLocalStorage";
import { EasyHTTP } from "@/utils/httpRequest";
import { useAuth } from "@/context/authContext";
import Spinner from "@/components/Spinner";
import Modal from "@/components/Modal";
import { IndianRupee } from "lucide-react";
// import PasscodeModal from "@/sections/PasscodeModal";

const easyHttp = new EasyHTTP();

type PaymentGateway = "razorpay" | "payUmoney" | "cashfree";

type GatewayResponse = {
    id: number;
    selectedGateway: string;
    updatedAt: string;
  }

const PaymentConfiguration = () => {

    const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>();
    const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>();
    const [isFirstClick, setIsFirstClick] = useState(true);
    const { setItem } = useLocalStorage("payment");
    const { token, loading:authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isActive, setIsActive] = useState(false);
    // state values for passcode handling 
    // let currentPasscodeIndex = 0;

    const [passcode, setPasscode] = useState(new Array(8).fill(""));
    const [activePasscodeIndex, setActivePasscodeIndex] = useState(0);  
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
      }
  
    useEffect(() => {
      inputRef.current?.focus();
    }, [activePasscodeIndex]);

    // using useEffect to load and set the preferred payment gateway
    useEffect(() =>{
        const setInitialGateway = async() =>{
            const url = `${import.meta.env.VITE_PRODUCT_LIST_API}payment-gateway-config/payment-config`;
            try{
              const res = await fetch(url);
            //   const response:GatewayResponse[]  = await res.json();
      
              if (!res.ok) {
                const errorText = await res.json();
                throw new Error(errorText || 'Failed to fetch payment gateway configuration');
              }

              const response:GatewayResponse[]  = await res.json();

              const arrangedGteways:GatewayResponse[] =  response.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
              const currentGateway = arrangedGteways[0];
              setItem({
                id: String(currentGateway?.id),
                selectedGateway: currentGateway?.selectedGateway,
              });
              const gateway = currentGateway?.selectedGateway as PaymentGateway;
              setSelectedGateway(gateway);
            }
            catch(err){
              console.log((err as Error).message);
            //   setSelectedGatewayError((err as Error).message);
            }
        }

       if(!authLoading){setInitialGateway()}        
    }, [setItem, authLoading]);

    // object for setting images
    const gatewayImages = {
        razorpay: {
            src: razorpay_icon,
            alt: "Razorpay image"
        },
        payUmoney:{
            src: payumoney_icon,
            alt: "payUmoney image",
        },
        cashfree:{
            src: cashfree_icon,
            alt: "cashfree image",
        }
    }

    const postPaymentGateway = useCallback(async (value: PaymentGateway, passcode:string) => {
        const url = "payment-gateway-config/first-click-to-set-gateway";
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const data = {
          passcode,
          selectedGateway: value,
        };
      
        try {
          setLoading(true);
          const response = await easyHttp.post(url, headers, data);
          console.log(response);
          const local = {
            id: String(response.id),
            selectedGateway: response.selectedGateway,
          };
          setItem(local);
            setPasscode(new Array(8).fill(""));
            setIsActive(false);
            // setIsSelected(true);

            setSelectedGateway(value);

        } catch (error) {
          console.error('Error setting payment gateway:', error);
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      }, [token, setItem]);

    //   function for the patching of thr routes
      const patchPaymentGateway = useCallback(async (value: PaymentGateway, id: number, passcode:string) => {
        const url = `payment-gateway-config/select-gateway/${id}`;
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const data = {
          passcode,
          selectedGateway: value,
        };
      
        try {
            setLoading(true);
            const response = await easyHttp.patch(url, headers, data);
            console.log(response);
            const localstorage = window.localStorage.getItem("payment");

            if(response && localstorage){
                const storedPaymentInfo = JSON.parse(localstorage);
                const currentPaymentInfo = {
                    id: storedPaymentInfo.id,
                    selectedGateway: value,
                }

                setItem(currentPaymentInfo);
                setPasscode(new Array(8).fill(""));
                // setIsSelected(true);
                setIsActive(false);
                setSelectedGateway(value)
            }
        } catch (error) {
          console.error('Error setting payment gateway:', error);
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      }, [setItem, token]);
      
    //   function to handle selecting the desired gateway

    const handleSelectGateway = (e:ChangeEvent<HTMLInputElement>) =>{
        const value = e.target.value as PaymentGateway;

        setPaymentGateway(value);

        setIsActive(true);
    }

    // function for handling the selection of the currentpayment gateway
    const selectPaymentGateway = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!paymentGateway) return;
    
        const passcodeString = passcode.map(code => code.toString()).join("");
    
        if (passcodeString === "" || passcodeString.length !== 8) {
            setError("Passcode characters not complete");
            return;
        }
    
        const localStorage = window.localStorage.getItem("payment");
        if (!localStorage) {
            if(isFirstClick){
                await postPaymentGateway(paymentGateway, passcodeString);
                setPasscode(new Array(8).fill(""));
                setIsFirstClick(false);
            }
        }
        else{
            const gatewayInfo = JSON.parse(localStorage);
            const gatewayId = gatewayInfo && parseInt(gatewayInfo.id);
        
            try {
                if (isFirstClick) {
                    if (gatewayInfo) {
                        await patchPaymentGateway(paymentGateway, gatewayId, passcodeString);
                    } else {
                        await postPaymentGateway(paymentGateway, passcodeString);
                    }
                    setIsFirstClick(false);
                } else {
                    if (gatewayId !== null) {
                        await patchPaymentGateway(paymentGateway, gatewayId, passcodeString);
                    }
                }
            } catch (error) {
                console.error('Error handling payment gateway:', error);
                setError((error as Error).message);
            }
        }
    }, [paymentGateway, passcode, isFirstClick, patchPaymentGateway, postPaymentGateway]);

    useEffect(() =>{
        let errorRemoval: ReturnType<typeof setTimeout>;
    
        if(error){
           errorRemoval =  setTimeout(() =>{
                setError(null);
            }, 2000)
        }
    
        return() => clearTimeout(errorRemoval)
    }, [error]);

  return (
    <div className="w-full h-full">
        <Container className="mt-4 min-h-screen ">
            <div className="flex justify-between items-center w-full mb-8">
                <h3 className="font-semibold text-size-500 text-text-bold uppercase">
                Payment configuration
                </h3>
                {/* <Button 
                    size = "medium"
                    handleClick={() => setIsOpen(prevState => !prevState)}
                    className="text-size-xs flex gap-2 rounded-md text-white items-center justify-center font-normal capitalize"
                >
                    <CirclePlusIcon color="#fff"/>
                    payment configuration
                </Button> */}
            </div>  
            <hr className="my-3" />
        <div className="w-full h-full">
        <div className="w-full h-full px-8 pt-8 lg:px-16">
            <div className="gap-8">
                
                {/* Payment method */}
                <div className="p-10">
                <h3 className="text-size-500 text-text-black font-medium uppercase mb-6 text-center">select to activate desired payment gateway</h3>
                <div className="flex justify-center gap-4 flex-wrap">
                    <label className="custom-radio cursor-pointer">
                        <input
                            type="radio"
                            value="razorpay"
                            checked={selectedGateway === "razorpay"}
                            onChange={handleSelectGateway}
                            className="hidden"
                        />
                        <span
                            className="radio-box flex items-center py-7 px-10 h-10 border-2 border-[#c0c0c0]  shadow-md gap-x-2 text-text-black rounded-md"
                        >
                        <div className={`w-4 h-4 rounded-full ${selectedGateway === "razorpay" ? "bg-blue" : "border-2 border-[#c0c0c0]"} `} />
                        <img src={razorpay_icon} alt = "razor pay icon" className="w-[5rem] h-[5rem] object-contain"/>
                        </span>
                    </label>
                    <label className="custom-radio cursor-pointer">
                        <input
                            type="radio"
                            value="payUmoney"
                            checked={selectedGateway === "payUmoney"}
                            onChange={handleSelectGateway}
                            className="hidden"
                        />
                        <span
                            className="radio-box flex items-center py-7 px-10 h-10 border-2 border-[#c0c0c0] shadow-md gap-x-4 text-text-black rounded-md"
                        >
                            <div className={`w-4 h-4 rounded-full ${selectedGateway === "payUmoney" ? "bg-blue" : "border-2 border-[#c0c0c0]"} `} />
                            <img src={payumoney_icon} alt = "payumoney icon" className="w-[5rem] h-[5rem] object-contain"/>
                        </span>
                    </label>
                    <label className="custom-radio cursor-pointer">
                        <input
                            type="radio"
                            value="cashfree"
                            checked={selectedGateway === "cashfree"}
                            onChange={handleSelectGateway}
                            className="hidden"
                        />
                        <span
                            className="radio-box flex items-center py-7 px-10 h-10 border-2 border-[#c0c0c0] shadow-md gap-x-2 text-text-black rounded-md"
                        >
                        <div className={`w-4 h-4 rounded-full ${selectedGateway === "cashfree" ? "bg-blue" : "border-2 border-[#c0c0c0]"} `} />
                        <img src={cashfree_icon} alt = "cashfree icon" className="w-[5rem] h-[5rem] object-contain"/>
                        </span>
                    </label>
                </div>
                </div>
            </div>
        </div>
        {/* banner to show the one that is active */}
        {
            loading ? <div className="w-full h-full grid place-items-center">
                <Spinner />
            </div>
                :
            (selectedGateway && gatewayImages[selectedGateway]) && <div className="w-full px-16 pt-8 mt-2">
                <div className="w-2/3 mx-auto shadow-md bg-gray">
                    <img src={gatewayImages[selectedGateway].src} alt = {gatewayImages[selectedGateway].alt} loading = "lazy" className="w-full h-1/2 object-contain"/>
                    <div className="w-fit p-3 mx-auto">
                        <h4 className="text-green-500 font-medium text-size-600 capitalize">is active</h4>
                    </div>
                </div>
            </div>
        }

        {
            error && <div className="w-full h-full grid place-items-center">
                <h4 className="font-bold text-size-600">{error}</h4>
            </div>
        }
    </div>
    </Container>

    {/* modal to add new payment gateway */}
    {/* <PasscodeModal
        isOpen={isActive}
        setIsOpen={setIsActive}
        activePasscodeIndex={activePasscodeIndex}
        setActivePasscodeIndex={setActivePasscodeIndex}
        // currentPasscodeIndex={currentPasscodeIndex} // Pass the current active index
        passcode={passcode}
        setPasscode={setPasscode}
        handlePasscodeSubmit={selectPaymentGateway}
      /> */}

    <Modal
      className="max-w-lg"
      isOpen={isActive}
      handleModalOpen={() => {
        setIsActive(false)
        // setPaymentGateway(undefined)
    }}
      title="Configure Payment Gateway"
    >
      <div className="w-full">
      <form className="bg-white rounded-md shadow-2xl p-5 mt-6" onSubmit={selectPaymentGateway}>
                <div className="flex flex-col gap-y-4 items-center justify-center mb-8">
                    <div className="w-[96px] grid place-items-center bg-[#d6d5d5] aspect-square rounded-full shadow-sm">
                        <IndianRupee size={60} strokeWidth={1}/>
                    </div>
                    <p className="font-semibold text-size-400 text-blue w-[80%] text-center">
                        Please enter the 8digits passcode before configuring payments
                    </p>
                    <div>
                </div>
                </div>
                <div className="flex flex-col gap-y-2 mb-8">
                  <div className="flex gap-1 md:gap-3 xl:gap-5 justify-center py-2">
                      {passcode.map((_, index) => {
                      return (
                      <React.Fragment key={index}>
                          <input
                            ref={activePasscodeIndex === index ? inputRef : null}
                            type="number"
                            className={
                                `w-10 h-10 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl spin-button-none ${error ? "border-red-500" : "border-[#d0d0d0]"} focus-within:border-blue text-gray-400 transition`
                            }
                            onChange={handleOnChange}
                            onKeyDown={(e) => handleOnKeyDown(e, index)}
                            value={passcode[index]}
                          />
                      </React.Fragment>
                      );
                  })}
                  </div>
                  {error && (
                    <p className="text-red-500 text-size-400 font-normal m-2 text-center">{error}</p>
                  )}
                </div>
                <div className="w-full">
                    <button disabled = {loading} type = "submit" className="px-10 py-4 w-full rounded-md font-roboto text-size-500 uppercase font-semibold bg-black text-white">
                      {loading ? "Loading..." : "Select gateway"}
                    </button>
                </div>
            </form>
      </div>
    </Modal>

        {/* <ConfigForm 
            gateway={paymentGateway}
            isOpen = {isOpen}
            setIsOpen={() => setIsOpen(prevState =>!prevState)}
            setGateway = {setPaymentGateway}
        /> */}
    </div>
  )
}

export default PaymentConfiguration