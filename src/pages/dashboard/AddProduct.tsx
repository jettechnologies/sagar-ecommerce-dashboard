import Container from "@/components/Container";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { useCategories } from "../hooks/usCategories";
import { useCallback, useEffect, useState } from "react";
import { FileDrop } from "@/components/FileDrop";
// import { imageValidate } from "@/utils/imageValidate";
// import { useUserForm } from "../hooks/useUserForm";
import { useNavigate } from "react-router-dom";
// import MultiSelect from "@/components/MultiSelect";

export interface ProductData {
  name: string;
  description: string;
  stock: string;
  price: string;
  productimage: File | string;
  taxRate: string;
  wholesalePrice: string;
  minWholesaleQuantity: string;
  categoryId: string;
}

// const easyHttp = new EasyHTTP();

const AddProduct = () => {
  // const { response, loading, resError, getUserFormData} = useUserForm();
  const navigate = useNavigate();
  const { categories, getCategories } = useCategories();
  const [loading, setLoading] = useState<boolean>(false);
  const [resError, setResError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    stock: "",
    price: "",
    productimage: "",
    categoryId: "",
    wholesalePrice: "",
    minWholesaleQuantity: "",
    taxRate: ""
  });

  const [variants, setVariants] = useState<{color: string; size: string}>({
    color: "",
    size: "",
  });
  const [colors, setColors] = useState<string []>([]);
  const [sizes, setSizes] = useState<string []>([]);


  const handleVariants = (
    e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement 
    >
  ) =>{
    const target = e.target as HTMLInputElement;
    const { name, value } = target;

    console.log(value)

    // setProductData({ ...formData, [name]: label.toLocaleLowerCase() });
    setVariants((prevState) => ({
        ...prevState,
        [name]: value.toLocaleLowerCase(),
      }));
  }

  const handleKeyUp = useCallback(() => {
    if (variants.color !== "") {
      const colorArray = variants.color.split(",");
      const trimmedColors = colorArray.map(color => color.trim());
      console.log(trimmedColors)
      setColors(trimmedColors);
    } 
    else if (variants.size !== "") {
      const sizeArray = variants.size.split(",");
      const trimmedSizes = sizeArray.map(size => size.trim());
      console.log(trimmedSizes)
      setSizes(trimmedSizes);
    }
  }, [variants.color, variants.size]);
  

//   useEffect(() =>{
      
//   }, [variants.color, variants.size]);

  const [token, setToken] = useState<string>("");

  const [imgString, setImgString] = useState<
    { name: string; src: string }[] | []
  >([]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
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

  const productCategories: { key: string; value: string }[] = categories.map(
    (category) => ({
      key: category.id.toLocaleString(),
      value: category.name,
    })
  );

  console.log(colors, sizes, variants)

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;

    console.log(value, name)

    // if(name === "wholesalePrice" || name === "price" || name === "stock" || name === "taxRate" || name === "minWholesaleQuantity"){
    //     setProductData((prevFormData) => ({
    //         ...prevFormData,
    //         [name]: parseFloat(value),
    //       }));
    // }

    // setProductData({ ...formData, [name]: label.toLocaleLowerCase() });
    setProductData((prevFormData) => ({
        ...prevFormData,
        [name]: value.toLocaleLowerCase(),
      }));

  };

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { files } = target;

    if (!files || files.length === 0) {
      return;
    }

    const imgArr = Array.from(files);
    // const validate = imageValidate(imgArr);

    // if (!validate) {
    //   console.log("the validation failed");

    //   return;
    // }

    setProductData((prevFormData) => ({
      ...prevFormData,
      productimage: imgArr[0],
    }));

    imgArr.forEach((file) => {
      const reader = new FileReader();
      const fileName = file.name;

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const base64String = event.target?.result as string;
          setImgString((prevImgString) => [
            ...prevImgString,
            { name: fileName, src: base64String },
          ]);
        };
      };

      reader.readAsDataURL(file);
    });
  };


//   const deleteItem = (index: number) => {
//     setImgString((prevImgString) => {
//       const newImgString = [...prevImgString];
//       newImgString.splice(index, 1);
//       return newImgString;
//     });

