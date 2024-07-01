import Container from "@/components/Container";
import Button from "@/components/Button";
import { CirclePlusIcon } from "lucide-react";
import { useState } from "react";
import ConfigForm from "@/sections/ConfigForm";
import cashfree_icon from "@/assets/icons/cashfree-icon.svg";
import razorpay_icon from "@/assets/icons/razorpay-icon.svg";
import payumoney_icon from "@/assets/icons/payumoney-icon.png";

const PaymentConfiguration = () => {

    const [paymentGateway, setPaymentGateway] = useState<"razorpay" | "payumoney" | "cashfree">("razorpay");
    const [isOpen, setIsOpen] = useState(false);


    console.log(setIsOpen, setPaymentGateway)

  return (
    <div className="w-full h-full">
        <Container className="mt-4 min-h-screen ">
            <div className="flex justify-between items-center w-full mb-8">
                <h3 className="font-semibold text-size-500 text-text-bold uppercase">
                Payment configuration
                </h3>
                <Button 
                    size = "medium"
                    handleClick={() => setIsOpen(prevState => !prevState)}
                    className="text-size-xs flex gap-2 rounded-md text-white items-center justify-center font-normal capitalize"
                >
                    <CirclePlusIcon color="#fff"/>
                    payment configuration
                </Button>
            </div>  
            <hr className="my-3" />
        <div className="w-full h-full">
        <div className="w-full h-full px-8 pt-8 lg:px-16">
            <div className="gap-8">
                
                {/* Payment method */}
                <div className="p-10">
                <h3 className="text-size-500 text-text-black font-medium uppercase mb-6 text-center">select to activate desired payment gateway</h3>
                <div className="flex justify-center gap-4 flex-wrap">
                    <label className="custom-radio">
                    <input
                        type="radio"
                        name="radio"
                        // value=""
                        // checked={selectedOption === 'door_service'}
                        // onChange={handleRadioChange}
                        className="hidden"
                    />
                    <span
                        // className={`radio-box inline-block w-20 h-10 border-2 ${
                        //   selectedOption === 'option2'
                        //     ? 'bg-blue text-white'
                        //     : 'bg-white text-black'
                        // } flex items-center justify-center`}
                        className="radio-box flex items-center py-7 px-10 h-10 border-2 border-[#c0c0c0]  shadow-md gap-x-2 text-text-black rounded-md"
                    >
                    <div className="w-4 h-4 rounded-full border-2 border-[#c0c0c0] " />
                    <a href = "#">
                        <img src={razorpay_icon} alt = "razor pay icon" className="w-[5rem] h-[5rem] object-contain"/>
                    </a>
                    </span>
                    </label>
                    <label className="custom-radio">
                    <input
                        type="radio"
                        name="radio"
                        // value="pickup"
                        // checked={selectedOption === 'option2'}
                        // onChange={handleRadioChange}
                        className="hidden"
                    />
                    <span
                        // className={`radio-box inline-block w-20 h-10 border-2 ${
                        //   selectedOption === 'option2'
                        //     ? 'bg-blue text-white'
                        //     : 'bg-white text-black'
                        // } flex items-center justify-center`}
                        className="radio-box flex items-center py-7 px-10 h-10 border-2 border-[#c0c0c0] shadow-md gap-x-4 text-text-black rounded-md"
                    >
                        <div className="w-4 h-4 rounded-full border-2 border-[#c0c0c0] " />
                        <a href = "#">
                            <img src={payumoney_icon} alt = "payumoney icon" className="w-[5rem] h-[5rem] object-contain"/>
                        </a>
                    </span>
                    </label>
                    <label className="custom-radio">
                    <input
                        type="radio"
                        name="radio"
                        // value="door-service"
                        // checked={selectedOption === 'option2'}
                        // onChange={handleRadioChange}
                        className="hidden"
                    />
                    <span
                        // className={`radio-box inline-block w-20 h-10 border-2 ${
                        //   selectedOption === 'option2'
                        //     ? 'bg-blue text-white'
                        //     : 'bg-white text-black'
                        // } flex items-center justify-center`}
                        className="radio-box flex items-center py-7 px-10 h-10 border-2 border-[#c0c0c0] shadow-md gap-x-2 text-text-black rounded-md"
                    >
                    <div className="w-4 h-4 rounded-full border-2 border-[#c0c0c0] " />
                    <a href = "#">
                        <img src={cashfree_icon} alt = "cashfree icon" className="w-[5rem] h-[5rem] object-contain"/>
                    </a>
                    </span>
                    </label>
                </div>
                </div>
            </div>
        </div>
        {/* banner to show the one that is active */}
        <div className="w-full px-16 pt-8 mt-2">
            <div className="w-2/3 mx-auto shadow-md bg-gray">
                <img src={razorpay_icon} alt = "razor pay icon" loading = "lazy" className="w-full h-1/2 object-contain"/>
                <div className="w-fit p-3 mx-auto">
                    <h4 className="text-green-500 font-medium text-size-600 capitalize">is active</h4>
                </div>
            </div>
        </div>
    </div>
    </Container>

        <ConfigForm 
            gateway={paymentGateway}
            isOpen = {isOpen}
            setIsOpen={() => setIsOpen(prevState =>!prevState)}
            setGateway = {setPaymentGateway}
        />
    </div>
  )
}

export default PaymentConfiguration