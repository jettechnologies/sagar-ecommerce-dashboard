import Container from "@/components/Container";
// import { Link } from "react-router-dom";
import Button from "@/components/Button"
import { CirclePlusIcon, GripHorizontal } from "lucide-react";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import { EasyHTTP, Headers } from "@/utils/httpRequest";
import { useCategories } from "../hooks/usCategories";
import Notification from "@/components/Notification";
import Spinner from "@/components/Spinner";

interface Category{
    name: string;
    description: string;
}

// interface Categories{
//     name: string;
//     description: string;
//     id: string;
//     createdAt: Date;
//     updatedAt: Date;
// }

const Category = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resError, setResError] = useState<string | null>(null);
    const [response, setResponse] = useState<string | null>(null)
    const [error, setError] = useState<{msg: string; status: boolean}>({
        msg: "",
        status: false,
    });
    const [token, setToken] = useState<string>("");
    const { isLoading, isError, getCategories, categories } = useCategories();

    const [category, setCategory] = useState<Category>({
        name: "",
        description: ""
    })

    useEffect(() =>{
        getCategories()
    }, [getCategories]);

    // useEffect(() =>{
    //     window.location.reload();
    // }, []);

    const easyHttp = new EasyHTTP;

    
    useEffect(() => {
        const sessionStorageValue: string | null = window.sessionStorage.getItem("auth-token");
        let sessionStorageData: { token: string } | undefined;
    
        // Check to ensure that the sessionStorage is not empty
        if (sessionStorageValue !== null) {
            try {
                sessionStorageData = JSON.parse(sessionStorageValue) as { token: string };
            } catch (error) {
                console.error("Failed to parse session storage value:", error);
                sessionStorageData = undefined;
            }
        }
        if (sessionStorageData?.token) {
            const token = sessionStorageData.token;
            setToken(token);
        }
    }, []);

    const handleModalOpen = () =>{
        setIsOpen(prevIsOpen => !prevIsOpen)
    }

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value } = target;

        setCategory({ ...category, [name]: value.toLocaleLowerCase() });
    }

    const handleFormSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        const { name, description } = category;

        if(name === "" || description === ""){
            setError({msg: "All fields are required", status: true});
            return
        }

        const data = {
            name,
            description
        }
        const url = "product-mgt/new-product-category";
        const headers: Headers = {
            'Content-type': 'application/json',
            "Accept": "application/json",
            'Authorization': `Bearer ${token}`,
        }

        try{
            setLoading(true)
            const res = await easyHttp.post(url, headers, data);
            console.log(res);

            setResponse(response);
        }
        catch(e: any){
            setResError(e.message);
        }
        finally{
            setLoading(false)
        }

        if(resError !== null){
            return;
        }

        setIsOpen(prevIsOpen => !prevIsOpen);

        window.location.reload();
        
    }

    useEffect(() =>{
        let errorRemoval: ReturnType<typeof setTimeout>;
    
        if(error){
           errorRemoval =  setTimeout(() =>{
                setError({status: false, msg: ""});
            }, 2000)
        }
    
        return() => clearTimeout(errorRemoval)
    }, [error]);

  return (
    <div className="relative w-full h-full">
    <Container className="mt-4 min-h-screen">
            <div className="flex justify-between items-center w-full mb-4">
                <h3 className="font-semibold text-size-500 text-text-bold">
                    Administrators
                </h3>
                <Button handleClick={handleModalOpen} size="medium" className="text-size-xs px-4 py-2 flex gap-2 text-white items-center justify-center font-normal">
                    <CirclePlusIcon color="#fff"/>
                    Create new category
                </Button>
            </div>
            <div className="h-full">
                <table className="min-w-full text-center text-sm font-light">
                    <thead className="font-medium border-b bg-black text-white">
                        <tr>
                            <th scope="col" className="px-6 py-4">#ID</th>
                            <th scope="col" className="px-6 py-4">Name</th>
                            <th scope="col" className="px-6 py-4">Description</th>
                            <th scope="col" className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            categories.length > 0 ? (
                                categories.sort((a, b) => a.id - b.id).map((category) => (
                                    <tr key = {category.id} className="border border-gray hover:bg-gray cursor-pointer" >
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm capitalize">{category.id}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm first-letter:uppercase">{category.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm first-letter:uppercase">{category.description}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                                            <Button size="small" type="white" className="border-none">
                                                <GripHorizontal />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : isError ? (
                                <div className="w-full h-full grid place-items-center">
                                    <h1>An error occurred while fetching</h1>
                                </div>
                            ) : isLoading ? (
                                <div className="w-screen border-2 border-black min-h-full grid place-items-center">
                                    <Spinner />
                                </div>
                            ) : null
                        }

                        
                    </tbody>
                </table>
            </div>
            <div className="mt-6 w-full flex justify-end">
                <div className="w-48 h-10 border-2 border-black">

                </div>
            </div>

        </Container>

        <Modal title = "create new product" isOpen={isOpen} handleModalOpen={handleModalOpen}>
            <form id ="product-form" className="w-full" onSubmit={handleFormSubmit}>
            {error.status && <Notification message = {error.msg} type = "danger" className="text-white mb-4"/>}
                <div className="w-full">
                    <label htmlFor="category-name" className="text-size-400 text-text-black font-medium mb-3">
                        Category Name
                    </label>
                    <input 
                        type="text" 
                        placeholder="Name a category" 
                        id="category-name" 
                        name="name"
                        onChange={handleInputChange}
                        className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
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
                        onChange={handleInputChange}
                        className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                    > 
                    </textarea>
                </div>
                <Button size = "large" className="w-full mt-4 uppercase">{loading ? "Loading..." : "Create catergory"}</Button>
            </form>
        </Modal>

        {
            response && 
            <div className="absolute w-fit z-60 top-[6rem] right-[1.5rem]">
                <Notification className="rounded-md w-[18rem] text-sm font-medium text-white" message={response} type="success" />
            </div>
        }

    </div>
  )
}

export default Category