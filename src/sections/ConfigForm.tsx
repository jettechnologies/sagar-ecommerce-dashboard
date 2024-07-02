import Modal from "@/components/Modal";
import Select from "@/components/Select";
import { useState, ChangeEvent, useCallback, useEffect } from "react";
import Notification from "@/components/Notification";
import { EasyHTTP } from "@/utils/httpRequest";
import { useAuth } from "@/context/authContext";

interface Props {
  gateway: "razorpay" | "payumoney" | "cashfree";
  setGateway: React.Dispatch<React.SetStateAction<"razorpay" | "payumoney" | "cashfree">>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const gateways = [
  { key: "razorpay", value: "razorpay gateway" },
  { key: "payumoney", value: "payumoney gateway" },
  { key: "cashfree", value: "cashfree gateway" }
];

const easyHttp = new EasyHTTP();

const validateObject = <T extends Record<string, any>>(obj: T): boolean => {
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined || value === "") {
      throw new Error(`The value for key "${key}" is empty.`);
    }
  }
  return true;
};

const ConfigForm = ({
  gateway,
  isOpen,
  setIsOpen,
  setGateway
}: Props) => {
  const [formData, setFormData] = useState({
    keyId: "",
    keySecret: "",
    webhook_secret: "",
    api_secret: "",
    api_key: "",
    merchant_key: "",
    merchant_salt: "",
    webhook_salt: "",
    merchant_id: "",
    auth_token: "",
    paymentUrl: "",
    app_id: "",
    secret_key: "",
    client_id: "",
    client_secret: "",
    payment_url: "",
  });

  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validateError, setValidateError] = useState({
    msg: "",
    status: false,
  });

  const selectGateway = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setGateway(e.target.value as "razorpay" | "payumoney" | "cashfree");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const configurePayment = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = Object.keys(formData).reduce((acc: Partial<typeof formData>, key) => {
      const value = formData[key as keyof typeof formData];
      if (value !== "") {
        acc[key as keyof typeof formData] = value;
      }
      return acc;
    }, {});

    console.log(result, setLoading);

    try {
      if (!validateObject(result)) {
        setValidateError({
            msg: "All fields are required",
            status: true
        });
      }

      let data, url:string;
      const headers:HeadersInit = {
        "Content-Type": 'application/json',
        "Accept": "application/json",
        Authorization: `Bearer ${token}`,
      }

      setLoading(true);

      if (gateway === "razorpay") {
        data = {
          razorpayKeyId: result.keyId,
          razorpayKeySecret: result.keySecret,
          razorpayWebhookSecret: result.webhook_secret,
          razorpayApiSecret: result.api_secret,
          razorpayApiKey: result.api_key,
        };

        url = "payment-gateway-config/razorPay";

      } else if (gateway === "payumoney") {
        data = {
          payuMerchantKey: result.merchant_key,
          payuMerchantSalt: result.merchant_salt,
          payuWebhookSalt: result.webhook_salt,
          payumoneyMerchantId: result.merchant_id,
          payumoneyApiKey: result.api_key,
          payumoneyApiSecret: result.api_secret,
          payumoneyAuthToken: result.auth_token,
          payumoneyPaymentUrl: result.payment_url,
        };

        url = "payment-gateway-config/payUmoney";
      } else if (gateway === "cashfree") {
        data = {
          cashfreeAppId: result.app_id,
          cashfreeSecretKey: result.secret_key,
          cashfreeWebhookSecret: result.webhook_secret,
          cashfreeClientId: result.client_id,
          cashfreeClientSecret: result.client_secret,
          cashfreeApiSecret: result.api_secret,
          cashfreePaymentUrl: result.payment_url,
        };

        url = "payment-gateway-config/cashfree";        
      } else {
        throw new Error("No matching gateways present");
      }

      // Here you can make an API call with the `data` object
      console.log(data);
      const response = await easyHttp.patch(url, headers, data);

      console.log(response);
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error((error as Error).message);
      setError((error as Error).message);
    }
    finally{
        setLoading(false);
    }
  }, [formData, gateway, token, setIsOpen]);

  console.log(error);

  useEffect(() =>{
    let errorRemoval: ReturnType<typeof setTimeout>;

    if(validateError){
       errorRemoval =  setTimeout(() =>{
            setValidateError({status: false, msg: ""});
        }, 2000)
    }

    return() => clearTimeout(errorRemoval)
}, [validateError]);

  const razorpayForm = () => (
    <>
        <div className="w-full">
            <label
                htmlFor="keyId"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                Razorpay Key ID
            </label>
            <input
                type="text"
                placeholder="Enter Razorpay Key ID"
                id="keyId"
                name="keyId"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="keySecret"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                Razorpay Key Secret
            </label>
            <input
                type="text"
                placeholder="Enter Razorpay Key Secret"
                id="keySecret"
                name="keySecret"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="webhook_secret"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                Webhook Secret
            </label>
            <input
                type="text"
                placeholder="Enter Razorpay Webhook Secret"
                id="webhook_secret"
                name="webhook_secret"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="api_secret"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                API Secret
            </label>
            <input
                type="text"
                placeholder="Enter Razorpay API Secret"
                id="api_secret"
                name="api_secret"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="api_key"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                API Key
            </label>
            <input
                type="text"
                placeholder="Enter Razorpay API Key"
                id="api_key"
                name="api_key"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
    </>
);

