import { twMerge } from "tailwind-merge";


interface Props{
    children: React.ReactNode;
    className?: string
}

const Popup = ({children, className}: Props) =>{

    return(
        <div className={twMerge("rounded-md z-50 top-12 right-6 min-w-[16rem] p-4 flex flex-col shadow-md absolute bg-gray", className)}>
            {children}
        </div>
    );
}

export default Popup;