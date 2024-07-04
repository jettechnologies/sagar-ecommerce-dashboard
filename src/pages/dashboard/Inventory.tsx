import Container from "@/components/Container"
import { Search } from "lucide-react";
import { useCallback, useState } from "react";
import { EasyHTTP } from "@/utils/httpRequest";
import { useAuth } from "@/context/authContext";
import Image from "@/components/Image";
import { formatToHumanReadableDate } from "@/utils/dateFunctions";
import Button from "@/components/Button";
import Popup from "@/components/Popup";
import { GripHorizontal, Layers3 } from "lucide-react";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import { Link } from "react-router-dom";
// import { useLocalStorage } from "@/useLocalStorage";

type Product = {
  id: number;
  productID: string;
  name: string;
  price: string;
  hasTax: boolean;
  taxRate: string;
  wholesalePrice: string;
  minWholesaleQuantity: number;
  productImage: string;
  description: string;
  stock: number;
  restockedAT: null | string;
  stockAdjustedAT: null | string;
  availability: string;
  isOutOfStock: boolean;
  available_colors: string;
  available_sizes: string;
  weight: null; // or specify the type if it's not always null
  purchaseCount: number;
  createdAT: string;
  updatedAT: null | string;
  affiliateLink: null | string;
  video: any[]; // or specify a more specific type for video URLs or objects
};

const easyHttp = new EasyHTTP();

const Inventory = () => {

  const { token, loading:authLoading } = useAuth();
  const [threshold, setThreshold] = useState("");
  const [currentThreshold, setCurrentThreshold] = useState("");
  const [products, setProducts] = useState<Product[] | []>([]);
  // const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePopupId, setActivePopupId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const fetchThresholdProducts = useCallback(async () => {
    if (threshold === "") return;
  
    try {
      setLoading(true);
      setError("");
      const url = `inventory/get-low-stock?threshold=${threshold}`;
      const res = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify({ threshold }),
      });
  
      const response = await res.json();
      if (!res.ok) throw new Error(response.message);
  
      console.log(response);
      setProducts(response[0]);
      setThreshold("");
    } catch (err) {
      console.log((err as Error).message);
      setError((err as Error).message);
      setProducts([]);
    } finally {
      setLoading(false);
      // setError("")
    }
  }, [threshold, token]);

  console.log(error, threshold, products);
  
  const handlePopupToggle = (id: number) => {
    setActivePopupId((prevId) => (prevId === id ? null : id));
  };

  const handleUpdateThreshold = useCallback(
    (id: number) => {
        const activeProduct = products.find((product) => product.id === id);
        if (activeProduct) {
            setCurrentThreshold(String(activeProduct.stock));
            setCurrentProduct(activeProduct);
            setIsUpdating(true);
        }
    },
    [products]
);

