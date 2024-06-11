import Container from "@/components/Container";
import Button from "@/components/Button";
import { Images, Upload } from "lucide-react";
import headphoneImg from "@/assets/images/headsets.png"; 
import { Trash2 } from "lucide-react";
import Select from "@/components/Select";

const AddProduct = () => {
  return (
    <Container className ="mt-4 min-h-screen">
        <div className="w-full py-2 flex justify-between items-center">
            <h3 className="font-semibold text-size-500 text-text-black">
                Add Product
            </h3>
            <Button size="medium" className="text-white font-normal text-md capitalize">
                upload product
            </Button>
        </div>
        <div className="flex justify-between w-full mt-4 gap-x-8 F">
            <div className="pt-3 pb-6 px-4 flex-1 border border-[#c0c0c0] rounded-md">
                <div className="flex flex-col w-full mb-6">
                    <p className="text-sm font-normal capitalize text-text-text-black">add image</p>
                    {/* file upload for mutliple image upload not more than 5 and amounting to at least 5mb need to work on the drag and drop upload feature next */}
                    <div className="flex items-center justify-center w-full mt-4">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-[#c0c0c0] border-dashed rounded-lg cursor-pointer bg-[#f8f8f8] hover:border-blue">
                            <div className="flex flex-col gap-y-4 items-center justify-center pt-5 pb-6">
                                <Images size = {100} color="#121212" strokeWidth={1}/>
                                <div className="flex gap-2">
                                    <Upload size={20} color = "#377dff"/>
                                    <p className="text-sm font-normal text-text-black">Drop your files here or <span className = "text-blue font-medium">Browse</span></p>
                                </div>
                            </div>
                            <input multiple id="dropzone-file" type="file" className="hidden" />
                        </label>
                    </div> 
                </div>
                <ul className="flex flex-col w-full gap-y-4">
                    <li className="w-full p-2 flex justify-between items-center border border-[#e0e0e0] rounded-md">
                        <div className="flex gap-3">
                            <img src={headphoneImg} alt="product image" className="w-10 h-10 object-contain rounded-md"/>
                            <div className="w-fit">
                                <p className="font-medium text-sm capitalize text-text-black">
                                    fruit apple top 01 png
                                </p>
                                <p className="mt-1 font-thin text-xs text-text-black capitalize">
                                    432kb
                                </p>
                            </div>
                        </div>
                        <Trash2 size = {20} color = "#121212"/>
                    </li>
                    <li className="w-full p-2 flex justify-between items-center border border-[#e0e0e0] rounded-md">
                        <div className="flex gap-3">
                            <img src={headphoneImg} alt="product image" className="w-10 h-10 object-contain rounded-md"/>
                            <div className="w-fit">
                                <p className="font-medium text-sm capitalize text-text-black">
                                    fruit apple top 01 png
                                </p>
                                <p className="mt-1 font-thin text-xs text-text-black capitalize">
                                    432kb
                                </p>
                            </div>
                        </div>
                        <Trash2 size = {20} color = "#121212"/>
                    </li>
                </ul>
            </div>
            {/* Right side panel for the add product page */}
            <div className="py-4 px-4 flex-1 border border-[#c0c0c0] rounded-md">
                <form id ="product-form" className="w-full">
                    <div className="w-full">
                        <label htmlFor="product-name" className="text-size-400 text-text-black font-medium mb-3">
                            Product Name
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter product name" 
                            id="product-name" 
                            name="product-name"
                            className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="sort" className="text-size-400 text-text-black font-medium mb-3">
                            Category
                        </label>
                        <div className="mt-3">
                            <Select id = "category" name="category" className="border border-[#c0c0c0] text-medium text-sm w-full" select={[{key: "category", value: "Select categories"}, {key: "electronics", value: "electronics"}, {key: "wearables", value: "wearables"}, {key: "gamings", value: "gamings"}, {key: "cameras", value: "cameras"}]}/>
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
                            className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="tax" className="text-size-400 text-text-black font-medium mb-3">
                            Tax rate
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter tax rate" 
                            id="tax" 
                            name="tax"
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
                            name="product-desc" 
                            id="product-desc" 
                            rows={3} 
                            placeholder="Write product descriptions"
                            className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                        > 
                        </textarea>
                    </div>
                </form>
            </div>
        </div>
    </Container>
  )
}

export default AddProduct