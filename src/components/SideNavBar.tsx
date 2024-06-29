import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCartIcon, LibraryBig, Layers3, Package, CircleUserRound, UserRoundCogIcon, Settings, Edit, Trash } from "lucide-react";
import Logo from "@/components/Logo";
import { formatDateDifference, formatToHumanReadableDate } from "@/utils/dateFunctions";

interface Coupon{
  code: string;
  durationInDays: number,
  durationInWeeks: number,
  percentOff: number,
}

interface CouponType {
  id: number;
  OneTime_discountCode: string;
  createdAT: string;
  DiscountDuration_days: number | null;
  DiscountDuration_weeks: number | null;
  percentageOff: string;
  expires_in: string;
  updatedAT: string | null;
  isExpired: boolean;
}

interface Props{
  className?: string;
  token: string;
  setCouponActions?: React.Dispatch<React.SetStateAction<{
    isEditing: boolean;
    isDeleting: boolean;
  }>>;
  setCurrentId?: React.Dispatch<React.SetStateAction<string>>;
  setCurrentCoupon?: React.Dispatch<React.SetStateAction<Coupon>>;
}

const SideNavBar = ({ className, token, setCouponActions, setCurrentId, setCurrentCoupon }: Props) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [coupons, setCoupons] = useState<CouponType[] | []>([]);
  const sideNavBarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const paths: string[] = location.pathname.split("/").filter(Boolean);

  useEffect(() => {
    const handleScroll = () => {
      if (sideNavBarRef.current) {
        const isOverflow = sideNavBarRef.current.scrollHeight > sideNavBarRef.current.clientHeight;
        setIsOverflowing(isOverflow);
      }
    };

    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  // useEffect for calling the coupons created by the admin
  useEffect(() =>{
    const fetchCoupons = async() =>{
      console.log(token)
      const url = "order-mgt/get-coupons";

    try{
      const res = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}${url}`, {
        headers:{
            Authorization: `Bearer ${token}`,
        }
      });

      
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse?.message || "Resource not found");
      }
      console.log('coupon created successfully');
      console.log(res)
      const response:CouponType[]  = await res.json();
      console.log(response);
      setCoupons(response);
    }
    catch(err){
      console.log((err as Error).message);
    }

    }

    fetchCoupons()
  }, [token]);

  // function to handle editing
  function handleEditing(id:number){
    if(id){
      const currentId = String(id);
      setCurrentId && setCurrentId(currentId);

      const currentCoupon = coupons.find(coupon => coupon.id === id);
      console.log(currentCoupon);

      if(currentCoupon){
        setCurrentCoupon && setCurrentCoupon({
          code: currentCoupon.OneTime_discountCode,
          durationInDays: currentCoupon.DiscountDuration_days || 0,
            durationInWeeks: currentCoupon.DiscountDuration_weeks || 0,
          percentOff: parseInt(currentCoupon.percentageOff),
        });
      }
    }

    setCouponActions && setCouponActions((prevState) => ({
      ...prevState,
      isEditing: true,
    }));
  }

  // function to handle coupon deleting
  function handleDeleting(id:number){
    if(id){
      console.log(id)
      const currentId = String(id);
      console.log(currentId)
      setCurrentId && setCurrentId(currentId);
    }

    setCouponActions && setCouponActions((prevState) => ({
      ...prevState,
      isDeleting: true,
    }));
  }


  // ${isOverflowing ? "show-scrollbar" : "hide-scrollbar"}
  return (
    <div
      ref={sideNavBarRef}
      className={`${className} p-5`}
    >
        <div className={`${isOverflowing ? "show-scrollbar" : "hide-scrollbar"}`}>
          <div className="h-full flex flex-col gap-y-5">
            <nav className="flex flex-col gap-y-10">
              <Logo />
              <ul className="flex flex-col gap-y-4">
                <Link to="dashboard">
                  <li className={`p-2 flex gap-3 items-center ${
                          paths?.includes("dashboard")
                            ? "text-white bg-black"
                            : "text-text-black"
                        } `}>
                    <Home size={20} />
                    <p className="text-size-400 font-normal capitalize">dashboard</p>
                  </li>
                </Link>
                <Link to="view-orders">
                  <li className={`p-2 flex gap-3 items-center ${
                          paths?.includes("orders")
                            ? "text-white bg-black"
                            : "text-text-black"
                        } `}>
                    <ShoppingCartIcon size={20} />
                    <p className="text-size-400 font-normal capitalize">orders</p>
                  </li>
                </Link>
                <Link to="category">
                  <li className={`p-2 flex gap-3 items-center ${
                          paths?.includes("category")
                            ? "text-white bg-black"
                            : "text-text-black"
                        } `}>
                    <LibraryBig size={20} />
                    <p className="text-size-400 font-normal capitalize">category</p>
                  </li>
                </Link>
                <Link to="inventory">
                  <li className={`p-2 flex gap-3 items-center ${
                          paths?.includes("inventory")
                            ? "text-white bg-black"
                            : "text-text-black"
                        } `}>
                    <Layers3 size={20} />
                    <p className="text-size-400 font-normal capitalize">inventory</p>
                  </li>
                </Link>
                <Link to="products">
                  <li className={`p-2 flex gap-3 items-center ${
                          paths?.includes("products")
                            ? "text-white bg-black"
                            : "text-text-black"
                        } `}>
                    <Package size={20} />
                    <p className="text-size-400 font-normal capitalize">products</p>
                  </li>
                </Link>
                <Link to="view-customers">
                  <li className={`p-2 flex gap-3 items-center ${
                          paths?.includes("view-customers")
                            ? "text-white bg-black"
                            : "text-text-black"
                        } `}>
                    <CircleUserRound size={20} />
                    <p className="text-size-400 font-normal capitalize">customers</p>
                  </li>
                </Link>
                <Link to="accounts">
                  <li className={`p-2 flex gap-3 items-center ${
                          paths?.includes("accounts")
                            ? "text-white bg-black"
                            : "text-text-black"
                        }`}>
                    <UserRoundCogIcon size={20} />
                    <p className="text-size-400 font-normal capitalize">administrators</p>
                  </li>
                </Link>
                <Link to="account-setting">
                  <li className={`p-2 flex gap-3 items-center  ${
                          paths?.includes("account-setting")
                            ? "text-white bg-black"
                            : "text-text-black"
                        }`}>
                    <Settings size={20} />
                    <p className="text-size-400 font-normal capitalize">settings</p>
                  </li>
                </Link>
              </ul>
            </nav>
            <div className="w-full flex flex-col gap-y-4">
                {(coupons && coupons.length > 0) && coupons.map((coupon) =>(
                  <div className="w-full px-4 py-2 border border-green-500 flex flex-col gap-y-2 rounded-md">
                    <div className="flex gap-2 justify-end">
                        <div 
                          className="p-1 text-green-500 cursor-pointer"
                          onClick={() => handleEditing(coupon?.id)}
                        >
                          <Edit size={20}/>
                        </div>
                        <div 
                          className="p-1 text-red-500 cursor-pointer"
                          onClick={() => handleDeleting(coupon?.id)}
                        >
                          <Trash size = {20}/>
                        </div>
                      </div>
                      <div className="flex gap-x-33">
                        <p className="text-text-400 font-medium text-green-500">
                          {coupon.percentageOff}% Discount set for {formatDateDifference(coupon.expires_in)} days
                        </p>
                          
                      </div>
                      <div>
                        <p className="text-size-400 text-[#c0c0c] font-normal flex items-center">
                          Use the code <span className = "text-green-500 font-semibold ml-2">{coupon.OneTime_discountCode}</span>
                        </p>
                        <p className="text-sm text-[#c0c0c0] font-medium mt-2">Created on {formatToHumanReadableDate(coupon.createdAT)}</p>
                      </div>
                  </div>
                ))}
            </div>
          </div>

      </div>
    </div>
  );
};

export default SideNavBar;