const updateThreshold = useCallback(
  async(e: React.FormEvent<HTMLFormElement>) =>{

    e.preventDefault();

    if(currentThreshold === "" || token === "" || authLoading) return;

    try{
      if(!currentProduct) return;

      setLoading(true);
      const url = `inventory/restock/${currentProduct.id}`;

      const headers = {
        "Content-Type": 'application/json',
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const data = {
        quantity: parseInt(currentThreshold),
      };

      const response = await easyHttp.patch(url, headers, data);
      console.log(response);
      setIsUpdating(false);

      setProducts((prevState) => {
        return prevState.map((product) => {
          if (product.id === currentProduct.id) {
            return { ...product, stock: parseInt(currentThreshold) + product.stock };
          }
          return product;
        });
      });
    }
    catch(err){
      console.log((err as Error).message);
    }
    finally{
      setLoading(false);
    }
  },[authLoading, currentProduct, currentThreshold, token]
);

  return (
    <>
      <div className="w-full h-full">
        <Container className="mt-4 min-h-screen" >
          <div className="w-full h-full">
            <div className="flex justify-between items-center w-full mb-8">
              <h3 className="font-semibold text-size-500 text-text-bold uppercase">
                Product threshold search
              </h3>
              
              <div className="flex gap-4">
                {/* <div className="flex gap-3 items-center">
                  <input 
                    type="checkbox" 
                    name="default" 
                    checked = {isDefault}
                    onChange={() => setIsDefault(prevState => !prevState)}
                  />
                  <p className="text-base text-text-black font-medium">Set as default</p>
                </div> */}
                <form className="w-fit">
                  <div className="w-full flex items-center p-1 border border-black focus-within:border-blue focus-within:border-2 rounded-md">
                    <input
                      type="number"
                      placeholder="Enter a low threshold"
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value)}
                      className="w-[15rem] h-10 border-none outline-none text-text-black bg-transparent pl-2"
                    />
                    <div 
                      className="p-2 cursor-pointer"
                      onClick={() => fetchThresholdProducts()}
                    >
                      <Search color="#c0c0c0" />
                    </div>
                  </div>
                </form>
              </div>
            </div>  
            <hr className="my-3" />
            <div className="w-full mt-4">
              <table className="min-w-full text-center text-sm font-light">
                <thead className="font-medium border-b bg-black text-white">
                  <tr className = "text-center">
                    <th scope="col" className="px-6 py-4">Product Image</th>
                    <th scope="col" className="px-6 py-4">Product Name</th>
                    <th scope="col" className="px-6 py-4">Stock</th>
                    <th scope="col" className="px-6 py-4">Purchase Count</th>
                    <th scope="col" className="px-6 py-4">RestockedAt</th>
                    <th scope="col" className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 && products.map(product =>(
                    <tr key = {product.id} className="border border-gray hover:bg-gray cursor-pointer capitalize items-center">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                        <Image 
                          src = {product.productImage}
                          className="w-[3rem] h-[3rem] rounded-md"
                          alt="product image"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{product.name}</td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{product.stock}</td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{product.purchaseCount}</td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{product.restockedAT && formatToHumanReadableDate(product.restockedAT?.split("T")[0])}</td>
                      <td className="whitespace-nowrap px-2 py-2 sm:px-4 sm:py-4 font-medium text-sm relative">
                        <Button
                          size="small"
                          type="white"
                          handleClick={() => handlePopupToggle(product.id)}
                          className="border-none z-10"
                        >
                          <GripHorizontal />
                        </Button>
                        {activePopupId === product.id && (
                          <Popup className="top-16">
                            <div className="flex w-full border-b border-[#f0f0f0]">
                              <Button
                                size="small"
                                type="white"
                                className="capitalize border-none bg-transparent flex gap-5 text-sm items-center"
                                handleClick={() => handleUpdateThreshold(product.id)}
                              >
                                <Layers3 />
                                Restock product
                              </Button>
                            </div>
                          </Popup>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {
                  loading && <div className="w-full h-full"><Spinner /></div>
                }

                {
                  error && <div className="w-fulll h-full grid place-items-center">
                    <p>{error}</p>
                    <Link to = "/admin/inventory" className="w-[20rem] h-[4rem] text-center bg-black text-white">Refresh page</Link>
                  </div>
                }
            </div>
          </div>
        </Container>
      </div>

      {/* modal for updating the order status */}
      <Modal title="Update products threshold" isOpen={isUpdating} handleModalOpen={() => setIsUpdating((prevState) => !prevState)}>
        <form id="update_products_threshold" onSubmit={updateThreshold} className="w-full">
          <p className="text-text-black text-size-500 font-medium">Enter restock quantity</p>
          <div className="w-full flex items-center p-1 border border-black focus-within:border-blue focus-within:border-2 rounded-md mt-4">
            <input
              type="number"
              placeholder="Enter a low threshold"
              value={currentThreshold}
              onChange={(e) => setCurrentThreshold(e.target.value)}
              className="w-[15rem] h-10 border-none outline-none text-text-black bg-transparent pl-2"
            />
          </div>
          <Button size="large" className="w-full mt-4 uppercase">
            {loading ? "Loading..." : "Update product threshold"}
          </Button>
        </form>
      </Modal>
    </>
  )
}

export default Inventory
