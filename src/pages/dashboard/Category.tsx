import Container from "@/components/Container";
import { Link } from "react-router-dom";
import Button from "@/components/Button"
import { CirclePlusIcon, Edit, GripHorizontal, Trash, CircleAlert, Search } from "lucide-react";
import Modal from "@/components/Modal";
import { useCallback, useEffect, useState } from "react";
import { Headers, EasyHTTP } from "@/utils/httpRequest";
import { useCategories } from "../hooks/usCategories";
import Notification from "@/components/Notification";
import Spinner from "@/components/Spinner";
import Popup from "@/components/Popup";
import { ArrowRightIcon, ArrowLeftIcon } from "@/icons/svg";
// import { imageValidate } from "@/utils/imageValidate";
import Image from "@/components/Image";
import { useAuth } from "@/context/authContext";
import { CategoryType } from "@/types";
import ErrorModal from "@/components/ErrorModal";
// import { useFormData } from "../hooks/useFormData";


interface Category{
    name: string;
    description: string;
    banner: File | string;
}

const easyHttp = new EasyHTTP();

const Category = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resError, setResError] = useState<string | null>(null);
    const [response, setResponse] = useState<string | null>(null)
    const [error, setError] = useState<{msg: string; status: boolean}>({
        msg: "",
        status: false,
    });
    // const [token, setToken] = useState<string>("");
    const [activePopupId, setActivePopupId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false);
    const { token } = useAuth();
    
    const handlePopupToggle = (id:number) => {
        setActivePopupId(prevId => (prevId === id ? null : id));
    };
    
    const { isLoading, isError, getCategories, categories } = useCategories();
    const [category, setCategory] = useState<Category>({
        name: "",
        description: "",
        banner: "",
    })
    const [currentId, setCurrentId] = useState(0);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [result, setResult] = useState<CategoryType[] | null>(null);
    const [search, setSearch] = useState("");

    console.log(response);

    const searchCategories = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!search) return;

        const url = `browse/search-category?keyword=${search}`;

        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}${url}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                  },
            });
            const data = await res.json();

            if (!res.ok) {
                // setError(data.message || 'An error occurred');
                throw new Error(data.message || 'An error occurred')
            }
            console.log(data);
            setResult(data.data);
        } catch (err) {
            console.log((err as Error).message);
            setSearchError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [token, search]);


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
        // const validate = imageValidate(imgArr);

        // if(!validate){
        //     console.log("the validation failed");

        //     return;
        // }

        setCategory({...category, [name]: imgArr[0]});

    }

    // handling editing of a category
    const handleIsEditing = (id:number)  =>{
        setIsEditing(prevState => !prevState)

        setCurrentId(id)
    }

    // Stuff for deleting a category
    const handleIsDeleting = (id: number) =>{
        setIsDeleting(prevState => !prevState);

        setCurrentId(id)
    }

    const handleDeleteCategory = async() =>{
        const id = currentId;
        console.log(id)
        const url = `product-mgt/delete-product-category/${id}`;
        const headers: Headers = {
            'Authorization': `Bearer ${token}`,
        }

        try{
            setLoading(true)
            const res = await easyHttp.delete(url, headers);
            setResponse(res)
            window.location.reload();
        }
        catch(e){
            console.log((e as Error).message)
            setResError((e as Error).message);
        }
        finally{
            setLoading(false)
        }

        if(resError !== null){
            return;
        }

        // setIsDeleting(prevState => !prevState);

        // window.location.reload();

    }

    

    // handle form submit
    const handleFormSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        const { name, description, banner } = category;

        console.log(category)

        if(name === "" || description === ""){
            setError({msg: "All fields are required", status: true});
            return

        }

        console.log(name, description)

        const formData = new FormData();
    
        // Append form data
        formData.append('name', category.name);
        formData.append('description', category.description);
        if (banner) {
            formData.append('banner', category.banner);
        }
        console.log(formData);

        const url = "product-mgt/new-product-category";
        const headers: Headers = {
            'Authorization': `Bearer ${token}`,
        }

        try{
            setLoading(true)
            const res = await easyHttp.formData(url, headers, formData);
            setResponse(res)
        }
        catch(e){
            console.log((e as Error).message)
            setResError((e as Error).message);
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

    // if(loading){
    //     return<div className="w-full h-full">
    //         <Spinner />
    //     </div>
    // }

  return (
    <div className="w-full h-full">
    <div className="min-h-16 w-full">
        <Container >
            <div className="flex justify-between">
            <form onSubmit = {searchCategories} className="w-fit">
                <div className="w-full flex items-center p-1 border border-black focus-within:border-blue focus-within:border-2 rounded-md">
                    <input
                        type="text"
                        placeholder="Search categories"
                        value={search}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[25em] h-10 border-none outline-none text-text-black bg-transparent pl-2"
                    />
                    <button type="submit" className="p-2 cursor-pointer">
                        <Search color="#c0c0c0" />
                    </button>
                </div>
            </form>
            <Button handleClick={handleModalOpen} size="medium" className="text-size-xs px-4 py-2 flex gap-2 text-white items-center justify-center font-normal">
                <CirclePlusIcon color="#fff"/>
                Create new category
            </Button>
            </div>
        </Container>
    </div>
    <Container className="mt-4 min-h-screen relative">
            <div className="flex justify-between items-center w-full mb-4">
                <h3 className="font-semibold text-size-500 text-text-bold">
                    Categories
                </h3>
                {/* <Button handleClick={handleModalOpen} size="medium" className="text-size-xs px-4 py-2 flex gap-2 text-white items-center justify-center font-normal">
                    <CirclePlusIcon color="#fff"/>
                    Create new category
                </Button> */}
            </div>
            <div className="h-full mt-4">
                <table className="min-w-full text-center text-sm font-light">
                    <thead className="font-medium border-b bg-black text-white">
                        <tr>
                            <th scope="col" className="px-6 py-4">#ID</th>
                            <th scope="col" className="px-6 py-4">Category Image</th>
                            <th scope="col" className="px-6 py-4">Name</th>
                            <th scope="col" className="px-6 py-4">Description</th>
                            <th scope="col" className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!result ? (categories && categories.length > 0) && (
                            categories
                                .sort((a, b) => a.id - b.id)
                                .map((category, index) => (
                                    <tr key={category.id} className={`border border-gray hover:bg-gray cursor-pointer ${activePopupId === category.id && "relative"} z-20`}>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm capitalize">{index + 1}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm capitalize">
                                            <Image src = {category?.banner} alt = "category image" className = "w-[3rem] h-[3rem] rounded-md"/>    
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm first-letter:uppercase">{category.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm first-letter:uppercase">{category.description?.slice(0,40) + "..."}</td>
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
                                                    <div className="w-full border-b border-[#f0f0f0] flex justify-center">
                                                        <Button 
                                                            size="small" 
                                                            type="white" 
                                                            handleClick = {() => handleIsEditing(category.id)}
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
                                                            handleClick = {() => handleIsDeleting(category.id)}
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
                        ): 
                        (result && result.length > 0) && (
                            result
                                .sort((a, b) => a.id - b.id)
                                .map((category, index) => (
                                    <tr key={category.id} className={`border border-gray hover:bg-gray cursor-pointer ${activePopupId === category.id && "relative"} z-20`}>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm capitalize">{index + 1}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm capitalize">
                                            <Image src = {category?.banner} alt = "category image" className = "w-[3rem] h-[3rem] rounded-md"/>    
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm first-letter:uppercase">{category.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-sm first-letter:uppercase">{category.description?.slice(0,40) + "..."}</td>
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
                                                    <div className="w-full border-b border-[#f0f0f0] flex justify-center">
                                                        <Button 
                                                            size="small" 
                                                            type="white" 
                                                            handleClick = {() => handleIsEditing(category.id)}
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
                                                            handleClick = {() => handleIsDeleting(category.id)}
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
                        )
                    }
                    </tbody>
                </table>
                    {  
                        (isLoading || loading) && (
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
                        name="banner"
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
                         handleClick={() => handleDeleteCategory()}
                        className="text-sm uppercase flex-1"
                    >
                        {loading ? "loading" : "yes, delete"}
                    </Button>
                </div>
            </div>
        </Modal>

        <ErrorModal error = {searchError} setError={() => setSearchError(null)} redirect="/admin/category" />

        {/* {
            response && 
            <div className="absolute w-fit z-60 top-[6rem] right-[1.5rem]">
                <Notification className="rounded-md w-[18rem] text-sm font-medium text-white" message={response} type="success" />
            </div>
        } */}

    </div>
  )
}


export default Category;