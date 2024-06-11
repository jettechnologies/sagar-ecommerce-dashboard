import React from "react"
import { twMerge } from "tailwind-merge";

interface Props{
    children: React.ReactNode;
    type?: "dark" | "light";
    className?: string;
}

const Container:React.FC<Props> = ({
    children,
    className,
    type = "light",
}) => {

    const typeClassNames = {
        dark: "bg-[#141718] text-white",
        light: "bg-white text-[#141718]",
      }

  return (
    <section className={twMerge("w-full h-full px-5 py-3", typeClassNames[type], className)}>
        {children}
    </section>
  )
}

export default Container