import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/Modal";
// import Select from "@/components/Select";
import Button from "@/components/Button";
// import { useCategories } from "@/hooks/usCategories";
import { imageValidate } from "@/utils/imageValidate";
import { useAuth } from "@/context/authContext";
import useGetRequest from "@/pages/hooks/useGetRequest";
import { ProductType } from "@/types";
import { isArray } from "chart.js/helpers";

interface ProductContentType {
  name: string;
  description: string;
  price: string;
  stock: string;
//   categoryId: string;
  productimage: File | null;
}

interface EditProductType {
  isOpen: boolean;
  productId: string;
  content: ProductContentType;
  handleModalClose: () => void;
  setProductChange: React.Dispatch<React.SetStateAction<ProductContentType>>;
}

const EditProduct: React.FC<EditProductType> = ({
  isOpen,
  content,
  handleModalClose,
  setProductChange,
  productId,
}) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState("");
  const [response, setResponse] = useState("");

  console.log(resError, response)

    const { data:product, error:fetchError } = useGetRequest<ProductType>(`browse/fetch-one-product/${productId}`, {}, !!productId);
    console.log(fetchError)
    // loading and setting the product default values
    useEffect(() =>{
      if(!Array.isArray(product) && product) {
        setProductChange(prevState => ({
          ...prevState,
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          stock: product.stock.toString(),
        }));
        
      }
    }, [product, setProductChange]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setProductChange((prevData) => ({
      ...prevData,
      [name]: value.toLowerCase(),
    }));
  };

  const validateObject = <T extends Record<string, any>>(obj: T): boolean => {
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined || value === "") {
        throw new Error(`The value for key "${key}" is empty.`);
      }
    }
    return true;
  };

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files || files.length === 0) {
      return;
    }

    const imgArr = Array.from(files);
    const validate = imageValidate(imgArr);

    if (!validate) {
      console.log("The validation failed");
      return;
    }

    setProductChange((prevData) => ({
      ...prevData,
      productimage: imgArr[0],
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    try {
      validateObject(content);
    } catch (error) {
      console.log("All fields need to be filled");
      return;
    }

    formData.append("name", content.name);
    formData.append("description", content.description);
    formData.append("stock", content.stock);
    formData.append("price", content.price);
    // formData.append("categoryId", content.categoryId);
    formData.append("image", content.productimage as File);

    try {
      setLoading(true);
      const res = await fetch(
        `https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/product-mgt/edit-product/${productId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        console.log("Product updated successfully");
        setResponse("Product updated successfully");
      } else {
        const errorData = await res.json();
        console.error("Failed to update product:", errorData.message);
        setResError("Failed to update product: " + errorData.message);
      }

      navigate("/admin/products", { replace: true });
      window.location.reload();
    } catch (error: any) {
      console.error("Error:", error.message);
      setResError("Failed to update product");
    } finally {
      setLoading(false);
    }

  };

  return (
    <Modal
      title="Edit existing product"
      isOpen={isOpen}
      handleModalOpen={handleModalClose}
    >
      <form
        id="edit-category-form"
        className="w-full flex flex-col gap-y-2"
        onSubmit={handleFormSubmit}
      >
        <div className="w-full">
          <label
            htmlFor="product-name"
            className="text-size-400 text-text-black font-medium mb-3"
          >
            Update product Name
          </label>
          <input
            type="text"
            placeholder="Name a product"
            id="product-name"
            name="name"
            value = {content.name}
            onChange={handleInputChange}
            className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
          />
        </div>
        {/* <div className="w-full">
          <label
            htmlFor="sort"
            className="text-size-400 text-text-black font-medium mb-3"
          >
            Update product category
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
        </div> */}
        <div className="w-full">
          <label
            htmlFor="product-price"
            className="text-size-400 text-text-black font-medium mb-3"
          >
            Update product price
          </label>
          <input
            type="text"
            placeholder="Enter a price"
            id="product-price"
            name="price"
            value = {content.price}
            onChange={handleInputChange}
            className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="product-stock"
            className="text-size-400 text-text-black font-medium mb-3"
          >
            Update product stock
          </label>
          <input
            type="text"
            placeholder="Enter a stock amount"
            id="product-stock"
            name="stock"
            value = {content.stock}
            onChange={handleInputChange}
            className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="product-desc"
            className="text-size-400 text-text-black font-medium mb-3"
          >
            Update the product description
          </label>
          <textarea
            name="description"
            id="product-desc"
            rows={3}
            placeholder="Write category descriptions"
            onChange={handleInputChange}
            className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
          >
            {content.description}
          </textarea>
        </div>
        <div className="w-full">
          <label
            htmlFor="product-img"
            className="text-size-400 text-text-black font-medium mb-3"
          >
            Update product image
          </label>
          <input
            type="file"
            id="product-img"
            onChange={handleImgUpload}
            className="mt-3 rounded-md border border-[#c0c0c0] w-full p-3 font-roboto text-size-400 font-normal first-letter:uppercase"
          />
        </div>
        <Button size="large" className="w-full mt-4 uppercase">
          {loading ? "Loading..." : "Update product"}
        </Button>
      </form>
    </Modal>
  );
};

export default EditProduct;
