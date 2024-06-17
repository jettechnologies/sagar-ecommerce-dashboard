import Notification from "@/components/Notification";
import Select from "@/components/Select";
import Container from "@/components/Container";
import { Link } from "react-router-dom";
import { CirclePlusIcon, GripHorizontal, Edit, Trash, CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "@/components/Image";
import Button from "@/components/Button";
import { ProductType } from "@/types";
import Spinner from "@/components/Spinner";
import Popup from "@/components/Popup";
import Modal from "@/components/Modal";
import { EasyHTTP } from "@/utils/httpRequest";

const easyHttp = new EasyHTTP();

const Products = () => {

    const [token, setToken] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<ProductType[] | []>([]);
    const [response, setResponse] = useState<string | null | []>(null)
    const [currentId, setCurrentId] = useState("");
    const [activePopupId, setActivePopupId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() =>{
        const sessionStoragelabel: string | null =
          window.sessionStorage.getItem("auth-token");
        let sessionStorageData: { token: string } | undefined;
    
        // Check to ensure that the sessionStorage is not empty
        if (sessionStoragelabel !== null) {
          try {
            sessionStorageData = JSON.parse(sessionStoragelabel) as {
              token: string;
            };
          } catch (error) {
            console.error("Failed to parse session storage label:", error);
            sessionStorageData = undefined;
          }
        }
        if (sessionStorageData?.token) {
          const token = sessionStorageData.token;
          setToken(token);
        }
    }, []);

    useEffect(() =>{
        if (!token) return;

    const getAllProducts = async (token:string) => {
      try {
        setLoading(true);
        const res = await fetch("https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/product-mgt/fetch-all-products", {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        const data = await res.json();
        console.log(data[0])

        if (!res.ok) {
          console.log(res);
          setError(data.message || 'An error occurred');
          return;
        }

        setProducts(data[0]);
      } catch (e : any) {
        console.log(e.message);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    getAllProducts(token);
    }, [token]);

    
    console.log(products)


    const handlePopupToggle = (id:number) => {
        setActivePopupId(prevId => (prevId === id ? null : id));
    };

    // handling editing of a category
    const handleIsEditing = (id:number)  =>{
        setIsEditing(prevState => !prevState)

        setCurrentId(String(id))
    }

    // Stuff for deleting a category
    const handleIsDeleting = (id:number) =>{
        setIsDeleting(prevState => !prevState);

        setCurrentId(String(id))
    }

    const handleDeleteProduct = async() =>{
        console.log(token, currentId)
        // const id = string(currentId);
        const url = `product-mgt/take-down-product/${currentId}`;
        const headers = {
            'Authorization': `Bearer ${token}`,
        }

        try{
            setLoading(true)
            const res = await easyHttp.delete(url, headers);
            setResponse(res)
        }
        catch(e: any){
            console.log(e.message)
            setError(e.message);
        }
        finally{
            setLoading(false)
        }

        if(error !== null){
            return;
        }

        console.log(response)

        setIsDeleting(prevState => !prevState);

        window.location.reload();

    }

  return (
    <div className="w-full h-full">
        <div className="min-h-16 w-full">
            <Container >
                <div className="flex justify-between">
                    <div className="flex gap-x-4">
                        <div className="w-fit h-full">
                          <Select 
                            id="category" 
                            name = "category" 
                             className="border border-[#c0c0c0]" 
                            select={[{key: "electronics", value: "electronics"}, {key: "wearables", value: "wearables"}, {key: "gamings", value: "gamings"}, {key: "cameras", value: "cameras"}]}
                            defaultText="Categories"
                            />
                        </div>
                        <div className="w-fit h-full">
                          <Select 
                                id = "status" 
                                name = "status" 
                                className="border border-[#c0c0c0]" 
                                select={[ {key: "processing", value: "processing"}, {key: "completed", value: "completed"}, {key: "failed", value: "failed"}]}
                                defaultText="status"
                            />
                        </div>
                        <div className="w-fit h-full">
                          <Select 
                            id = "price" 
                            name="price" 
                            className="border border-[#c0c0c0]" 
                            select={[{key: "customer review", value: "customer review"}, {key: "lowest - highest", value: "lowest - highest"}]}
                            defaultText="price"
                            />
                        </div>
                        <div className="w-fit h-full">
                          <Select 
                            id = "date" 
                            name = "date" 
                            className="border border-[#c0c0c0]" 
                            select={[{key: "customer review", value: "customer review"}, {key: "lowest - highest", value: "lowest - highest"}]}
                            defaultText="date"
                            />
                        </div>
                    </div>
                    <Link to = "add-product" className="text-size-xs px-6 py-2 flex gap-2 bg-black rounded-md text-white items-center justify-center font-normal">
                      <CirclePlusIcon color="#fff"/>
                      Add Product
                    </Link>
                </div>
            </Container>
        </div>
        <Container className="mt-4 min-h-screen">
            <div className="flex justify-between items-center w-full mb-4">
                <h3 className="font-semibold text-size-500 text-text-bold">
                    Products
                </h3>
                <p className="text-[#c0c0c0] hover:text-blue text-size-400 font-medium p-2 cursor-pointer">
                    See all
                </p>
            </div>
            <div className="h-full">
                <table className="min-w-full text-center text-sm font-light">
                    <thead className="font-medium border-b bg-black text-white">
                        <tr>
                            <th scope="col" className="px-6 py-4">Product Image</th>
                            <th scope="col" className="px-6 py-4">Product Name</th>
                            <th scope="col" className="px-6 py-4">Category</th>
                            <th scope="col" className="px-6 py-4">Stock</th>
                            <th scope="col" className="px-6 py-4">Unit Price</th>
                            <th scope="col" className="px-6 py-4">Wholesale price</th>
                            <th scope="col" className="px-6 py-4">Status</th>
                            <th scope="col" className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((product) => (
                            <tr key = {product.id} className="border border-gray hover:bg-gray cursor-pointer capitalize items-center">
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                                    <Image 
                                        src = {product.productImage}
                                        className="w-[3rem] h-[3rem] rounded-md"
                                        alt="product image"
                                    />
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{product.name}</td>
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-sm ">{product?.category?.name}</td>
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{product.stock}</td>
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{product.price}</td>
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">{product.wholesalePrice}</td>
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                                    <Notification 
                                        type = {
                                            product.isOutOfStock ?
                                            "danger" :
                                            "success"
                                        } 
                                        message={
                                            product.isOutOfStock ?
                                            "Out of Stock" :
                                            "In Stock"
                                        }  className="text-white rounded-md w-fit"/>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-sm relative">
                                <Button 
                                    size="small" 
                                    type="white"
                                    handleClick={() => handlePopupToggle(product.id)}
                                    className={`border-none z-10`}
                                >
                                    <GripHorizontal />
                                </Button>
                                {activePopupId === product.id && (
                                            <Popup className="top-16">
                                                <div className="w-full border-b border-[#f0f0f0] flex justify-center">
                                                    <Button 
                                                        size="small" 
                                                        type="white" 
                                                        handleClick = {() => handleIsEditing(product.id)}
                                                        className="bg-transparent border-none flex gap-3 text-sm items-center"
                                                    >
                                                        <Edit />
                                                        Edit category
                                                    </Button>
                                                </div>
                                                <div className="flex w-full justify-center">
                                                    <Button 
                                                        size="small" 
                                                        type="white" 
                                                        className="border-none bg-transparent flex gap-3 text-sm items-center"
                                                        handleClick = {() => handleIsDeleting(product.id)}
                                                    >
                                                        <Trash />
                                                        Delete category
                                                    </Button>
                                                </div>
                                            </Popup>
                                        )}
                                </td>
                            </tr>
                            ))
                            // products.map((product: ProductType) =>(
                                
                            // ))
                            
                        }
                    </tbody>
                        {
                            loading && (
                                <div className="w-full h-full grid place-items-center border-2 border-black">
                                    <Spinner />
                                </div>)
                        }

                        {
                            error && (
                                <div className="w-full h-full grid place-items-center">
                                    <h1>An error occurred while fetching</h1>
                                    <Link to = "/admin/category" 
                                        className="w-[20rem] py-4 cursor-pointer text-sm font-medium text-white"
                                    >
                                        Refresh page
                                    </Link>
                                </div>
                            ) 
                        }
                </table>
            </div>
            <div className="mt-6 w-full flex justify-end">
                <div className="w-48 h-10 border-2 border-black">

                </div>
            </div>
            
                    {/* Editing existing product category */}
        <Modal title = "Edit existing product" isOpen={isEditing} handleModalOpen={() => setIsEditing(prevState => !prevState)}>
            <form id ="edit-category-form" className="w-full">
                {/* {error.status && <Notification message = {error.msg} type = "danger" className="text-white mb-4"/>} */}
                    <div className="w-full">
                        <label htmlFor="category-name" className="text-size-400 text-text-black font-medium mb-3">
                            Category Name
                        </label>
                        <input 
                            type="text" 
                            placeholder="Name a category" 
                            id="category-name" 
                            name="name"
                            
                            className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="category-desc" className="text-size-400 text-text-black font-medium mb-3">
                            Category Description
                        </label>
                        <textarea 
                            name="description" 
                            id="category-desc" 
                            rows={3} 
                            placeholder="Write category descriptions"
                           
                            className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        > 
                        </textarea>
                    </div>
                    <div className="w-full">
                        <label htmlFor="category-banner" className="text-size-400 text-text-black font-medium mb-3">
                            Category Banner
                        </label>
                        <input 
                            type="file"  
                            id="category-banner" 
                            name="banne"
                            
                            className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                    </div>
                    <Button size = "large" className="w-full mt-4 uppercase">{loading ? "Loading..." : "Create catergory"}</Button>
                </form>
        </Modal>

        {/* Deleting existing product category */}
        <Modal title = "Delete existing product" isOpen={isDeleting} handleModalOpen={() => setIsDeleting(prevState => !prevState)}>
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-3">
                    {/* <MessageSquareWarning size = {35} color = "rgb(239 68 68)"/> */}
                    <CircleAlert size = {35} color = "rgb(239 68 68)" />
                    <p>
                        Are you sure u want to delete this product ?
                    </p>
                </div>
                <div className="flex gap-5 mt-5 border-t border-[#f0f0f0] pt-3">
                    <Button 
                        type="white" 
                        size="medium" 
                        className="text-sm uppercase flex-1"
                        handleClick = {() => setIsDeleting(prevState => !prevState)}
                    >
                        no, cancel
                    </Button>
                    <Button 
                        type="danger" 
                        size="medium"
                         handleClick={() => handleDeleteProduct()}
                        className="text-sm uppercase flex-1"
                    >
                        {loading ? "loading" : "yes, delete"}
                    </Button>
                </div>
            </div>
        </Modal>


        </Container>
    </div>
  )
}

export default Products