const payumoneyForm = () => (
    <>
        <div className="w-full">
            <label
                htmlFor="merchant_key"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                PayUMoney Merchant Key
            </label>
            <input
                type="text"
                placeholder="Enter PayUMoney Merchant Key"
                id="merchant_key"
                name="merchant_key"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="merchant_salt"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                PayUMoney Merchant Salt
            </label>
            <input
                type="text"
                placeholder="Enter PayUMoney Merchant Salt"
                id="merchant_salt"
                name="merchant_salt"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="webhook_salt"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                PayUMoney Webhook Salt
            </label>
            <input
                type="text"
                placeholder="Enter PayUMoney Webhook Salt"
                id="webhook_salt"
                name="webhook_salt"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="merchant_id"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                PayUMoney Merchant ID
            </label>
            <input
                type="text"
                placeholder="Enter PayUMoney Merchant ID"
                id="merchant_id"
                name="merchant_id"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="api_key"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                API Key
            </label>
            <input
                type="text"
                placeholder="Enter PayUMoney API Key"
                id="api_key"
                name="api_key"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="api_secret"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                API Secret
            </label>
            <input
                type="text"
                placeholder="Enter PayUMoney API Secret"
                id="api_secret"
                name="api_secret"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="auth_token"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                PayUMoney Auth Token
            </label>
            <input
                type="text"
                placeholder="Enter PayUMoney Auth Token"
                id="auth_token"
                name="auth_token"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="paymentUrl"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                PayUMoney Payment URL
            </label>
            <input
                type="text"
                placeholder="Enter PayUMoney Payment URL"
                id="paymentUrl"
                name="paymentUrl"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
    </>
);

const cashfreeForm = () => (
    <>
        <div className="w-full">
            <label
                htmlFor="app_id"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                Cashfree App ID
            </label>
            <input
                type="text"
                placeholder="Enter Cashfree App ID"
                id="app_id"
                name="app_id"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="secret_key"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                Cashfree Secret Key
            </label>
            <input
                type="text"
                placeholder="Enter Cashfree Secret Key"
                id="secret_key"
                name="secret_key"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="webhook_secret"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                Webhook Secret
            </label>
            <input
                type="text"
                placeholder="Enter Cashfree Webhook Secret"
                id="webhook_secret"
                name="webhook_secret"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="client_id"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                Cashfree Client ID
            </label>
            <input
                type="text"
                placeholder="Enter Cashfree Client ID"
                id="client_id"
                name="client_id"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="client_secret"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                Cashfree Client Secret
            </label>
            <input
                type="text"
                placeholder="Enter Cashfree Client Secret"
                id="client_secret"
                name="client_secret"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="payment_url"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                Payment URL
            </label>
            <input
                type="text"
                placeholder="Enter Cashfree Payment URL"
                id="payment_url"
                name="payment_url"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
        <div className="w-full">
            <label
                htmlFor="api_secret"
                className="text-size-400 text-text-black font-medium mb-3"
            >
                API Secret
            </label>
            <input
                type="text"
                placeholder="Enter Cashfree API Secret"
                id="api_secret"
                name="api_secret"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
            />
        </div>
    </>
);

  return (
    <Modal
      isOpen={isOpen}
      handleModalOpen={() => setIsOpen(false)}
      title="Configure Payment Gateway"
    >
      {/* <div className="flex justify-center w-full">
        <Select
          name="paymentGateway"
          select={gateways}
          value={gateway}
          onChange={selectGateway}
          className="w-1/2"
        />
      </div> */}

<div className="w-full">
                    <label htmlFor="admin-type" className="text-size-500 font-medium text-text-black ">
                        Select gateway to configure
                    </label>
                    <div className={`flex items-center border-2 border-gray focus-within:border-blue mb-3 py-3 px-3 rounded-md mt-3`}>
                        {/* <User2 size = {20}/> */}
                        <Select
                            id = "admin-type" 
                            name="adminType" 
                            select={gateways} 
                            className="font-normal text-text-black w-full p-0 border-none outline-none" 
                            defaultText="Select payment gateway"
                            handleInputChange={selectGateway}
                    />
                    </div>
                </div>
        <hr className="my-3" />

      <form onSubmit={configurePayment} className="space-y-6 w-full">
        {validateError.status && <Notification message = {validateError.msg} type = "danger" className="text-white mb-4"/>}
        {gateway === "razorpay" && razorpayForm()}
        {gateway === "payumoney" && payumoneyForm()}
        {gateway === "cashfree" && cashfreeForm()}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-3 text-white bg-black font-bold text-size-500 uppercase"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ConfigForm;
