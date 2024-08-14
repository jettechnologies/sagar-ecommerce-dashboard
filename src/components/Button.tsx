// import { twMerge } from "tailwind-merge";

// interface Props{
//   children: React.ReactNode;
//   size?: "small" | "medium" | "large";
//   type?: "black" | "white";
//   disabled?: boolean;
//   handleClick?: () => void;
//   className?: string;
// }

// const Button:React.FC<Props> = ({children, type = "black", size = "medium", className, handleClick, disabled }) => {


//   const sizeClassNames = {
//       small: "px-4 py-2",
//       medium: "px-6 py-3",
//       large: "px-10 py-4",
//   };

//   const typeClassNames = {
//     black: "bg-[#141718] text-white",
//     white: "bg-white text-[#141718] border border-black",
//   }

// return (
//   <button 
//     disabled = {disabled && disabled}
//     className={twMerge({`rounded-md font-semibold font-roboto cursor-pointer ${!disabled && "opacity-50 cursor-not-allowed"}`}, sizeClassNames[size], typeClassNames[type], className)}
//     onClick={handleClick}
//   >
//     {children}
//   </button>
// )
// }


// export default Button;


import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  type?: "black" | "white" | "danger";
  btnType?: "button" | "submit",
  disabled?: boolean;
  handleClick?: () => void;
  className?: string;
}

const Button: React.FC<Props> = ({ children, btnType = "button", type = "black", size = "medium", className, handleClick, disabled }) => {

  const sizeClassNames = {
    small: "px-4 py-2",
    medium: "px-6 py-3",
    large: "px-10 py-4",
  };

  const typeClassNames = {
    black: "bg-[#141718] text-white",
    white: "bg-white text-[#141718] border border-black",
    danger: "bg-red-500 text-white",
  }

  return (
    <button 
      type={btnType}
      disabled={disabled}
      className={twMerge(
        `rounded-md font-semibold font-roboto`,
        disabled ? "opacity-80 cursor-not-allowed" : "cursor-pointer",
        sizeClassNames[size],
        typeClassNames[type],
        className
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export default Button;
