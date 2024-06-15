import Container from "@/components/Container";
import { Link } from "react-router-dom";
import Button from "@/components/Button"
import { CirclePlusIcon, Edit, GripHorizontal, Trash, CircleAlert } from "lucide-react";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import { EasyHTTP, Headers } from "@/utils/httpRequest";
import { useCategories } from "../hooks/usCategories";
import Notification from "@/components/Notification";
import Spinner from "@/components/Spinner";
import Popup from "@/components/Popup";
import { imageValidate } from "@/utils/imageValidate";

interface Category{
    name: string;
    description: string;
    banner: string;
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
    const [activePopupId, setActivePopupId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false);

    const handlePopupToggle = (id:number) => {
        setActivePopupId(prevId => (prevId === id ? null : id));
    };
    const { isLoading, isError, getCategories, categories } = useCategories();

    const [category, setCategory] = useState<Category>({
        name: "",
        description: "",
        banner: "",
    })

    useEffect(() =>{
        getCategories()
    }, [getCategories]);

    useEffect(() =>{
        let errorTimer: NodeJS.Timeout;

        if(resError !== null){
            errorTimer = setTimeout(() =>{
                setResError(null)
            }, 2500);
        }

        return () => clearTimeout(errorTimer)
    }, [resError]);

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

    // handleing input changes
    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value } = target;

        setCategory({ ...category, [name]: value.toLocaleLowerCase() });
    }

    // handling image upload
    const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const { files, name } = target;

        if (!files || files.length === 0) {
            return;
        }

        const imgArr = Array.from(files);
        const validate = imageValidate(imgArr);

        if(!validate){
            console.log("the validation failed");

            return;
        }

        imgArr.forEach(file => {
            const reader = new FileReader();
            // const fileName = file.name;
    
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
    
                img.onload = () => {
                    const base64String = event.target?.result as string;
                    setCategory({ ...category, [name]: base64String});
                };
            };
    
            reader.readAsDataURL(file);
        });
    }

    // const handleDeleteCategory = () =>{

    // }

    // handle form submit
    const handleFormSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        const { name, description, banner } = category;

        if(name === "" || description === ""){
            setError({msg: "All fields are required", status: true});
            return
        }

        const data = {
            name,
            description,
            banner
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
            console.log(e.message)
            setResError(e.message);
        }
        finally{
            setLoading(false)
        }

        if(resError !== null){
            return;
        }

        setIsOpen(prevIsOpen => !prevIsOpen);

        // window.location.reload();
        
    }

    console.log(resError)

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
    <div className="w-full h-full">
    <Container className="mt-4 min-h-screen relative">
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
                        {categories.length > 0 && (
                            categories
                                .sort((a, b) => a.id - b.id)
                                .map((category) => (
                                    <tr key={category.id} className={`border border-gray hover:bg-gray cursor-pointer ${activePopupId === category.id && "relative"} z-20`}>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm capitalize">{category.id}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm first-letter:uppercase">{category.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm first-letter:uppercase">{category.description?.slice(0, 200) + "..."}</td>
                                        <td className="z-20 whitespace-nowrap px-6 py-4 font-medium text-sm">
                                            <Button 
                                                size="small" 
                                                type="white" 
                                                handleClick={() => handlePopupToggle(category.id)}
                                                className={`border-none z-10`}
                                            >
                                                <GripHorizontal />
                                            </Button>

                                            {activePopupId === category.id && (
                                                <Popup className="top-16">
                                                    <div className="w-full border-b border-black flex justify-center">
                                                        <Button 
                                                            size="small" 
                                                            type="white" 
                                                            handleClick = {() => setIsEditing(prevState => !prevState)}
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
                                                            handleClick = {() => setIsDeleting(prevState => !prevState)}
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
                        )}
                    </tbody>
                </table>
                {
                    isLoading && (
                        <div className="w-full h-full grid place-items-center">
                            <Spinner />
                        </div>)
                }

                {
                    isError && (
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
            </div>
            <div className="mt-6 w-full flex justify-end">
                <div className="w-48 h-10 border-2 border-black">

                </div>
            </div>
            {
                resError && <Notification 
                        message={resError} 
                        type = "danger" 
                        className="absolute top-[-2.5rem] right-5 z-40 text-white"
                    />
            }
        </Container>

        {/* Creating new product category */}
        <Modal title = "create new category" isOpen={isOpen} handleModalOpen={handleModalOpen}>
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
                        onChange={handleInputChange}
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
                        onChange={handleImgUpload}
                        className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                    />
                </div>
                <Button size = "large" className="w-full mt-4 uppercase">{loading ? "Loading..." : "Create catergory"}</Button>
            </form>
        </Modal>

        {/* Editing existing product category */}
        <Modal title = "Edit existing category" isOpen={isEditing} handleModalOpen={() => setIsEditing(prevState => !prevState)}>
            <form id ="edit-category-form" className="w-full" onSubmit={handleFormSubmit}>
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
                            onChange={handleInputChange}
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
                            onChange={handleImgUpload}
                            className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                    </div>
                    <Button size = "large" className="w-full mt-4 uppercase">{loading ? "Loading..." : "Create catergory"}</Button>
                </form>
        </Modal>

        {/* Deleting existing product category */}
        <Modal title = "Delete existing category" isOpen={isDeleting} handleModalOpen={() => setIsDeleting(prevState => !prevState)}>
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-3">
                    {/* <MessageSquareWarning size = {35} color = "rgb(239 68 68)"/> */}
                    <CircleAlert size = {35} color = "rgb(239 68 68)" />
                    <p>
                        Are you sure u want to delete this category ?
                    </p>
                </div>
                <div className="flex gap-5 mt-5 border-t pt-3">
                    <Button 
                        type="white" 
                        size="medium" 
                        className="text-sm uppercase flex-1"
                        onClick = {() => setIsDeleting(prevState => !prevState)}
                    >
                        no, cancel
                    </Button>
                    <Button 
                        type="danger" 
                        size="medium" 
                        className="text-sm uppercase flex-1"
                        onClick = {handleCategoryDelete}
                    >
                        yes, delete
                    </Button>
                </div>
            </div>
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


export default Category;