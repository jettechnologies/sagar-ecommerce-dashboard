import { DragEvent, useEffect, useState } from "react";
import { Images, Upload } from "lucide-react";

interface FormData {
    name: string;
    description: string;
    stock: string;
    price: string;
    productImage: File[] | [];
    categoryId: string;
}

interface Props{
    handleImgUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // setFormData?: React.Dispatch<React.SetStateAction<FormData>>
    setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
    setImgString?: React.Dispatch<React.SetStateAction<[] | {
        name: string;
        src: string;
    }[]>>;
}

export function FileDrop({
    handleImgUpload,
    setFormData,
    setImgString
}: Props) {
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);


  useEffect(() =>{
    if (setFormData && files.length > 0) {
        setFormData(prevFormData => ({
            ...prevFormData,
            productImage: [...prevFormData.productImage, ...files]
        }));
    }
  }, [setFormData, files]);

  // Define the event handlers
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);
  };

  const handleDrop = async(event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);

    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files);
    console.log(droppedFiles)
    setFiles(droppedFiles);

    const base64Strings = await Promise.all(
        droppedFiles.map(async file => {
            const src  = await readFileAsBase64(file);
            const fileName = file.name

            return{
                name: fileName,
                src
            }
        })
    );

    if (setImgString) {
        setImgString(prevImgString =>([
            ...prevImgString,
            ...base64Strings
        ]));
    }

}

const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

  return (

    <div 
        className="flex items-center justify-center w-full mt-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
        <label 
            htmlFor="dropzone-file" 
            className={`flex flex-col items-center justify-center w-full h-64 border-2 ${isOver ? "border-blue" : "border-[#c0c0c0]"} border-dashed rounded-lg cursor-pointer bg-[#f8f8f8] hover:border-blue`}
        >
            <div className="flex flex-col gap-y-4 items-center justify-center pt-5 pb-6">
                <Images size = {100} color="#121212" strokeWidth={1}/>
                    <div className="flex gap-2">
                        <Upload size={20} color = "#377dff"/>
                        <p className="text-sm font-normal text-text-black">Drop your files here or <span className = "text-blue font-medium">Browse</span></p>
                    </div>
            </div>
            <input 
                multiple 
                id="dropzone-file" 
                type="file" 
                onChange={handleImgUpload}
                 className="hidden" 
            />
        </label> 
    </div>
  );
}