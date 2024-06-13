import { CircleX } from "lucide-react"
import { twMerge } from "tailwind-merge";
import { useState } from "react";

interface Props{
    message: string;
    isCloseIcon?: boolean;
    type: "danger" | "warning" | "success";
    className?: string;
}

const Notification:React.FC<Props> = ({
    message,
    isCloseIcon = false,
    className,
    type
}) => {

    // const [isActive, setIsActive] = useState(true)

    const notificationType = {
        danger: "bg-red-500",
        warning: "bg-yellow",
        success: "bg-green-500",
    }

    // const status = isActive? "active" : "inActive";

    // const activeType = {
    //     active: "flex",
    //     inActive: "hidden",
    // }

  return (
    <div className={twMerge("py-2 px-4 flex items-center justify-between", notificationType[type], className )}>
        <p className="text-size-400 font-normal">{message}</p>
        {isCloseIcon && <div className="p-1 cursor-pointer"><CircleX size = {20} /></div>}
    </div>
  )
}

export default Notification