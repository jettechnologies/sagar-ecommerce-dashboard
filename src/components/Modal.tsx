import React from 'react'
import { X } from 'lucide-react';
import { twMerge } from "tailwind-merge";

interface Props{
    isOpen?: boolean;
    handleModalOpen?: () => void;
    children?: React.ReactNode;
    title?: string;
    className?:string;
}

const Modal:React.FC<Props> = ({
    isOpen,
    handleModalOpen,
    children,
    title,
    className,
}) => {

  return (
    <>
        {
            isOpen && (
            <div
                id="authentication-modal"
                tabIndex={-1}
                aria-hidden={!isOpen}
                className="fixed font-roboto top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full overflow-y-auto"
            >
                <div className="fixed inset-0 bg-black opacity-40 z-40"></div>
                <div className={twMerge("relative p-4 w-full max-w-md max-h-full z-50", className)}>
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-text-black dark:text-white first-letter:uppercase">
                        {title}
                        </h3>
                        <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={handleModalOpen}
                        aria-label="Close modal"
                        >
                        <X color="#121212" />
                        </button>
                    </div>
                    <div className="p-4 md:p-5 overflow-y-auto max-h-[calc(100vh-10rem)]">
                        {children}
                    </div>
                    </div>
                </div>
            </div>
            )
        }
    </>
  )
}

export default Modal