//     // Delete from productImage (assuming it's also an array of { name: string, src: string })
//     setProductData((prevFormData) => {
//       const newProductImage = [...prevFormData.productimage];
//       newProductImage.splice(index, 1);
//       return {
//         ...prevFormData,
//         productimage: newProductImage,
//       };
//     });
//   };

console.log(productData, colors, sizes)

const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append image
    formDataToSend.append("image", productData.productimage);
    formDataToSend.append("available_sizes", variants.size);
    formDataToSend.append("available_colors", variants.color);

    // Append other fields
    formDataToSend.append("name", productData.name);
    formDataToSend.append("description", productData.description);
    formDataToSend.append("stock", productData.stock);
    formDataToSend.append("price", productData.price);
    formDataToSend.append("categoryId", productData.categoryId);
    formDataToSend.append("wholesalePrice", productData.wholesalePrice);
    formDataToSend.append("minWholesaleQuantity", productData.minWholesaleQuantity);

    // Append optional fields if they exist
    // if (productData.taxRate !== undefined) {
    //     formDataToSend.append("taxRate", productData.taxRate);
    // }

    // if (productData.hasTax !== undefined) {
    //     formDataToSend.append("hasTax", productData.hasTax.toString());
    // }

    // Log the form data for debugging
    for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
    }

    // Send the request
    try {
        setLoading(true);
        const res = await fetch(
            "https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/product-mgt/new-product",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            }
        );

        if (res.ok) {
            console.log('Product created successfully');
            setResponse('Product created successfully');
        } else {
            const errorData = await res.json();
            console.error('Failed to create product:', errorData.message);
            setResError('Failed to create product: ' + errorData.message);
        }
    } catch (error: any) {
        console.error('Error:', error.message);
        setResError('Failed to create product');
    } finally {
        setLoading(false);
    }

    navigate("/admin/products", {replace: true});

  console.log(resError, response)
};

