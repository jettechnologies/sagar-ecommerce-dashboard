import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CirclePlusIcon, GripHorizontal, Edit, Trash, CircleAlert, Search } from "lucide-react";
import Notification from "@/components/Notification";
import Container from "@/components/Container";
import Image from "@/components/Image";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import Popup from "@/components/Popup";
import Modal from "@/components/Modal";
import ErrorModal from "@/components/ErrorModal";
import EditProduct from "@/sections/EditProduct";
import { ArrowRightIcon, ArrowLeftIcon } from "@/icons/svg";
import { EasyHTTP } from "@/utils/httpRequest";
import { useAuth } from "@/context/authContext";
import { ProductType } from "@/types";

const easyHttp = new EasyHTTP();

interface ProductContentType {
    name: string;
    description: string;
    price: string;
    stock: string;
    productimage: File | null;
}

const Products = () => {
    const [error, setError] = useState<string | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [result, setResult] = useState<ProductType[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [response, setResponse] = useState<string | null | []>(null)
    const [search, setSearch] = useState("");
    const [currentId, setCurrentId] = useState("");
    const [productContent, setProductContent] = useState<ProductContentType>({
        name: "",
        description: "",
        price: "",
        stock: "",
        productimage: null,
    });
    const [activePopupId, setActivePopupId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { token } = useAuth();


    console.log(response);

    useEffect(() => {
        if (!token || search === null) return;

        const getAllProducts = async (token: string) => {
            try {
                setLoading(true);
                const res = await fetch("https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/product-mgt/fetch-all-products", {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data.message || 'An error occurred');
                    return;
                }

                setProducts(data[0]);
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        };

        getAllProducts(token);
    }, [token, search]);

    const handlePopupToggle = (id: number) => {
        setActivePopupId(prevId => (prevId === id ? null : id));
    };

    const handleIsEditing = (id: number) => {
        setIsEditing(prevState => !prevState);
        setCurrentId(String(id));
    };

    const handleIsDeleting = (id: number) => {
        setIsDeleting(prevState => !prevState);
        setCurrentId(String(id));
    };

    const handleDeleteProduct = async () => {
        const url = `product-mgt/take-down-product/${currentId}`;
        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        try {
            setDeleteLoading(true);
            const res = await easyHttp.delete(url, headers);
            setResponse(res);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setDeleteLoading(false);
        }

        if (error === null) {
            setIsDeleting(prevState => !prevState);
            window.location.reload();
        }
    };

    const searchProducts = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!search) return;

        const url = `browse/search-product?keyword=${search}`;

        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}${url}`);
            const data = await res.json();

            if (!res.ok) {
                // setError(data.message || 'An error occurred');
                throw new Error(data.message || 'An error occurred')
            }

            setResult(data.data);
        } catch (err) {
            console.log((err as Error).message);
            setSearchError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Backspace' || e.key === 'Delete') && search === "") {
            setSearch("");
            setResult(null);
        }
    };

    useEffect(() => {
        const inputElement = document.getElementsByTagName('input')[0];

        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.key === 'Backspace' || e.key === 'Delete') && search === "") {
                setSearch("");
                setResult(null);
            }
        };

        inputElement.addEventListener('keydown', handleKeyPress);

        return () => {
            inputElement.removeEventListener('keydown', handleKeyPress);
        };
    }, [search]);

  return (
    <div className="w-full h-full">
        <div className="min-h-16 w-full">
            <Container>
                <div className="flex justify-between">
                <form onSubmit={searchProducts} className="w-fit">
                    <div className="w-full flex items-center p-1 border border-black focus-within:border-blue focus-within:border-2 rounded-md">
                        <input
                        type="text"
                        value = {search}
                        placeholder="Search products"
                        onChange = {(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-[25em] h-10 border-none outline-none text-text-black bg-transparent pl-2"
                        />
                        <button type = "submit" className="p-2 cursor-pointer">
                            <Search color="#c0c0c0" />
                        </button>
                    </div>
                </form>
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
                <table className="w-full text-center text-sm font-light">
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
                            !result ? products.map((product) => (
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
                                                        Edit product
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
                                                        Delete product
                                                    </Button>
                                                </div>
                                            </Popup>
                                        )}
                                </td>
                            </tr>
                            ))
                        : result.map((product) => (
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
                        }
                    </tbody>
                </table>
                {
                            loading && (
                                <div className="w-full h-full grid place-items-center">
                                    <Spinner />
                                </div>)
                        }

                        {
                            error && (
                                <div className="w-full h-full grid place-items-center">
                                    <h1>An error occurred while fetching</h1>
                                    <Link to = "/admin/products" 
                                        className="w-[20rem] py-4 cursor-pointer text-sm font-medium text-white"
                                    >
                                        Refresh page
                                    </Link>
                                </div>
                            ) 
                        }
            </div>
                <div className="mt-8 w-full flex justify-end">
                    <div className="w-fit flex gap-x-5 h-10">
                        <Button size="small" className="text-white text-sm lg:text-base font-medium flex justify-center gap-2">
                            <ArrowLeftIcon stroke="#fff" />
                            Previous
                        </Button>
                        <Button size="small" className="text-white text-sm lg:text-base font-medium flex justify-center gap-2 px-6">
                            Next
                            <ArrowRightIcon stroke="#fff" />
                        </Button>
                    </div>
                </div>
            
             {/* editing existing product category */}
             <EditProduct 
                isOpen = {isEditing}  
                content = {productContent}
                productId={currentId}
                setProductChange={setProductContent} 
                handleModalClose={() => setIsEditing(prevState => !prevState)} 
            />

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
                        {deleteLoading ? "loading" : "yes, delete"}
                    </Button>
                </div>
            </div>
        </Modal>

        <ErrorModal error = {searchError} setError={() => setSearchError(null)} redirect="/admin/products" />

        </Container>
    </div>
  )
}

export default Products