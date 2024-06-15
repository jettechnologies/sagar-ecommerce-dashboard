import Container from "@/components/Container";
import Button from "@/components/Button";
import { Trash2 } from "lucide-react";
import Select from "@/components/Select";
import { useCategories } from "../hooks/usCategories";
import { useEffect, useState } from "react";
import { FileDrop } from "@/components/FileDrop";
import { imageValidate } from "@/utils/imageValidate";
import { useUserForm } from "../hooks/useUserForm";
import { Headers } from "@/utils/httpRequest";
import { useNavigate } from "react-router-dom";

interface FormData {
    name: string;
    description: string;
    stock: string;
    price: string;
    productImage: File[] | [];
    categoryId: string;
}

const AddProduct = () => {

    const { response, loading, resError, getUserFormData} = useUserForm();
    const navigate = useNavigate();
    const { categories, getCategories } = useCategories();
    const [formData, setFormData] = useState<FormData>({
        name:"",
        description: "",
        stock: "",
        price: "",
        productImage: [],
        categoryId: "",
    });
    const [token, setToken] = useState<string>("");

    const [imgString, setImgString] = useState<{name:string; src: string}[] | []>([]);

    useEffect(() =>{
        getCategories()
    }, [getCategories])

    useEffect(() => {
        const authToken = window.sessionStorage.getItem("auth-token");
        if(authToken){
            setToken(authToken);
        } 
    }, []);

    const productCategories: { key: string; value: string }[] = categories.map(category => ({
        key: category.id.toLocaleString(),
        value: category.name
    }));

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>{
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value } = target;

        setFormData({ ...formData, [name]: value.toLocaleLowerCase() });
    }

    const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const { files } = target;

        if (!files || files.length === 0) {
            return;
        }

        const imgArr = Array.from(files);
        const validate = imageValidate(imgArr);

        if(!validate){
            console.log("the validation failed");

            return;
        }

        setFormData(prevFormData => ({
            ...prevFormData,
            productImage: [...prevFormData.productImage, ...imgArr]
        }));
      
        imgArr.forEach(file => {
            const reader = new FileReader();
            const fileName = file.name;
    
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
    
                img.onload = () => {
                    const base64String = event.target?.result as string;
                    setImgString(prevImgString =>([
                        ...prevImgString,
                        {name: fileName ,src:base64String}
                    ]));
                };
            };
    
            reader.readAsDataURL(file);
        });
        
    };
    
    const deleteItem = (index: number) => {
        setImgString(prevImgString => {
            const newImgString = [...prevImgString];
            newImgString.splice(index, 1); 
            return newImgString;
        });
    
        // Delete from productImage (assuming it's also an array of { name: string, src: string })
        setFormData(prevFormData => {
            const newProductImage = [...prevFormData.productImage];
            newProductImage.splice(index, 1);
            return {
                ...prevFormData,
                productImage: newProductImage
            };
        });
    };


    const handleFormSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        const data = formData;

        const url = "product-mgt/new-product";
        const headers: Headers = {
            'Content-type': 'application/json',
            "Accept": "application/json",
            'Authorization': `Bearer ${token}`,
        }

        try {
            await getUserFormData(url, headers, data);
            if(resError !== null){
                return;
            }
            
          } catch (e) {
            console.error(e);
            throw new Error("An Error occurred");
        }

        navigate("/admin/products", { replace: true });
    }

    console.log(response, resError);

  return (
    <Container className ="mt-4 min-h-screen">
        <div className="w-full py-2 flex justify-between items-center">
            <h3 className="font-semibold text-size-500 text-text-black">
                Add Product
            </h3>
            {/* <Button 
                size="medium" 
                className="text-white font-normal text-md capitalize"
            >
                {loading ? "Loading" : "upload product"}
            </Button> */}
        </div>
        <div className="flex justify-between w-full mt-4 gap-x-8 F">
            <div className="pt-3 pb-6 px-4 flex-1 border border-[#c0c0c0] rounded-md">
                <div className="flex flex-col w-full mb-6">
                    <p className="text-sm font-normal capitalize text-text-text-black">add image</p>
                    <FileDrop 
                        handleImgUpload={handleImgUpload} 
                        setFormData={setFormData}
                        setImgString = {setImgString}
                    />
                </div>
                <ul className="flex flex-col w-full gap-y-4">
                    {imgString.map((img, index) =>{
                        
                        const nameArr = img.name.split(".");

                        return (
                            <li key = {index} className="w-full p-2 flex justify-between items-center border border-[#e0e0e0] rounded-md">
                                <div className="flex gap-3">
                                    <img src={img.src} alt="product image" className="w-10 h-10 object-contain rounded-md"/>
                                    <div className="w-fit">
                                        <p className="font-medium text-sm capitalize text-text-black">
                                            {`${nameArr[0]} ${nameArr[1]}`}
                                        </p>
                                        {/* <p className="mt-1 font-thin text-xs text-text-black capitalize">
                                            432kb
                                        </p> */}
                                    </div>
                                </div>
                                <div 
                                    onClick={() => deleteItem(index)}
                                    className="p-2 cursor-pointer">
                                    <Trash2 size = {20} color = "#121212"/>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            {/* Right side panel for the add product page */}
            <div className="py-4 px-4 flex-1 border border-[#c0c0c0] rounded-md">
                <form 
                    id ="product-form"
                    onSubmit={handleFormSubmit} 
                    className="w-full"
                >
                    <div className="w-full">
                        <label htmlFor="product-name" className="text-size-400 text-text-black font-medium mb-3">
                            Product Name
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter product name" 
                            id="product-name" 
                            name="name"
                            onChange={handleInputChange}
                            className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="sort" className="text-size-400 text-text-black font-medium mb-3">
                            Category
                        </label>
                        <div className="mt-3">
                            <Select 
                                id = "category" 
                                name="categoryId" 
                                className="border border-[#c0c0c0] text-medium text-sm w-full" 
                                select={productCategories}
                                defaultText="Categories"
                                handleInputChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <label htmlFor="stock-amount" className="text-size-400 text-text-black font-medium mb-3">
                            Total stock amount
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter stock amount" 
                            id="stock-amount" 
                            name="stock"
                            onChange={handleInputChange}
                            className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="unit-price" className="text-size-400 text-text-black font-medium mb-3">
                            Unit price
                        </label>
                        <input 
                            type="number" 
                            placeholder="Enter unit price" 
                            id="unit-price" 
                            name="price"
                            onChange={handleInputChange}
                            className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="wholesale-price" className="text-size-400 text-text-black font-medium mb-3">
                            Wholesale price
                        </label>
                        <input 
                            type="number" 
                            placeholder="Enter wholesale price" 
                            id="wholesale-price" 
                            name="wholesale-price"
                            className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="min-wholesale-unit" className="text-size-400 text-text-black font-medium mb-3">
                            Minimum wholesale unit
                        </label>
                        <input 
                            type="number" 
                            placeholder="Enter minimum wholesale unit" 
                            id="min-wholesale-unit" 
                            name="min-wholesale-unit"
                            className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="product-desc" className="text-size-400 text-text-black font-medium mb-3">
                            Descriptions
                        </label>
                        <textarea 
                            name="description" 
                            id="product-desc" 
                            rows={3} 
                            placeholder="Write product descriptions"
                            onChange={handleInputChange}
                            className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        > 
                        </textarea>
                    </div>
                    <Button 
                        size="medium" 
                        className="text-white font-normal text-md capitalize"
                    >
                        {loading ? "Loading" : "upload product"}
                    </Button>
                </form>
            </div>
        </div>
    </Container>
  )
}

export default AddProduct