//   console.log(response, resError);



  return (
    <Container className="mt-4 min-h-screen">
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
            <p className="text-sm font-normal capitalize text-text-text-black">
              add image
            </p>
            <FileDrop
              name = "productimage"
              handleImgUpload={handleImgUpload}
              setProductData={setProductData}
              setImgString={setImgString}
            />
          </div>
          <ul className="flex flex-col w-full gap-y-4">
            {imgString.map((img, index) => {
              const nameArr = img.name.split(".");

              return (
                <li
                  value={index}
                  key = {index}
                  className="w-full p-2 flex justify-between items-center border border-[#e0e0e0] rounded-md"
                >
                  <div className="flex gap-3">
                    <img
                      src={img.src}
                      alt="product image"
                      className="w-10 h-10 object-contain rounded-md"
                    />
                    <div className="w-fit">
                      <p className="font-medium text-sm capitalize text-text-black">
                        {`${nameArr[0]} ${nameArr[1]}`}
                      </p>
                      {/* <p className="mt-1 font-thin text-xs text-text-black capitalize">
                                            432kb
                                        </p> */}
                    </div>
                  </div>
                  {/* <div
                    onClick={() => deleteItem(index)}
                    className="p-2 cursor-pointer"
                  >
                    <Trash2 size={20} color="#121212" />
                  </div> */}
                </li>
              );
            })}
          </ul>
        </div>
        {/* Right side panel for the add product page */}
        <div className="py-4 px-4 flex-1 border border-[#c0c0c0] rounded-md">
          <form
            id="product-form"
            onSubmit={handleFormSubmit}
            className="w-full"
          >
            <div className="w-full">
              <label
                htmlFor="product-name"
                className="text-size-400 text-text-black font-medium mb-3"
              >
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
              <label
                htmlFor="sort"
                className="text-size-400 text-text-black font-medium mb-3"
              >
                Category
              </label>
              <div className="mt-3">
                <Select
                  id="category"
                  name="categoryId"
                  className="border border-[#c0c0c0] text-medium text-sm w-full"
                  select={productCategories}
                  defaultText="Categories"
                  handleInputChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full">
              <label
                htmlFor="total-stock"
                className="text-size-400 text-text-black font-medium mb-3"
              >
                total-stock
              </label>
              <input
                type="number"
                placeholder="Enter total stock"
                id="total-stock"
                name="stock"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="tax-rate"
                className="text-size-400 text-text-black font-medium mb-3"
              >
                Tax rate
              </label>
              <input
                type="number"
                placeholder="Enter tax rate"
                id="tax-rate"
                name="taxRate"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="unit-price"
                className="text-size-400 text-text-black font-medium mb-3"
              >
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
              <label
                htmlFor="wholesale-price"
                className="text-size-400 text-text-black font-medium mb-3"
              >
                Wholesale price
              </label>
              <input
                type="number"
                placeholder="Enter wholesale price"
                id="wholesale-price"
                name="wholesalePrice"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="min-wholesale-unit"
                className="text-size-400 text-text-black font-medium mb-3"
              >
                Minimum wholesale unit
              </label>
              <input
                type="number"
                placeholder="Enter minimum wholesale unit"
                id="min-wholesale-unit"
                name="minWholesaleQuantity"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="product-desc"
                className="text-size-400 text-text-black font-medium mb-3"
              >
                Descriptions
              </label>
              <textarea
                name="description"
                id="product-desc"
                rows={3}
                placeholder="Write product descriptions"
                onChange={handleInputChange}
                className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
              ></textarea>
            </div>
            <div className="w-full flex flex-col gap-y-2">
              {/* <div className="w-full">
                <label
                    htmlFor="available-colors"
                    className="text-size-400 text-text-black font-medium mb-3"
                >
                    Available Colors
                </label>
                <div className="mt-3">
                    <Select
                    id="available-colors"
                    name="color"
                    className="border border-[#c0c0c0] text-medium text-sm w-full"
                    select={availableColors}
                    defaultText="Available Colors"
                    handleInputChange={handleVariants}
                    />
                </div>
              </div> */}
              <div className="w-full">
                    <label
                        htmlFor="available_colors"
                        className="text-size-400 text-text-black font-medium mb-3"
                    >
                        Available Colors
                    </label>
                    <input
                        type="text"
                        placeholder="Enter list of available colors with a comma dividing them"
                        id="available_colors"
                        name="color"
                        onChange={handleVariants}
                        onBlur={handleKeyUp}
                        onKeyDown={(e) =>{
                            (e.key === "Enter") && handleKeyUp();
                        }}
                        className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                    />
                </div>
              <div className="flex gap-2 flex-wrap">
                {   
                    colors.map((color, index) =>(
                        <div className="py-2 px-5 bg-gray text-black text-sm" key={index}>
                            {color}
                        </div>
                    ))
                }
              </div>
            </div>
            <div className="w-full flex flex-col gap-y-2">
              {/* <div className="w-full">
                <label
                    htmlFor="available-sizes"
                    className="text-size-400 text-text-black font-medium mb-3"
                >
                    Available Sizes
                </label>
                <div className="mt-3">
                    <Select
                    id="available-sizes"
                    name="size"
                    className="border border-[#c0c0c0] text-medium text-sm w-full"
                    select={availableSizes}
                    defaultText="Available sizes"
                    handleInputChange={handleVariants}
                    />
                </div>
              </div> */}
                <div className="w-full">
                    <label
                        htmlFor="available_sizes"
                        className="text-size-400 text-text-black font-medium mb-3"
                    >
                        Available Sizes
                    </label>
                    <input
                        type="text"
                        placeholder="Enter list of available size with a comma dividing them"
                        id="available_sizes"
                        name="size"
                        onChange={handleVariants}
                        onBlur={handleKeyUp}
                        onKeyDown={(e) =>{
                            e.key === "Enter" && handleKeyUp()
                        }}
                        className="mt-3 border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
                    />
                </div>
              <div className="flex gap-2 flex-wrap">
                {   
                    sizes.map((size, index) =>(
                        <div className="py-2 px-5 bg-gray text-black text-sm" key={index}>
                            {size}
                        </div>
                    ))
                }
              </div>
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
  );
};

export default AddProduct;
