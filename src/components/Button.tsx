import { twMerge } from "tailwind-merge";

interface Props{
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  type?: "black" | "white";
  handleClick?: () => void;
  className?: string;
}

const Button:React.FC<Props> = ({children, type = "black", size = "medium", className, handleClick }) => {


  const sizeClassNames = {
      small: "px-4 py-2",
      medium: "px-6 py-3",
      large: "px-10 py-4",
  };

  const typeClassNames = {
    black: "bg-[#141718] text-white",
    white: "bg-white text-[#141718] border border-black",
  }

return (
  <button 
    className={twMerge("rounded-md font-semibold font-roboto cursor-pointer", sizeClassNames[size], typeClassNames[type], className)}
    onClick={handleClick}
  >
    {children}
  </button>
)
}


export default Button;
